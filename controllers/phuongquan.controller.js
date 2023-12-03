const User = require("../models/users.model");
const Billboard = require("../models/bill-board.model");
const Report = require("../models/report.model");
const License = require("../models/license.model");
const db = require("../database/database");

const { request } = require("../routes/phuongquan.route");

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

const _post_license_request = (req, res) => {
  let { email, position, from, images, details } = req.body;
  let request = new Request(email, from, name, images, details, 0);
  if (request.send_request()) console.log("send!");
  return response.redirect("/");
};

const _post_decline_license = (req, res) => {
  let { id } = request.body;

  if (Request.update_request(id, 2)) {
  }
  return res.redirect("/");
};

//Thông tin báo cáo
const _get_report = async (req, res) => {
  res.locals.type_user = 1;
  res.locals.isAuth = true;
  res.locals.reports = await db.getDb().collection("reports").find({}).toArray();
  res.render("phan-cum-phuong/danhsachbaocao");
};

const _get_report_information = (req, res) => {
  res.locals.type_user = 1;
  locals.isAuth = true;
  res.render("phan-cum-phuong/chitietbaocao");
};

//Giải quyết quảng cáo
const _post_report_edit = (req, res) => {
  let { handling_method, state } = req.body;
  let id = req.params;

  if (Report._update_report_state(id, state, handling_method)) {
    return res.redirect("/");
  }
  return res.redirect("/");
};

const _get_request_edit = async (req, res) => {
  res.locals.type_user = 1;
  res.locals.isAuth = true;
  res.locals.billboards = await db.getDb().collection("billboard").find({}).toArray();
  res.locals.billboards.forEach(element => {
    element.license = new License("", "Shady Company", "notexist@non.com", "22/12/2022", "22/12/2023");
  });
  res.render("phan-cum-phuong/danhsachchinhsua");
};

const _post_request_edit = (req, res) => {
  let { email, from, name, images, details } = request.body;
  let ward = place.split(",")[1];
  let district = place.split(",")[2];
  let request = new Request(email, from, name, images, details, 0);
  if (request.send_request()) console.log("send!");
  return response.redirect("/");
};

module.exports = {
  _get_advertisement,
  _get_license,
  _post_decline_license,
  _post_license_request,
  _get_report,
  _get_report_information,
  _post_report_edit,
  _get_request_edit,
  _post_request_edit,
};
