const { ObjectId } = require("mongodb");
const db = require("../database/database");
const report_const = require("../constants/report.type")

module.exports = class Report {
  constructor(email, phone, position, name, district, ward, images) {
    this.email = email;
    this.district = district;
    this.phone = phone;
    this.name = name;
    this.ward = ward;
    this.position = position;
    this.state = report_const.REPORT_STATE.INCOMPLETE;
    this.images = images;
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

  static async _update_report_state(id, state) {
    const report = await db
      .getDb()
      .collection("reports")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { state: state });
    return report;
  }
};
