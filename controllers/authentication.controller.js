const _get_login = (request, response) => {
  response.render("users/authentication/login");
};

const _login = (request, response) => {};

const _get_register = (request, response) => {
  response.render("users/authentication/register");
};

const _register = (request, response) => {
  response.render("users/authentication/login");
};
module.exports = { _get_login, _login, _get_register, _register };
