const User = require("../models/users.model");
const Billboard = require("../models/bill-board.model");
const Report = require("../models/report.model");
const License = require("../models/license.model");
const Request = require("../models/request.model");
const db = require("../database/database");

const { ObjectId } = require('mongodb');

const _get_map = async (req, res) => {
  res.locals.type_user = 1;
  res.locals.isAuth = true;
  res.locals.billboards = await db.getDb().collection("billboard").find({}).toArray();
  res.locals.billboards.forEach(element => {
    element.license = new License("", "Shady Company", "notexist@non.com", "22/12/2022", "22/12/2023");
  });
  res.render("phan-cum-phuong/trangchu");
};

//Danh sách bảng quảng cáo
const _get_advertisement = async (req, res) => {
  res.locals.type_user = 1;
  res.locals.isAuth = true;
  res.locals.billboards = await db.getDb().collection("billboard").find({}).toArray();
  res.locals.billboards.forEach(element => {
    element.license = new License("", "Shady Company", "notexist@non.com", "22/12/2022", "22/12/2023");
  });
  res.render("phan-cum-phuong/quanlyquangcao");
};

//Yêu cầu cấp phép biển quáng cáo
const _get_license = async (req, res) => {
  res.locals.type_user = 1;
  res.locals.isAuth = true;
  res.locals.billboards = await db.getDb().collection("billboard").find({}).toArray();
  res.locals.billboards.forEach(element => {
    element.license = new License("", "Shady Company", "notexist@non.com", "22/12/2022", "22/12/2023");
  });
  res.render("phan-cum-phuong/danhsachcapphep");
};

const _post_license_request = async (req, res) => {
  let { email, from, name, images, details } = request.body;
  let ward = place.split(",")[1];
  let district = place.split(",")[2];
  let billboard = await db.getDb().collection("billboard").findOne({ place: from });
  let license = new License(name, email, Date(), Date(), 0);
  if (license.send_request(billboard._id)) console.log("send!");
  return license.redirect("/");
};

const _post_cancel_license = async (req, res) => {
  let { id } = req.body;

  let request = await License.cancel_request(id);
  
  return res.redirect("/dashboard/license");
};

//Thông tin báo cáo
const _get_report = async (req, res) => {
  res.locals.type_user = 1;
  res.locals.isAuth = true;
  res.locals.reports = await db.getDb().collection("reports").find({}).toArray();
  res.render("phan-cum-phuong/danhsachbaocao");
};

const _get_report_information = async (req, res) => {
  res.locals.type_user = 1;
  res.locals.isAuth = true;
  res.locals.report = await db.getDb().collection("reports").findOne({_id : new ObjectId(req.params.id)})
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
  res.locals.type_user = 1;
  res.locals.isAuth = true;
  res.locals.billboards = await db.getDb().collection("billboard").find({}).toArray();
  res.locals.billboards.forEach(element => {
    if (!element.license) {
      element.license = new License("", "Shady Company", "notexist@non.com", "22/12/2022", "22/12/2023");
    }
  });
  res.render("phan-cum-phuong/danhsachchinhsua");
};

const _post_request_edit = async (req, res) => {
  let { email, position, from, images, details } = req.body;
  const billboard = await db.getDb().collection("billboard").findOne({ place: position });
  let request = new Request(email, from, billboard, images, details, 0);
  if (await request.send_request()) console.log("send!");
  return response.redirect("/dashboard/license");
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
