const { ObjectId } = require("mongodb");
const report_const = require("../constants/report.type");
const db = require("../database/database");

module.exports = class Request {
  constructor(offcial_id, billboard, change, images, details, type, license) {
    this.offcial_id = offcial_id;
    this.billboard = billboard;
    this.change = change;
    this.state = report_const.REQUEST_STATE_TYPE.INCOMPLETE;
    this.images = images;
    this.send_day = new Date();
    this.details = details;
    this.type = type;
    this.license = license;
  }
  async get_license_requests() {}
  async get_all_requests() {}
  async get_edit_requests() {}

  async send_request() {
    const report = await db
      .getDb()
      .collection("requests")
      .insertOne({ ...this });
    return report;
  }

  static async update_request(_id, state) {
    const request = await db
      .getDb()
      .collection("requests")
      .findOneAndUpdate(
        { $and: [{ _id: new ObjectId(_id) }, { state: 0 }] },
        { $set: { state: state } }
      );
    await db
      .getDb()
      .collection("billboard")
      .findOneAndUpdate(
        { _id: new ObjectId(request.billboard._id) },
        { $set: { change_request: null } }
      );
    return report;
  }
};
