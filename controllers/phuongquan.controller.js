const User = require("../models/users.model");
const Billboard = require("../models/bill-board.model");
const Report = require("../models/report.model");
const db = require("../database/database");

//Danh sách bảng quảng cáo
const _get_advertisement = (req, res) => {
  res.render("phan-cum-phuong/quanlyquangcao");
};
//Yêu cầu cấp phép biển quáng cáo
const _get_license = (req, res) => {
  res.render("phan-cum-phuong/danhsachcapphep");
};

const _post_license_request = (req, res) => {

};

const _post_decline_license = (req, res) => {

};

const _post_license_edit_request = (req, res) => {

};

//Thông tin báo cáo
const _get_report = (req, res) => {
  res.render("phan-cum-phuong/danhsachbaocao");
};
const _get_report_information = (req, res) => {
  res.render("phan-cum-phuong/chitietbaocao");
};

//Yêu cầu chỉnh sửa biển quảng cáo
const _post_report_edit = async (req, res) => {
  const { type_billboard, geometry, position, properties, license } = req.body;

  const user = User(type_billboard, geometry, position, properties, license);

  db.getDb().collection("customers").updateOne({ $or: [
    { position: this.position },
    { "geometry.coordinates": this.geometry },],}
    , { ...user }, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
};

const _get_request_edit = (req, res) => {
  res.render("phan-cum-phuong/danhsachchinhsua");
};

const _post_request_edit = (req, res) => {};
module.exports = {
  _get_advertisement,
  _get_license,
  _post_license_edit_request,
  _post_decline_license,
  _post_license_request,
  _get_report,
  _get_report_information,
  _post_report_edit,
  _get_request_edit,
  _post_request_edit,
};
