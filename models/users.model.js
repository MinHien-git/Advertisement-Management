const bcrypt = require("bcrypt");
const db = require("../database/database");
module.exports = class User {
  constructor(
    email,
    password,
    phone = "",
    name = "",
    address = "",
    birth = ""
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.birth = birth;
    this.phone = phone;
    this.address = address;
  }

  _login() {}

  async _register() {
    // if (await !db.getDb().collection("users").findOne({ email: this.email })) {
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
    console.log(
      await db.getDb().collection("users").findOne({ email: this.email })
    );
    return undefined;
    // }
  }

  _update() {}

  _change_password() {}

  _forgot_password() {}
};
