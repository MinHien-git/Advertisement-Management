const db = require("../database/database");
const { REQUEST_STATE_TYPE } = require("../constants/report.type")

module.exports = class License {
  constructor(
    company_name,
    company_contact,
    start_date,
    end_date,
    state
  ) {
    this.company_name = company_name;
    this.company_contact = company_contact;
    this.start_date = start_date;
    this.end_date = end_date;
    this.state = state;
  }

  async send_request(id) {
    await db.getDb().collection("billboard").updateOne( { _id: id }, { $set: { license: { ...this } } })    
  }

  static async update_request(id, content) {

  }

  static async cancel_request(id) {
    await db.getDb().collection("billboard").updateOne( { _id: id }, { $unset: "license" } )
  }
}
