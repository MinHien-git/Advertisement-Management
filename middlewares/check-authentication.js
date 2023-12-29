const check_authentication_status = (request, response, next) => {
  const uid = request.session.uid;
  const ward = request.session.ward;
  const district = request.session.district;
  const name = request.session.name;
  if (!uid) {
    return next();
  }

  response.locals.uid = uid;
  response.locals.isAuth = true;
  response.locals.type_user = request.session.type_user;
  response.locals.name = name;
  response.locals.ward = ward;
  response.locals.district = district;
  next();
};

module.exports = check_authentication_status;
