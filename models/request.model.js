const { ObjectID } = require("mongodb");
const report_const = require("../constants/report.type");

class Request {
  constructor(email, position, from, images, details, type) {
    this.sender_email = email;
    this.sender_name = from;
    this.place = position;
    this.state = report_const.REQUEST_STATE_TYPE.INCOMPLETE;
    this.images = images;
    this.send_day = new Date();
    this.details = details;
    this.type = type;
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
    const report = await db
      .getDb()
      .collection("requests")
      .findOneAndUpdate(
        { $and: [{ _id: new ObjectID(_id) }, { state: 0 }] },
        { state: state }
      );
    return report;
  }
}
