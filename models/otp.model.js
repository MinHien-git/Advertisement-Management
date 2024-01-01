const { getDb } = require("../database/database");

module.exports = class OTP {
  constructor(email, code) {
    this.email = email;
    this.code = code;
  }
  async save() {
    getDb()
      .collection("otps")
      .createIndex({ expire: 1 }, { expireAfterSeconds: 3600 });
    await getDb()
      .collection("otps")
      .insertOne({ ...this, expire: Date.now });
  }
  async confirm() {
    let otp = await getDb()
      .collection("otps")
      .findOne({ email: this.email, code: this.code });
    if (otp) {
      return true;
    }
    return false;
  }
};
