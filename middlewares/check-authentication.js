const check_authentication_status = (request, response, next) => {
  const uid = request.session.uid;
  const ward = request.session.ward;
  const street = request.session.street;
  if (!uid) {
    return next();
  }

  response.locals.uid = uid;
  response.locals.isAuth = true;
  response.locals.type_user = request.session.type_user;

  response.locals.ward = ward;
  response.locals.street = street;
  next();
};

module.exports = check_authentication_status;
