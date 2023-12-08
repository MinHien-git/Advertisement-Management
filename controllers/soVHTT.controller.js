const db = require("../database/database")
const License = require("../models/license.model")

//Quản lí bảng quảng cáo
const _get_billboards = async (req, res) => {
    res.locals.type_user = 2
    res.locals.isAuth = true
    res.locals.billboards = await db
        .getDb()
        .collection("billboard")
        .find({})
        .toArray()

    res.locals.billboards.forEach((billboard) => {
        billboard.license = new License(
            "Công ty ABC",
            "ctytABC@ABC.com",
            "22/12/2022",
            "22/12/2023"
        )
    })
    res.render("phan-cum-soVHTT/QuanLiQC")
}
const _post_edit_billboard = (req, res) => {}

const _delete_billboard = (req, res) => {}
const _create_billboard = (req, res) => {}

//Cấp phép quảng cáo dựa trên yêu cầu cấp phép của phường
const _get_licenses = (req, res) => {
    res.render("phan-cum-soVHTT/DuyetYCCapPhep")
}
const _post_approve_license = (req, res) => {}
const _post_decline_license = (req, res) => {}
const _post_license_edit_request = (req, res) => {}

//Duyệt yêu cầu chỉnh sửa của phường
const _get_report = (req, res) => {
    res.render("phan-cum-soVHTT/ThongKeBaoCao")
}
const _post_report_edit = (req, res) => {}

//Quản lí tài khoản
const _get_accounts = (req, res) => {
    res.render("phan-cum-soVHTT/QuanLiTK")
}
const _post_edit_accounts = (req, res) => {}
const _post_delete_accounts = (req, res) => {}
const _post_create_accounts = (req, res) => {}

module.exports = {
    _post_create_accounts,
    _get_accounts,
    _post_delete_accounts,
    _post_edit_accounts,
    _post_approve_license,
    _post_edit_billboard,
    _delete_billboard,
    _create_billboard,
    _get_billboards,
    _post_approve_license,
    _post_license_edit_request,
    _post_decline_license,
    _get_report,
    _post_report_edit,
    _get_licenses,
}
