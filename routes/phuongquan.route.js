const express = require("express");
const router = express();
const path = require("path");
const { ObjectId } = require("mongodb");

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, 'public/images/user_images');
  },
  filename: function (req, file, callback) {
    if (file.mimetype === "image/png") {
      console.log("png");
      callback(null, (new ObjectId()).toString() + ".png");
    }
    if (file.mimetype === "image/jpeg") {
      console.log("jpeg");
      callback(null, (new ObjectId()).toString() + ".jpeg");
    }
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    }
    else {
      cb(null, false);
    }
  }
});

const phuongQuanController = require("../controllers/phuongquan.controller");
const { log } = require("console");

//Bản đồ
router.get("/dashboard", phuongQuanController._get_map);

//Danh sách bảng quảng cáo
router.get("/dashboard/advertise", phuongQuanController._get_advertisement);

//Yêu cầu cấp phép
router.get("/dashboard/license", 
  phuongQuanController._get_license);

router.post(
  "/dashboard/license/request",
  upload.array("attached_files", 2), 
  phuongQuanController._post_license_request
);

//Từ chối Yêu cầu cấp phép
router.post(
  "/dashboard/license/cancel",
  phuongQuanController._post_cancel_license
);

//Danh sách báo cáo
router.get("/dashboard/report", phuongQuanController._get_report);
//Thông tin báo cáo
router.get(
  "/dashboard/report/:id",
  phuongQuanController._get_report_information
);

router.post("/dashboard/report/:id", phuongQuanController._post_report_edit);

//Yêu cầu chỉnh sửa
router.get("/dashboard/request/edit", phuongQuanController._get_request_edit);
router.post("/dashboard/request", phuongQuanController._post_request_edit);
module.exports = router;
