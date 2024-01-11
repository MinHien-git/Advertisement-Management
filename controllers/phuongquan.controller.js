const User = require("../models/users.model");
const Billboard = require("../models/bill-board.model");
const Report = require("../models/report.model");
const License = require("../models/license.model");
const Request = require("../models/billboardrequest.model");

const fs = require("fs");
const nodemailer = require("nodemailer");
const db = require("../database/database");

const { ObjectId } = require("mongodb");
const BillboardRequest = require("../models/billboardrequest.model");
const BoardRequest = require("../models/boardrequest.model");

const district_list = JSON.parse(
  fs.readFileSync(__dirname + "/../district-ward-list.json")
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lmhien21@clc.fitus.edu.vn",
    pass: "LMinhHien16102003",
  },
});

const getAddress = (req, obj) => {
  if (req.path === "/dashboard/request/edit") {
    return obj.billboard[0]?.properties?.place;
  } else {
    return obj.properties.place;
  }
};

const compareLocation = (req, address) => {
  if (req.session.district) {
    if (
      address?.split(", ")[2] !== req.session.district &&
      address?.split(", ")[2].indexOf(req.session.district + " ") < 0
    ) {
      return false;
    }
  }
  if (req.session.ward) {
    return (
      address?.split(", ")[1] === req.session.ward ||
      address?.split(", ")[1].indexOf(req.session.ward + " ") >= 0
    );
  }
  return true;
};

const getWardList = (req) => {
  if (!req.session?.ward) {
    const district = district_list.filter((e) => {
      return e.district == req.session.district;
    });
    district[0]?.wards.forEach((e) => {
      e.ward = e.ward.replace("Phường ", "");
      e.ward = e.ward.replace("Xã ", "");
    });
    return district[0]?.wards;
  }
  return null;
};

const processFilterQuery = (req, mapping, values, query_name) => {
  return (e) => {
    let have_query = false;
    for (let i = 0; i < values.length; i += 1) {
      if (req.query[query_name + (i + 1).toString()]) {
        if (mapping(e) == values[i]) {
          return true;
        }
        have_query = true;
      }
    }
    return !have_query;
  };
};

const processQuery = (req, arr) => {
  arr = arr.filter((e) => {
    return compareLocation(req, getAddress(req, e));
  });

  if (req.query.search) {
    arr = arr.filter((e) => {
      return getAddress(req, e).indexOf(req.query.search) >= 0;
    });
  }

  if (req.query.report) {
    arr = arr.filter((e) => {
      if (e.state == 0) {
        return req.query.report == 0;
      } else {
        return !(req.query.report == 0);
      }
    });
  }

  if (!req.session.ward) {
    const wards = getWardList(req).map((e) => e.ward);
    arr = arr.filter(
      processFilterQuery(
        req,
        (e) => getAddress(req, e).split(", ")[1],
        wards,
        "ward"
      )
    );
  }

  if (req.path === "/dashboard/license") {
    arr.map((e1) => {
      e1.properties.boards = e1.properties.boards.map((e2) => {
        if (!e2.license) return e2;
        e2.license = e2.license.filter(
          processFilterQuery(req, (e3) => e3.state, [0, 1, 4, 2], "license")
        );
        return e2;
      });
      e1.properties.boards = e1.properties.boards.filter(
        (e2) => e2.license.length > 0
      );
      return e1;
    });
    arr = arr.filter((e) => e.properties.boards.length > 0);
  } else if (req.path === "/dashboard/advertise") {
    arr.map((e1) => {
      e1.properties.boards = e1.properties.boards.map((e2) => {
        e2.license = e2.license.filter(
          processFilterQuery(
            req,
            (e3) => e3.state,
            [0, 1, null, 4, 2],
            "license"
          )
        );
        return e2;
      });
      if (
        req.query.license1 ||
        req.query.license2 ||
        req.query.license3 ||
        req.query.license4 ||
        req.query.license5
      ) {
        e1.properties.boards = e1.properties.boards.filter(
          (e2) => e2.license.length > 0
        );
      }
      return e1;
    });
  }

  arr = arr.filter(
    processFilterQuery(req, (e) => e.type, [0, 1, 2, 3], "report_type")
  );
  arr = arr.filter(processFilterQuery(req, (e) => e.state, [1, 0], "request"));

  if (req.query.sort) {
    if (req.query.sort == 0) {
      arr.sort((a, b) => {
        return getAddress(req, a).localeCompare(getAddress(req, b));
      });
    } else {
      arr.sort((a, b) => {
        return getAddress(req, b).localeCompare(getAddress(req, a));
      });
    }
  }

  return arr;
};

const _user_checkpoint = (req, res, next) => {
  if (req.session) next();
};

