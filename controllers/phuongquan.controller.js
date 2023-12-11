const User = require("../models/users.model");
const Billboard = require("../models/bill-board.model");
const Report = require("../models/report.model");
const License = require("../models/license.model");
const Request = require("../models/request.model");
const db = require("../database/database");

const { ObjectId } = require('mongodb');

const _process_query = (req, arr) => {
  if (req.query.search) {
    if (req.path == "/dashboard/advertise") {
      arr = arr.filter((e) => { return e.properties.place.indexOf(req.query.search) >= 0; });
    }
    if (req.path == "/dashboard/report") {
      arr = arr.filter((e) => { return e.place.indexOf(req.query.search) >= 0; });
    }
    if (req.path == "/dashboard/request/edit") {
      arr = arr.filter((e) => { return e.billboard.properties.place.indexOf(req.query.search) >= 0; });
    }
  }
  if (req.query.license) {
    arr = arr.filter((e) => { return e.license.state == req.query.license; });
  }
  if (req.query.report_type) {
    arr = arr.filter((e) => { return e.type == req.query.report_type; });
  }
  if (req.query.report_state) {
    arr = arr.filter((e) => { return e.state == req.query.report_state; });
  }
  if (req.query.sort) {

  }
  return arr;
}

const _get_map = async (req, res) => {
  res.locals.type_user = 1;
  res.locals.isAuth = true;
  res.locals.billboards = await db.getDb().collection("billboard").find({}).toArray();
  res.render("phan-cum-phuong/trangchu");
};

//Danh sách bảng quảng cáo
const _get_advertisement = async (req, res) => {
  res.locals.type_user = 1;
  res.locals.isAuth = true;
  res.locals.billboards = await db.getDb().collection("billboard").find({}).toArray();
  res.locals.billboards = _process_query(req, res.locals.billboards);
  
  res.render("phan-cum-phuong/quanlyquangcao");
};

//Yêu cầu cấp phép biển quáng cáo
const _get_license = async (req, res) => {
  res.locals.type_user = 1;
  res.locals.isAuth = true;
  res.locals.billboards = await db.getDb().collection("billboard").find({}).toArray();
  res.locals.billboards = _process_query(req, res.locals.billboards);
  res.render("phan-cum-phuong/danhsachcapphep");
};

const _post_license_request = async (req, res) => {
  let { id, email, from, name, contact, start, end, images, details } = req.body;
  let billboard = await db.getDb().collection("billboard").findOne({ place: from });
  let license = new License(name, contact, start, end, 1);
  if (license.send_request(id ? new ObjectId(id) : billboard._id)) console.log("send!");
  return res.redirect("/dashboard/license");
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
  res.locals.reports = _process_query(req, res.locals.reports);
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
  res.locals.requests = await db.getDb().collection("requests").find({}).toArray();
  res.locals.requests = _process_query(req, res.locals.requests);
  res.render("phan-cum-phuong/danhsachchinhsua");
};

const _post_request_edit = async (req, res) => {
  let { _id, email, from, images, details } = req.body;
  let change = new Billboard(req.body.type_billboard, null, {
    amount: "1 trụ/bảng",
    place: req.body.place,
    size: "2.5mx10m",
    place_type: req.body.place_type,
    type: req.body.type,
    type_advertise: req.body.type_advertise
  }, new License(req.body.name, req.body.contact, req.body.start, req.body.end));
  const billboard = await db.getDb().collection("billboard").findOne({ _id: new ObjectId(_id) });
  let request = new Request(email, from, billboard, change, images, details, 0);
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
