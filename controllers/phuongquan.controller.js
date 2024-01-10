const User = require("../models/users.model");
const Billboard = require("../models/bill-board.model");
const Report = require("../models/report.model");
const License = require("../models/license.model");
const Request = require("../models/request.model");

const fs = require("fs");
const nodemailer = require("nodemailer");
const db = require("../database/database");

const { ObjectId } = require("mongodb");

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
  if (
    req.path === "/dashboard/advertise" ||
    req.path === "/dashboard/license"   ||
    req.path === "/dashboard"
  ) {
    return obj.properties.place;
  }
  if (req.path === "/dashboard/report") {
    return obj.place;
  }
  if (req.path === "/dashboard/request/edit") {
    return obj.billboard[0].properties.place;
  }
};

const compareLocation = (req, address) => {
  if (req.session.district) {
    if (
      address.split(", ")[2] !== req.session.district &&
      address.split(", ")[2].indexOf(req.session.district + " ") < 0
    ) {
      return false;
    }
  }
  if (req.session.ward) {
    return (
      address.split(", ")[1] === req.session.ward ||
      address.split(", ")[1].indexOf(req.session.ward + " ") >= 0
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
    arr.map(e1 => {
        e1.properties.boards = e1.properties.boards.map(
          e2 => {
            if (!e2.license) return e2;
            e2.license = e2.license.filter(
              processFilterQuery(req, e3 => e3.state, [0, 1, 4, 2], "license"));
            return e2;
          }
        );
        e1.properties.boards = e1.properties.boards.filter(e2 => e2.license.length > 0);
        return e1;
      });
    arr = arr.filter(e => e.properties.boards.length > 0);
  } else if (req.path === "/dashboard/advertise") {
    arr.map(e1 => {
      e1.properties.boards = e1.properties.boards.map(
        e2 => {
          e2.license = e2.license.filter(
            processFilterQuery(req, e3 => e3.state, [0, 1, null, 4, 2], "license"));
          return e2;
        }
      );
      if (req.query.license1 || 
          req.query.license2 || 
          req.query.license3 || 
          req.query.license4 || 
          req.query.license5) {
        e1.properties.boards = e1.properties.boards.filter(e2 => e2.license.length > 0);
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
  let billboards = await db.getDb().collection("billboards").find({}).toArray();
  let ward = res.locals.ward ? res.locals.ward : "";
  let district = res.locals.district ? res.locals.district : "";
  let reports = [];

  billboards = billboards.filter((i) => {
    if (ward == "" && district == "") return i;
    let address = i?.properties?.place.split(", ");

    if (
      (address.find((a) => a == ward) || !ward) &&
      (address.find((a) => a == district) || !district)
    ) {
      return i;
    }
  });

  if (res.locals.type_user == 1) {
    reports = await db.getDb().collection("reports").find().toArray();

    reports = reports.filter((i) => {
      if (ward == "" && district == "") return i;
      let address = i?.properties?.place.split(", ");

      if (
        (address.find((a) => a == ward) || !ward) &&
        (address.find((a) => a == district) || !district)
      ) {
        return i;
      }
    });
    let places = [];
    let newRP = [];
    for (let i = 0; i < reports.length; ++i) {
      if (!places.includes(reports[i].properties.place)) {
        places.push(reports[i].properties.place);
      }
    }
    let temp = reports.slice();
    for (let i = 0; i < places.length; ++i) {
      newRP[i] = temp[i];
      newRP[i].properties.details = temp.map((j) => {
        if (j.properties.place === places[i]) {
          return { ...j.properties };
        }
      });
      console.log("details ", newRP[i].properties);
    }

    console.log(reports);
    return res.render("phan-cum-phuong/trangchu", {
      action: false,
      billboards: billboards,
      reports: newRP,
    });
  } else if (response.locals.type_user == 2) {
    return res.redirect("/management/billboards");
  }
};

//Danh sách bảng quảng cáo
const _get_advertisement = async (req, res) => {
  res.locals.billboards = await db
    .getDb()
    .collection("billboard")
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
  res.render("phan-cum-phuong/quanlyquangcao");
};

//Yêu cầu cấp phép biển quáng cáo
const _get_license = async (req, res) => {
  res.locals.billboards = await db
    .getDb()
    .collection("billboard")
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
  let { id, board_id, email, from, name, contact, start, end, details } = req.body;
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
          state: state,
          handling_method: handling_method,
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
    .collection("requests")
    .aggregate([
      {
        $lookup: {
          from: "billboard",
          localField: "billboard",
          foreignField: "_id",
          as: "billboard",
        },
      },
    ])
    .toArray();
  res.locals.requests = processQuery(req, res.locals.requests);
  res.locals.ward_list = getWardList(req);
  res.render("phan-cum-phuong/danhsachchinhsua");
};

const _post_request_edit = async (req, res) => {
  let { id, details, type, status, type_advertise, place_type } = req.body;
  let billboard_type;
  let land_type;
  let ad_type;

  switch (type) {
    case "1":
      billboard_type = "Trụ/Cụm pano";
      break;
    case "2":
      billboard_type = "Trụ bảng hiflex";
      break;
    case "3":
      billboard_type = "Trụ màn hình điện tử LED";
      break;
    case "4":
      billboard_type = "Trụ hộp đèn";
      break;
    case "5":
      billboard_type = "Bảng hiflex ốp tường";
      break;
    case "6":
      billboard_type = "Màn hình điện tử ốp tường";
      break;
    case "7":
      billboard_type = "Trụ treo băng rôn dọc";
      break;
    case "8":
      billboard_type = "Trụ treo băng rôn ngang";
      break;
    case "9":
      billboard_type = "Cổng chào";
      break;
    case "10":
      billboard_type = "Trung tâm thương mại";
      break;
  }

  switch (type_advertise) {
    case "1":
      ad_type = "Cổ động chính trị";
      break;
    case "2":
      ad_type = "Quảng cáo thương mại";
      break;
    case "3":
      ad_type = "An toàn giao thông";
      break;
    case "4":
      ad_type = "Xã hội hoá";
      break;
    case "5":
      ad_type = "Mỹ phẩm";
      break;
    case "6":
      ad_type = "Đồ ăn";
      break;
    case "7":
      ad_type = "Điện ảnh";
      break;
  }

  switch (place_type) {
    case "1":
      land_type = "Đất công/Công viên/Hành lang an toàn giao thông";
      break;
    case "2":
      land_type = "Đất tư nhân/Nhà ở riêng lẻ";
      break;
    case "3":
      land_type = "Trung tâm thương mại";
      break;
    case "4":
      land_type = "Chợ";
      break;
    case "5":
      land_type = "Cây xăng";
      break;
    case "6":
      land_type = "Nhà chờ xe buýt";
      break;
    case "7":
      land_type = "Trường Học";
      break;
  }

  let images = req.files.map((v) => {
    return (v.destination + "/" + v.filename).substring(6);
  });

  let change = new Billboard(
    req.body.type_billboard,
    null,
    {
      place: req.body.place,
      place_type: land_type,
      type: billboard_type,
      type_advertise: ad_type,
      zoning: status == 1 ? true : false,
    },
    req.body.name
      ? new License(
          null,
          req.body.name,
          req.body.contact,
          req.body.start,
          req.body.end,
          images
        )
      : null
  );

  let request = new Request(
    new ObjectId(res.locals.uid),
    new ObjectId(id),
    change.properties,
    images,
    details,
    0,
    change.license
  );

  if (await request.send_request()) console.log("send!");
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
