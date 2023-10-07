const User = require("../models/users.model");

const _get_login = (request, response) => {
  response.render("users/authentication/login");
};

const _login = async (request, response) => {
  let { email, password } = request.body;
  let user = new User(email, password);

  await user._login();
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
module.exports = { _get_login, _login, _get_register, _register };
