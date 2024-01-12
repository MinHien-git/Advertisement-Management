const { ObjectId } = require("mongodb");
const { getDb } = require("../database/database");
const User = require("../models/users.model");
const auth_ultis = require("../utils/authentication");
const bcrypt = require("bcrypt");
const database = require("../database/database");

const _get_login = (request, response) => {
  response.render("users/authentication/login");
};

const _login = async (request, response) => {
  let { email, password } = request.body;
  let user = new User(email, password);
  console.log(email, password);
  let _user = await user._login();
  if (_user) {
    auth_ultis.create_user_session(request, _user, () => {
      if (_user.type_user === 2) {
        return response.redirect("/management/billboards");
      } else {
        return response.redirect("/");
      }
    });
  } else {
    return response.redirect("/?login=failed");
  }
};

const _get_register = (request, response) => {
  response.render("users/authentication/register");
};

const _register = async (request, response) => {
  let { email, password, name, phone } = request.body;
  let user = new User(email, password, 0, phone, name);

  if (await user._register()) {
    return response.redirect("/");
  } else {
    return response.redirect("/?register=failed");
  }
};

const _logout = (request, response) => {
  auth_ultis.delete_user_authentication(request);
  response.redirect("/");
};

const _update_infomation = async (request, response) => {
  let { email, birth, name, phone } = request.body;
  let { id } = request.params;
  let params = {
    name: name,
    email: email,
    birth: birth,
    phone: phone,
  };

  for (let prop in params) if (!params[prop]) delete params[prop];

  const user = await getDb()
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...params } },
      {
        returnDocument: "after",
      }
    );
  response.redirect("/");
};
const _change_password = async (request, response) => {
  let { old_password, new_password } = request.body;
  console.log(request.body);
  let { id } = request.params;
  let user = await database
    .getDb()
    .collection("users")
    .findOne({ _id: new ObjectId(id) });
  if (user && !user.password) {
    let password = await bcrypt.hash(new_password, 12);
    const user = await getDb()
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { password: password } },
        { returnDocument: "after" }
      );
  } else if (user && (await bcrypt.compare(old_password, user.password))) {
    let password = await bcrypt.hash(new_password, 12);
    const user = await getDb()
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { password: password } },
        { returnDocument: "after" }
      );
  }
  response.redirect("/");
};
const _update_password = async (request, response) => {
  let { old_password, new_password } = request.body;
  let user = new User(email, old_password, phone, name, birth);

  if (await user._change_password(new_password)) {
  }
};

const _reset_password = async (request, response) => {
  let { password, repassword, id } = request.body;
  console.log(id);
  if (password === repassword) {
    let pw = await bcrypt.hash(password, 12);
    let user = await getDb()
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { password: pw } },
        { returnDocument: "after" }
      );
    if (user) {
      response.redirect("/");
    }
  }
  response.render("updatepassword");
};

module.exports = {
  _get_login,
  _login,
  _get_register,
  _register,
  _logout,
  _update_infomation,
  _update_password,
  _reset_password,
  _change_password,
};