const _profile = async (req, res) => {
  let { id } = req.params;
  if (id != res.locals.uid) {
    redirect("/");
  }
  res.locals.profile = await db
    .getDb()
    .collection("users")
    .findOne({ _id: new ObjectId(id) });
  console.log(res.locals.profile);
  res.render("phan-cum-phuong/profilecanbo");
};

const _post_profile = async (req, res) => {
  let { id } = req.params;
  let { name, password, birth, phone } = req.body;
  let new_infomation = {};

  if (name !== "") {
    new_infomation.name = name;
  }
  if (password !== "") {
    new_infomation.password = password;
  }
  if (birth !== "") {
    new_infomation.date = birth;
  }
  if (phone !== "") {
    new_infomation.phone = phone;
  }

  if (id != res.locals.uid) {
    redirect("/");
  }
  await db
    .getDb()
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...new_infomation } }
    );
  res.redirect("/dashboard/profile/" + id);
};

const _get_map = async (req, res) => {
  let billboards = await db.getDb().collection("billboards").find().toArray();
  let reports = [];
  let placeType = await db.getDb().collection("place_types").find().toArray();
  let type_advertise = await db.getDb().collection("ad_types").find().toArray();

  billboards = billboards.filter((i) => {
    return compareLocation(req, i.properties.place);
  });

  if (res.locals.type_user == 1) {
    reports = await db.getDb().collection("reports").find().toArray();

    reports = reports.filter((i) => {
      return compareLocation(req, i.properties.place);
    });

    let places = [];
    let newRP = [];
    for (let i = 0; i < reports.length; ++i) {
      if (!places.includes(reports[i].properties.place)) {
        places.push(reports[i].properties.place);
      }
    }

    newRP = places
      .map((e) => billboards.find((b) => e == b.properties.place))
      .map((e) => {
        e.properties.details = reports
          .filter((e1) => e1.properties.place === e.properties.place)
          .map((e1) => {
            return { ...e1.properties };
          });
        return e;
      });

    // for (let i = 0; i < places.length; ++i) {
    //   newRP[i] = temp[i];
    //   newRP[i].properties.details = temp.map((j) => {
    //     if (j.properties.place === places[i]) {
    //       return { ...j.properties };
    //     }
    //   });
    // }
    console.log(type_advertise);
    return res.render("phan-cum-phuong/trangchu", {
      action: false,
      billboards: billboards,
      reports: newRP,
      placeType: placeType,
      type_advertise: type_advertise,
    });
  } else if (response.locals.type_user == 2) {
    return res.redirect("/management/billboards");
  } else {
    return res.redirect("/");
  }
};

//Danh sách bảng quảng cáo
const _get_advertisement = async (req, res) => {
  let placeType = await db.getDb().collection("place_types").find().toArray();
  let type_advertise = await db.getDb().collection("ad_types").find().toArray();
  res.locals.billboards = await db
    .getDb()
    .collection("billboards")
    .aggregate([
      {
        $unwind: "$properties.boards",
      },
      {
        $lookup: {
          from: "licenses",
          localField: "properties.boards.license",
          foreignField: "_id",
          as: "properties.boards.license",
        },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          "properties.place": 1,
          "properties.place_type": 1,
          "properties.type_advertise": 1,
          "properties.status": 1,
          "properties.board_amount": 1,
          boards: "$properties.boards",
          geometry: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          type: {
            $first: "$type",
          },
          properties: {
            $first: "$properties",
          },
          boards: {
            $push: "$boards",
          },
          geometry: {
            $first: "$geometry",
          },
        },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          "properties.place": 1,
          "properties.place_type": 1,
          "properties.type_advertise": 1,
          "properties.status": 1,
          "properties.board_amount": 1,
          "properties.boards": "$boards",
          geometry: 1,
        },
      },
    ])
    .toArray();
  res.locals.billboards = processQuery(req, res.locals.billboards);
  res.locals.ward_list = getWardList(req);

  res.render("phan-cum-phuong/quanlyquangcao", {
    placeType: placeType,
    type_advertise: type_advertise,
  });
};

//Yêu cầu cấp phép biển quáng cáo
const _get_license = async (req, res) => {
  res.locals.billboards = await db
    .getDb()
    .collection("billboards")
    .aggregate([
      {
        $unwind: "$properties.boards",
      },
      {
        $lookup: {
          from: "licenses",
          localField: "properties.boards.license",
          foreignField: "_id",
          as: "properties.boards.license",
        },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          "properties.place": 1,
          "properties.place_type": 1,
          "properties.type_advertise": 1,
          "properties.status": 1,
          "properties.board_amount": 1,
          boards: "$properties.boards",
          geometry: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          type: {
            $first: "$type",
          },
          properties: {
            $first: "$properties",
          },
          boards: {
            $push: "$boards",
          },
          geometry: {
            $first: "$geometry",
          },
        },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          "properties.place": 1,
          "properties.place_type": 1,
          "properties.type_advertise": 1,
          "properties.status": 1,
          "properties.board_amount": 1,
          "properties.boards": "$boards",
          geometry: 1,
        },
      },
    ])
    .toArray();

  res.locals.billboards = processQuery(req, res.locals.billboards);

  res.locals.ward_list = getWardList(req);
  res.render("phan-cum-phuong/danhsachcapphep");
};

