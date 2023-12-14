let Report = require("../models/report.model");
let db = require("../database/database");

const _get_report = (request, response) => {
  const params = new Proxy(new URLSearchParams(request.url.seach), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  response.render("users/report/report", {
    position: params.position,
    ward: params.ward,
    district: params.district,
  });
};

const _post_report = (request, response) => {
  let {
    type,
    sender_name,
    sender_email,
    sender_number,
    place,
    attached_files,
    details,
  } = request.body;
  let ward = place.split(",")[1];
  let district = place.split(",")[2];
  let report = new Report(
    type,
    sender_email,
    sender_number,
    place,
    sender_name,
    attached_files,
    details
  );
  if (report._send_report()) console.log("send!");
  return response.redirect("/");
};

const _get_report_manage = async (request, response) => {
  let user = db.getDb().collection("users").find({ id: request.session.id });
  // TODO: manage user role and what report to show
};

module.exports = {
  _get_report,
  _post_report,
  _get_report_manage,
};
