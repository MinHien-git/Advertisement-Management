const db = require("../database/database");
const { REQUEST_STATE_TYPE } = require("../constants/report.type");
const { ObjectId } = require("mongodb");

module.exports = class License {
  constructor(company_name, company_contact, start_date, end_date, state) {
    this.company_name = company_name;
    this.company_contact = company_contact;
    this.start_date = start_date;
    this.end_date = end_date;
    this.state = state;
  }

  static async get_license(id) {
    let license = await db
      .getDb()
      .collection("billboard")
      .findOne({ _id: new ObjectId(id) });
    return new License(
      license.company_name,
      license.company_contact,
      license.start_date,
      license.end_date,
      license.state
    );
  }

  async send_request(id) {
    let request = await db
      .getDb()
      .collection("requests")
      .insertOne({ ...this });
    if (request) {
      await db
        .getDb()
        .collection("billboard")
        .updateOne(
          { _id: new ObjectId(id) },
          { $push: { licenses: request.insertedId } }
        );
    }
  }

  async update_request(license_id, id) {
    let request = await db
      .getDb()
      .collection("requests")
      .findOneAndUpdate({ _id: new ObjectId(license_id) }, { ...this });
  }

  static async cancel_request(license_id) {
    let request = await db
      .getDb()
      .collection("requests")
      .findOneAndUpdate(
        { _id: new ObjectId(license_id) },
        { $set: { state: 2 } }
      );
  }
};
