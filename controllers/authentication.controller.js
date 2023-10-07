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
      return response.redirect("/");
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
module.exports = { _get_login, _login, _get_register, _register, _logout };
