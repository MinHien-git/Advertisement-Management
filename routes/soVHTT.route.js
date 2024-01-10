const express = require("express");
const router = express();
const SOVHTTcontroller = require("../controllers/soVHTT.controller");
const mapController = require("../controllers/map.controller");

//Quản lí bảng quảng cáo
router.get("/management/billboards", SOVHTTcontroller._get_billboards);

router.get("/management/billboards/map", mapController._manage_map);

router.put("/management/billboards/", SOVHTTcontroller._edit_billboard);

router.post("/management/billboards/boards", SOVHTTcontroller._add_board);
router.put("/management/billboards/boards", SOVHTTcontroller._edit_board);
router.delete("/management/billboards/boards", SOVHTTcontroller._delete_board);

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

//Duyệt YC chỉnh sửa bảng QC
//Xem DS yêu cầu
router.get("/management/edit_requests", SOVHTTcontroller._get_edit_requests);
//duyệt
router.put("/management/edit_requests", SOVHTTcontroller._approve_edit_request);
//bác bỏ
router.put(
    "/management/edit_requests/decline",
    SOVHTTcontroller._decline_edit_request
);

//Duyệt danh sách báo cáo
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

//Quản lí Quận, Phường
router.get(
    "/management/general/districts_wards",
    SOVHTTcontroller._get_districts_wards
);
router.post(
    "/management/general/districts_wards/district",
    SOVHTTcontroller._create_district
);
router.post(
    "/management/general/districts_wards/ward",
    SOVHTTcontroller._create_ward
);
router.put(
    "/management/general/districts_wards/district",
    SOVHTTcontroller._edit_district
);
router.put(
    "/management/general/districts_wards/ward",
    SOVHTTcontroller._edit_ward
);
router.delete(
    "/management/general/districts_wards/district",
    SOVHTTcontroller._delete_district
);
router.delete(
    "/management/general/districts_wards/ward",
    SOVHTTcontroller._delete_ward
);

//Quản lí thông tin chung (thông tin loại bảng quảng cáo,...)
router.get(
    "/management/general/general_types",
    SOVHTTcontroller._get_general_info
);
router.post(
    "/management/general/general_types",
    SOVHTTcontroller._add_general_info
);
router.put(
    "/management/general/general_types",
    SOVHTTcontroller._edit_general_info
);
router.delete(
    "/management/general/general_types",
    SOVHTTcontroller._delete_general_info
);


//quản lí thông tin tài khoản cá nhân
router.get("/management/profile",SOVHTTcontroller._get_profile);
router.put("/management/profile",SOVHTTcontroller._update_profile);
router.put("/management/profile/password",SOVHTTcontroller._change_password);