const { ObjectId } = require("mongodb");
const { getDb } = require("../database/database");
const { ObjectID } = require("mongodb");

module.exports = class Billboard {
  constructor(
    type_billboard,
    geometry,
    properties,
    license = null,
    change_request = null
  ) {
    this.type_billboard = type_billboard;
    this.geometry = geometry;
    this.properties = properties;
    this.license = license;
    this.change_request = change_request;
  }

  async _get_billboard() {
    await getDb.collection("billboard").findOne({
      $or: [
        { position: this.position },
        { "geometry.coordinates": this.geometry },
      ],
    });
  }

  async _update_billboard(id) {
    console.log(id);
    let billboard = await getDb()
      .collection("billboard")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { properties: { ...this.properties } } }
      );
    console.log(billboard);
    return billboard;
  }
};
