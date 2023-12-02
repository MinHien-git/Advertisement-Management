const { ObjectId } = require("mongodb");
const db = require("../database/database");
const report_const = require("../constants/report.type");

module.exports = class Report {
  constructor(email, phone, position, name, images, details) {
    this.sender_email = email;
    this.sender_number = phone;
    this.sender_name = name;
    this.place = position;
    this.state = report_const.REPORT_STATE.INCOMPLETE;
    this.images = images;
    this.send_day = new Date();
    this.details = details;
  }
  async _get_report() {
    const report = await db
      .getDb()
      .collection("reports")
      .find({ position: this.position });
    return report;
  }

  async _send_report() {
    const report = await db
      .getDb()
      .collection("reports")
      .insertOne({ ...this });
    return report;
  }

  static async _update_report_state(id, state, handling_method) {
    const report = await db
      .getDb()
      .collection("reports")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { state: state, handling_method: handling_method }
      );
    return report;
  }
};
