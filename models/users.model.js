const bcrypt = require("bcrypt");
const db = require("../database/database");
const USER_TYPE = require("../constants/user.type");
const { ObjectId } = require("mongodb");


module.exports = class User {
  constructor(email, password, type_user, phone = "", name = "", birth = "") {
    this.email = email;
    this.password = password;
    this.name = name;
    this.birth = birth;
    this.phone = phone;
    this.type_user = type_user;
  }

  async _login() {
    const user = await db
      .getDb()
      .collection("users")
      .findOne({ email: this.email });
    if (user) {
      if (await bcrypt.compare(this.password, user.password)) {
        return user;
      }
    }
    return undefined;
  }

  async _register() {
    if (
      !(await db.getDb().collection("users").findOne({ email: this.email }))
    ) {
      let password = await bcrypt.hash(this.password, 12);
      const user = await db
        .getDb()
        .collection("users")
        .insertOne({ ...this, password });
      return user;
    }
    return undefined;
  }

  async _update(id) {
    const user = await db.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          email: this.email,
          birth: this.birth,
          email: this.email,
          phone: this.phone,
        },
      },
      { returnDocument: "after" }
    );

    return user;
  }

  async _change_password(new_password) {
    const user = await db.findOne({ email: this.email });
    if (user && (await bcrypt.compare(this.password, user.password))) {
      let password = await bcrypt.hash(new_password, 12);
      const user = await db.findOneAndUpdate(
        { email: this.email },
        { password: password },
        { returnDocument: "after" }
      );

      return user;
    }
  }

  async _forgot_password() {}
};
