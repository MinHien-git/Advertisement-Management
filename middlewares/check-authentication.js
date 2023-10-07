const check_authentication_status = (request, response, next) => {
  const uid = request.session.uid;

  if (!uid) {
    return next();
  }

  response.locals.uid = uid;
  response.locals.isAuth = true;
  next();
};

module.exports = check_authentication_status;
