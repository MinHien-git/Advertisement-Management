const express = require("express");
const router = express();
const SOVHTTcontroller = require("../controllers/soVHTT.controller");
//Quản lí quảng cáo
router.get("/management/advertise", SOVHTTcontroller._get_advertisement);
router.post(
  "/management/advertise/edit/:id",
  SOVHTTcontroller._post_edit_advertisement
);
router.delete(
  "/management/advertise/delete/:id",
  SOVHTTcontroller._delete_advertisement
);
router.post(
  "/management/advertise/create",
  SOVHTTcontroller._create_advertisement
);

//Cấp phép quảng cáo
//Xem DS yêu cầu
router.get("/management/license", SOVHTTcontroller._get_license);
//duyệt
router.post(
  "/management/license/approve",
  SOVHTTcontroller._post_approve_license
);
//YC chỉnh sửa
router.post(
  "/management/license/request",
  SOVHTTcontroller._post_license_edit_request
);
//bác bỏ
router.post(
  "/management/license/decline",
  SOVHTTcontroller._post_decline_license
);

//Duyệt yêu cầu cấp phép/chỉnh sửa bảng QC
router.get("/management/report", SOVHTTcontroller._get_report);
router.get("/management/report/:id", SOVHTTcontroller._post_report_edit);

//Quản lí tài khoản
router.get("/management/account", SOVHTTcontroller._get_accounts);
router.post(
  "/management/account/edit/:id",
  SOVHTTcontroller._post_edit_accounts
);
router.delete(
  "/management/account/delete/:id",
  SOVHTTcontroller._post_delete_accounts
);
router.post(
  "/management/account/create",
  SOVHTTcontroller._post_create_accounts
);
module.exports = router;
