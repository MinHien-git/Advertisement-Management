const User = require("../models/users.model");
const Billboard = require("../models/bill-board.model");
const Report = require("../models/report.model");
const License = require("../models/license.model");
const Request = require("../models/request.model");

const db = require("../database/database");

const { ObjectId } = require("mongodb");

const _process_query = (req, arr) => {
  if (req.query.search) {
    if (req.path == "/dashboard/advertise") {
      arr = arr.filter((e) => {
        return e.properties.place.indexOf(req.query.search) >= 0;
      });
    }
    if (req.path == "/dashboard/report") {
      arr = arr.filter((e) => {
        return e.place.indexOf(req.query.search) >= 0;
      });
    }
    if (req.path == "/dashboard/request/edit") {
      arr = arr.filter((e) => {
        return e.billboard.properties.place.indexOf(req.query.search) >= 0;
      });
    }
  }

  if (req.query.license1 || req.query.license2 || req.query.license3) {
    arr = arr.filter((e) => {
      return (
        (e.license?.state === 0 && req.query.license1) ||
        (e.license?.state === 1 && req.query.license2) ||
        (!e.license && req.query.license3)
      );
    });
  }

  if (req.query.report) {
    arr = arr.filter((e) => {
      if (req.query.report == 0) {
        return e.state === 0;
      } else {
        return !(e.state === 0);
      }
    });
  }

  if (
    req.query.report_type1 ||
    req.query.report_type2 ||
    req.query.report_type3 ||
    req.query.report_type4
  ) {
    arr = arr.filter((e) => {
      return (
        (e.type === 0 && req.query.report_type1) ||
        (e.type === 1 && req.query.report_type2) ||
        (e.type === 2 && req.query.report_type3) ||
        (e.type === 3 && req.query.report_type4)
      );
    });
  }

  if (req.query.request1 || req.query.request2) {
    arr = arr.filter((e) => {
      return (
        (e.state === 1 && req.query.request1) ||
        (e.state === 0 && req.query.request2)
      );
    });
  }

  if (req.query.sort) {
    if (req.path == "/dashboard/advertise") {
      if (req.query.sort == 0) {
        arr.sort((a, b) => {
          a.properties.place.localeCompare(b.properties.place);
        });
      } else {
        arr.sort((a, b) => {
          b.properties.place.localeCompare(a.properties.place);
        });
      }
    }
    if (req.path == "/dashboard/report") {
      if (req.query.sort == 0) {
        arr.sort((a, b) => {
          a.place.localeCompare(b.place);
        });
      } else {
        arr.sort((a, b) => {
          b.place.localeCompare(a.place);
        });
      }
    }
    if (req.path == "/dashboard/request/edit") {
      if (req.query.sort == 0) {
        arr.sort((a, b) => {
          a.billboard.properties.place.localeCompare(
            b.billboard.properties.place
          );
        });
      } else {
        arr.sort((a, b) => {
          b.billboard.properties.place.localeCompare(
            a.billboard.properties.place
          );
        });
      }
    }
  }
  return arr;
};

const _get_map = async (req, res) => {
  res.locals.billboards = await db
    .getDb()
    .collection("billboard")
    .find({})
    .toArray();
  res.render("phan-cum-phuong/trangchu");
};

//Danh sách bảng quảng cáo
const _get_advertisement = async (req, res) => {
  res.locals.billboards = await db
    .getDb()
    .collection("billboard")
    .aggregate([
      {
        $lookup: {
          from: "licenses",
          localField: "licenses",
          foreignField: "_id",
          as: "licenses",
        },
      },
    ])
    .toArray();
  //res.locals.billboards = _process_query(req, res.locals.billboards);

  res.render("phan-cum-phuong/quanlyquangcao");
};

//Yêu cầu cấp phép biển quáng cáo
const _get_license = async (req, res) => {
  res.locals.licenses = await db
    .getDb()
    .collection("licenses")
    .aggregate([
      {
        $lookup: {
          from: "billboard",
          localField: "_id",
          foreignField: "licenses",
          as: "billboard",
        },
      },
    ])
    .toArray();
  res.render("phan-cum-phuong/danhsachcapphep");
};

const _post_license_request = async (req, res) => {
  let { id, email, from, name, contact, start, end, images, details } =
    req.body;
  console.log(req.body);
  let license = new License(name, contact, start, end, 1);
  if (license.send_licences_request(id)) console.log("send!");
  return res.redirect("/dashboard/license");
};

const _post_cancel_license = async (req, res) => {
  let { id } = req.body;

  let request = await License.cancel_request(id);

  return res.redirect("/dashboard/advertise");
};

//Thông tin báo cáo
const _get_report = async (req, res) => {
  res.locals.reports = await db
    .getDb()
    .collection("reports")
    .find({})
    .toArray();
  res.locals.reports = _process_query(req, res.locals.reports);
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
const _post_report_edit = (req, res) => {
  let { handling_method, state } = req.body;
  let id = req.params;

  if (Report._update_report_state(id, state, handling_method)) {
    return res.redirect("/dashboard/report");
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
  console.log(res.locals.requests);
  res.locals.requests = _process_query(req, res.locals.requests);
  //res.render("phan-cum-phuong/danhsachchinhsua");
};

const _post_request_edit = async (req, res) => {
  let { _id, images, details, type, status, type_advertise, place_type } =
    req.body;
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

  let change = new Billboard(
    req.body.type_billboard,
    null,
    {
      amount: "1 trụ/bảng",
      place: req.body.place,
      size: "2.5mx10m",
      place_type: land_type,
      type: billboard_type,
      type_advertise: ad_type,
      zoning: status == 1 ? true : false,
    },
    req.body.name
      ? new License(
          req.body.name,
          req.body.contact,
          req.body.start,
          req.body.end
        )
      : null
  );

  let request = new Request(
    new ObjectId(res.locals.uid),
    new ObjectId(_id),
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
};