const _post_license_request = async (req, res) => {
  let { id, board_id, email, from, name, contact, start, end, details } =
    req.body;
  let images = req.files.map((v) => {
    return (v.destination + "/" + v.filename).substring(6);
  });

  let license = new License(
    {
      billboard_id: new ObjectId(id),
      board_id: new ObjectId(board_id),
    },
    name,
    contact,
    start,
    end,
    1,
    images
  );
  if (license.send_licences_request()) console.log("send!");
  return res.redirect("/dashboard/license");
};

const _post_cancel_license = async (req, res) => {
  let { id } = req.body;
  let request = await License.cancel_request(id);
  return res.redirect("/dashboard/license");
};

//Thông tin báo cáo
const _get_report = async (req, res) => {
  res.locals.reports = await db
    .getDb()
    .collection("reports")
    .find({})
    .toArray();
  res.locals.reports = processQuery(req, res.locals.reports);
  res.locals.ward_list = getWardList(req);
  res.render("phan-cum-phuong/danhsachbaocao");
};

const _get_report_information = async (req, res) => {
  res.locals.report = await db
    .getDb()
    .collection("reports")
    .findOne({ _id: new ObjectId(req.params.id) });
  res.render("phan-cum-phuong/chitietbaocao");
};

//Giải quyết quảng cáo
const _post_report_edit = async (req, res) => {
  let { handling_method, state } = req.body;
  let id = req.params;

  const report = await db
    .getDb()
    .collection("reports")
    .findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          "properties.state": state,
          "properties.handling_method": handling_method,
        },
      }
    );

  if (report) {
    const mailOptions = {
      from: "my@gmail.com",
      to: report.sender_email,
      subject: "Quản lý quảng cáo - Báo cáo của bạn đã được giải quyết",
      html: `
      <p>Báo cáo bạn gửi đã được giải quyết</p>

      <p>Địa điểm báo cáo: ${report.place}</p>

      <p>Cách xử lý: ${handling_method}</p>

      <p>Nội dung báo cáo của bạn: ${report.details} </p>
  
      <p>Vui lòng không phản hồi lại email này.</p>`,
    };

    transporter.sendMail(mailOptions, (error, _info) => {
      if (error) {
        console.error("Error sending email: ", error);
        res.status(500).send({ message: "Failed to send email" });
      }
    });
  }
  return res.redirect("/dashboard/report");
};

const _get_request_edit = async (req, res) => {
  res.locals.requests = await db
    .getDb()
    .collection("board-request")
    .aggregate([
      {
        $lookup: {
          from: "billboards",
          localField: "billboard",
          foreignField: "_id",
          as: "billboard",
        },
      },
    ])
    .toArray();
  res.locals.requests.concat(
    await db
      .getDb()
      .collection("billboard-request")
      .aggregate([
        {
          $lookup: {
            from: "billboards",
            localField: "billboard",
            foreignField: "_id",
            as: "billboard",
          },
        },
      ])
      .toArray()
  );
  console.log(res.locals.requests);
  //res.locals.requests = processQuery(req, res.locals.requests);
  //res.locals.ward_list = getWardList(req);
  res.render("phan-cum-phuong/danhsachchinhsua");
};

const _post_request_edit = async (req, res) => {
  if (req.body.select_option == 0) {
    let { billboard, place_type, advertise_type, status, details } = req.body;
    let request = new BillboardRequest(
      billboard,
      place_type,
      advertise_type,
      status,
      details
    );
    if (await request.send_request()) console.log("send!");
  } else {
    let { billboard, board_type, size, details } = req.body;
    let value = board_type.split("|");
    let request = new BoardRequest(
      billboard,
      value[1],
      value[0],
      size,
      details,
      select_option
    );
    if (await request.send_request()) console.log("send!");
  }

  return res.redirect("/dashboard/license");
};

module.exports = {
  _get_map,
  _get_advertisement,
  _get_license,
  _post_cancel_license,
  _post_license_request,
  _get_report,
  _get_report_information,
  _post_report_edit,
  _get_request_edit,
  _post_request_edit,
  _profile,
  _post_profile,
};
