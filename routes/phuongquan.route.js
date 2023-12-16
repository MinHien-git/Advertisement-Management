const express = require("express");
const router = express();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const phuongQuanController = require("../controllers/phuongquan.controller");

//Bản đồ
router.get("/dashboard", phuongQuanController._get_map);

//Danh sách bảng quảng cáo
router.get("/dashboard/advertise", phuongQuanController._get_advertisement);

//Yêu cầu cấp phép
router.get("/dashboard/license", 
  phuongQuanController._get_license);

router.post(
  "/dashboard/license/request",
  upload.array("attached_files"), 
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
