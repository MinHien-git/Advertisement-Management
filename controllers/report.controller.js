let Report = require("../models/report.model");
let db = require("../database/database");
const session = require("express-session");

const _get_report = (request, response) => {
    const params = new Proxy(new URLSearchParams(request.url.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    response.render("users/report/report", {
        position: params.position,
        ward: params.ward,
        district: params.district,
    });
};

const _post_report = (request, response) => {
    let { name, email, phone, ward, district, position, image } = request.body;
    let report = new Report(
        email,
        phone,
        position,
        name,
        district,
        ward,
        image
    );
    report._send_report();
    return response.redirect("/");
};

const _get_report_manage = async (request, response) => {
    let user = await db
        .getDb()
        .collection("users")
        .find({ id: request.session.id });
    // TODO: manage user role and what report to show
};

module.exports = {
  _get_report,
  _post_report,
  _get_report_manage,
};
