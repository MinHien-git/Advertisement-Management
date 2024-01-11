const { ObjectId } = require("mongodb");
const report_const = require("../constants/report.type");
const db = require("../database/database");

module.exports = class BoardRequest {
  constructor(
    billboard,
    board_type,
    board_index,
    size,
    details,
    select_option
  ) {
    this.billboard = billboard;
    this.board_type = board_type;
    this.size = size;
    this.board_index = board_index;
    this.details = details;
    this.state = 0;
    this.select_option = select_option;
  }

  async send_request() {
    const report = await db
      .getDb()
      .collection("board-request")
      .insertOne({ ...this });
    return report;
  }

  static async update_request(_id, state) {
    const request = await db
      .getDb()
      .collection("board-request")
      .findOneAndUpdate(
        { $and: [{ _id: new ObjectId(_id) }, { state: 0 }] },
        { $set: { state: state } }
      );
    await db
      .getDb()
      .collection("board-request")
      .findOneAndUpdate(
        { _id: new ObjectId(request.billboard._id) },
        { $set: { change_request: null } }
      );
    return report;
  }
};
