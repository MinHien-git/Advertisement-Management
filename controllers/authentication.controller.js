const User = require("../models/users.model");
const auth_ultis = require("../utils/authentication");
const _get_login = (request, response) => {
  response.render("users/authentication/login");
};

const _login = async (request, response) => {
  let { email, password } = request.body;
  let user = new User(email, password);
  console.log(request.locals);
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
  let user = new User(email, password, phone, name);

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
  let user = new User(email, "", phone, name, birth);
  let { id } = request.params;

  if (await user._update(id)) {
  }
};

const _update_password = async (request, response) => {
  let { old_password, new_password } = request.body;
  let user = new User(email, old_password, phone, name, birth);

  if (await user._change_password(new_password)) {
  }
};

const _forgot_password = async (request, response) => {
  let { email } = request.body;
};

module.exports = {
  _get_login,
  _login,
  _get_register,
  _register,
  _logout,
  _update_infomation,
  _update_password,
};
