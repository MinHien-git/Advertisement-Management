const express = require("express");
const router = express();
const SOVHTTcontroller = require("../controllers/soVHTT.controller");
const mapController = require("../controllers/map.controller");

//Quản lí bảng quảng cáo
router.get("/management/billboards", SOVHTTcontroller._get_billboards);

router.get("/management/billboards/map", mapController._manage_map);

router.post(
  "/management/billboards/create",
  SOVHTTcontroller._create_billboard
);

router.post(
  "/management/billboards/edit",
  SOVHTTcontroller._post_edit_billboard
);

router.delete("/management/billboards", SOVHTTcontroller._delete_billboard);

//Cấp phép quảng cáo
//Xem DS yêu cầu
router.get("/management/licenses", SOVHTTcontroller._get_licenses);
//duyệt
router.post(
  "/management/licenses/approve",
  SOVHTTcontroller._post_approve_license
);
//YC chỉnh sửa
router.post(
  "/management/licenses/request",
  SOVHTTcontroller._post_license_edit_request
);
//bác bỏ
router.post(
  "/management/licenses/decline",
  SOVHTTcontroller._post_decline_license
);

//Duyệt yêu cầu cấp phép/chỉnh sửa nội dung QC
router.get("/management/reports", SOVHTTcontroller._get_report);
router.get("/management/reports/edit/:id", SOVHTTcontroller._post_report_edit);

//Quản lí tài khoản
router.get("/management/accounts", SOVHTTcontroller._get_accounts);
router.post(
  "/management/accounts/edit/:id",
  SOVHTTcontroller._post_edit_accounts
);
router.delete(
  "/management/accounts/delete/:id",
  SOVHTTcontroller._post_delete_accounts
);
router.post(
  "/management/accounts/create",
  SOVHTTcontroller._post_create_accounts
);
module.exports = router;
