const { ObjectId } = require("mongodb");
const db = require("../database/database");
const report_const = require("../constants/report.type");

module.exports = class Report {
  constructor(
    type,
    email,
    phone,
    position,
    name,
    images,
    details,
    geometry,
    board
  ) {
    this.type = type;
    this.sender_email = email;
    this.sender_number = phone;
    this.sender_name = name;
    this.place = position;
    this.state = report_const.REPORT_STATE.INCOMPLETE;
    this.images = [...images];
    this.send_day = new Date();
    this.details = details;
    this.handling_method;
    this.geometry = geometry;
    this.board = board;
  }

  async _get_report() {
    const report = await db
      .getDb()
      .collection("reports")
      .find({ position: this.position });
    return report;
  }
  async _send_report() {
    console.log("report model: ", this.type);
    const report = await db
      .getDb()
      .collection("reports")
      .insertOne({
        type: "Feature",
        properties: {
          type: this.type,
          sender_email: this.sender_email,
          sender_number: this.sender_number,
          sender_name: this.sender_name,
          place: this.place,
          state: this.state,
          images: this.images,
          send_day: this.send_day,
          details: this.details,
          handling_method: this.handling_method,
          board: this.board,
        },
        geometry: this.geometry,
      });
    return report;
  }
};
