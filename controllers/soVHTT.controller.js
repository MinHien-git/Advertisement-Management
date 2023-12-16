const db = require("../database/database")
const License = require("../models/license.model")
const Billboard = require("../models/bill-board.model");
const User = require("../models/users.model");
const { ObjectId } = require("mongodb");
const SoVHTT_Request = require("../models/soVHTT-req.model");

//Quản lí bảng quảng cáo
const _get_billboards = async (req, res) => {
    res.locals.billboards = await db
        .getDb()
        .collection("billboard")
        .find({})
        .toArray();

    res.locals.billboards.forEach((billboard) => {
        billboard.properties.place =
            billboard.properties.place.split(", Thành phố")[0];
        billboard.license = new License(
            "Công ty ABC",
            "ctytABC@ABC.com",
            "22/12/2022",
            "22/12/2023"
        );
    });
    res.render("phan-cum-soVHTT/QuanLiQC");
};
const _post_edit_billboard = async (req, res) => {
    const {
        id,
        type,
        place,
        type_advertise,
        place_type,
        size,
        amount,
        status,
    } = req.body;
    const billboard = await db
        .getDb()
        .collection("billboard")
        .findOne({ _id: new ObjectId(id) });
    console.log(id);
    const globalid = billboard.properties.globalid;
    const updateInfo = new Billboard(null, null, {
        globalid,
        type,
        place,
        type_advertise,
        place_type,
        size,
        amount,
        status,
    });
    try {
        updateInfo._update_billboard(billboard._id);
        console.log("billboard " + id + " updated!");
        return res.redirect("/management/billboards");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};

const _delete_billboard = async (req, res) => {
    const { id } = req.body;
    console.log(id);
    try {
        db.getDb()
            .collection("billboard")
            .deleteOne({ _id: new ObjectId(id) });
        console.log("billboard " + id + " deleted!");
        return res.redirect("/management/billboards");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _create_billboard = (req, res) => {};

//Cấp phép quảng cáo dựa trên yêu cầu cấp phép của phường
const _get_licenses = async (req, res) => {
    res.locals.billboards = await db
        .getDb()
        .collection("billboard")
        .find({ license: { $exists: true } })
        .toArray();

    res.locals.billboards.forEach((billboard) => {
        billboard.properties.place =
            billboard.properties.place.split(", Thành phố")[0];
    });
    res.render("phan-cum-soVHTT/DuyetYCCapPhep");
};
const _approve_license = async (req, res) => {
    const { id, state } = req.body;

    try {
        const billboard = await db
            .getDb()
            .collection("billboard")
            .findOne({ _id: new ObjectId(id) });
        const updateInfo = new Billboard(null, null, null, {
            company_name: billboard.license.company_name,
            company_contact: billboard.license.company_contact,
            start_date: billboard.license.start_date,
            end_date: billboard.license.end_date,
            state: state,
        });
        updateInfo._update_license_state(billboard._id);
        console.log("license for billboard " + id + " approved!");
        return res.redirect("/management/licenses");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _decline_license = async (req, res) => {
    const { id, state } = req.body;

    try {
        const billboard = await db
            .getDb()
            .collection("billboard")
            .findOne({ _id: new ObjectId(id) });
        const updateInfo = new Billboard(null, null, null, {
            company_name: billboard.license.company_name,
            company_contact: billboard.license.company_contact,
            start_date: billboard.license.start_date,
            end_date: billboard.license.end_date,
            state: state,
        });
        updateInfo._update_license_state(billboard._id);
        console.log("license for billboard " + id + " declined.");
        return res.redirect("/management/licenses");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _post_license_edit_request = async (req, res) => {
    const { id, details } = req.body;
    const soVHTT_req = new SoVHTT_Request(1, id, details);
    try {
        await db.getDb().collection("soVHTT_requests").insertOne(soVHTT_req);
        console.log("Request for license " + id + " sent!");
        return res.redirect("/management/licenses");
    } catch (err) {
        res.send(err);
        console.log(err);
    }
};

//Duyệt yêu cầu chỉnh sửa của phường
const _get_report = async (req, res) => {
    res.locals.reports = await db
        .getDb()
        .collection("reports")
        .find({})
        .toArray();

    res.locals.reports.forEach((report) => {
        report.place = report.place.split(", Thành phố")[0];
    });
    res.render("phan-cum-soVHTT/ThongKeBaoCao");
};

const _change_report_status = async (req, res) => {
    const { id, state } = req.body;

    try {
        await db
            .getDb()
            .collection("reports")
            .findOneAndUpdate({ _id: id }, { $set: { state: state } });
        console.log("Report " + id + " approved!");
        return res.redirect("/management/reports");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _post_report_change_request = async (req, res) => {
    const { id, details } = req.body;
    const soVHTT_req = new SoVHTT_Request(2, id, details);
    try {
        await db.getDb().collection("soVHTT_requests").insertOne(soVHTT_req);
        console.log("Request for report " + id + " sent!");
        return res.redirect("/management/reports");
    } catch (err) {
        res.send(err);
        console.log(err);
    }
};

//Quản lí tài khoản
const _get_accounts = async (req, res) => {
    res.locals.users = await db
        .getDb()
        .collection("users")
        .find({})
        .project({ password: 0 })
        .toArray();
    res.locals.areas = await db
        .getDb()
        .collection("district-ward")
        .find({})
        .sort({ type: 1, district: 1 })
        .toArray();
    res.render("phan-cum-soVHTT/QuanLiTK");
};
const _edit_account = (req, res) => {
    const { id, name, email, phone, birth, type_user, district, ward } =
        req.body;
    try {
        const editInfo = new User(
            email,
            null,
            type_user,
            phone,
            name,
            birth,
            ward,
            district
        );
        editInfo._update(id);
        console.log("Account " + id + " updated!");
        return res.redirect("/management/accounts");
    } catch (err) {
        res.send(err);
        console.log(err);
    }
};
const _delete_account = (req, res) => {
    const { id } = req.body;
    console.log(id);
    try {
        db.getDb()
            .collection("users")
            .deleteOne({ _id: new ObjectId(id) });
        console.log("account " + id + " deleted!");
        return res.redirect("/management/accounts");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _create_account = (req, res) => {
    const { name, email, phone, birth, type_user, district, ward } = req.body;
    try {
        const createInfo = new User(
            email,
            "acc123",
            type_user,
            phone,
            name,
            birth,
            ward,
            district
        );
        createInfo._register();
        console.log("Account for " + name + " created!");
        return res.redirect("/management/accounts");
    } catch (err) {
        res.send(err);
        console.log(err);
    }
};

module.exports = {
    _create_account,
    _get_accounts,
    _delete_account,
    _edit_account,
    _approve_license,
    _post_edit_billboard,
    _delete_billboard,
    _create_billboard,
    _get_billboards,
    _post_license_edit_request,
    _decline_license,
    _get_report,
    _post_report_change_request,
    _get_licenses,
    _change_report_status,
};
