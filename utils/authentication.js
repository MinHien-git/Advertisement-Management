const create_user_session = (request, user, action) => {
  request.session.uid = user._id.toString();
  request.session.email = user.email;
  request.session.ward = user.ward;
  request.session.district = user.district;
  request.session.name = user.name;
  request.session.type_user = user.type_user ? user.type_user : 0;
  request.session.save(action);
};

const delete_user_authentication = (request) => {
  request.session.uid = null;
  request.session.email = null;
  request.session.ward = null;
  request.session.name = null;
  request.session.district = null;
  request.session.type_user = 0;
};

module.exports = {
  create_user_session,
  delete_user_authentication,
};
