const check_authentication_status = (request, response, next) => {
  const uid = request.body.uid;

  if (!uid) {
    return next();
  }

  response.locals.uid = uid;
  response.locals.isAuth = true;
};
