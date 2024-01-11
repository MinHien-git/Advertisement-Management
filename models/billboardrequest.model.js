const { ObjectId } = require("mongodb");
const report_const = require("../constants/report.type");
const db = require("../database/database");

module.exports = class BillboardRequest {
  constructor(billboard, place_type, type_advertise, status, details) {
    this.billboard = new ObjectId(billboard);
    this.place_type = place_type;
    this.type_advertise = type_advertise;
    this.status = status;
    this.details = details;
    this.state = 0;
  }

  async send_request() {
    const report = await db
      .getDb()
      .collection("billboard-request")
      .insertOne({ ...this });
    return report;
  }

  static async update_request(_id, state) {
    const request = await db
      .getDb()
      .collection("billboard-request")
      .findOneAndUpdate(
        { $and: [{ _id: new ObjectId(_id) }, { state: 0 }] },
        { $set: { state: state } }
      );
    await db
      .getDb()
      .collection("billboard-request")
      .findOneAndUpdate(
        { _id: new ObjectId(request.billboard._id) },
        { $set: { change_request: null } }
      );
    return report;
  }
};
