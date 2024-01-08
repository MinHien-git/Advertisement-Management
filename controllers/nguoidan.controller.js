let Report = require("../models/report.model");
let db = require("../database/database");
let request = require("request");
const { response } = require("express");
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

const _post_report = (req, res) => {
  try {
    console.log(req.body);
    let secretKey = "6LdBr0kpAAAAAPCqy5ZCWtLtxGGMG-DzTjAcoNZA";
    if (!req.body.captcha) {
      return res.status(400).json({
        success: false,
      });
    }
    let {
      type,
      geometry,
      sender_name,
      sender_email,
      sender_number,
      place,
      attached_files,
      details,
      board,
    } = req.body;
    let ward = place.split(",")[1];
    let district = place.split(",")[2];
    let report = new Report(
      type,
      sender_email,
      sender_number,
      place,
      sender_name,
      attached_files,
      details,
      JSON.parse(geometry),
      board
    );
    const verifiedURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;
    request(verifiedURL, (err, response, body) => {
      body = JSON.parse(body);
      if (err && (!body.success || body.score < 0.4)) {
        console.log(err);
        return res.status(400).json({
          success: false,
        });
      }
    });
    if (report._send_report()) console.log("send!");
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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
