const express = require("express");
const router = express();
const SOVHTTcontroller = require("../controllers/soVHTT.controller");
const mapController = require("../controllers/map.controller");

//Quản lí bảng quảng cáo
router.get("/management/billboards", SOVHTTcontroller._get_billboards);

router.get("/management/billboards/map", mapController._manage_map);

router.put("/management/billboards/", SOVHTTcontroller._edit_billboard);

//thao tác trên map
router.post(
    "/management/billboards/map/create",
    SOVHTTcontroller._create_billboard
);

router.post(
    "/management/billboards/map/edit",
    SOVHTTcontroller._edit_billboard_on_map
);

router.delete("/management/billboards", SOVHTTcontroller._delete_billboard);

//Cấp phép quảng cáo
//Xem DS yêu cầu
router.get("/management/licenses", SOVHTTcontroller._get_licenses);
//duyệt
router.put("/management/licenses", SOVHTTcontroller._approve_license);
//YC chỉnh sửa
router.post(
    "/management/licenses",
    SOVHTTcontroller._post_license_edit_request
);
//bác bỏ
router.put("/management/licenses/decline", SOVHTTcontroller._decline_license);

//Duyệt yêu cầu cấp phép/chỉnh sửa nội dung QC
router.get("/management/reports", SOVHTTcontroller._get_reports);
router.put("/management/reports", SOVHTTcontroller._change_report_status);
router.post(
    "/management/reports",
    SOVHTTcontroller._post_report_change_request
);

//Quản lí tài khoản
router.get("/management/accounts", SOVHTTcontroller._get_accounts);
router.put("/management/accounts", SOVHTTcontroller._edit_account);
router.delete("/management/accounts", SOVHTTcontroller._delete_account);
router.post("/management/accounts", SOVHTTcontroller._create_account);
module.exports = router;
