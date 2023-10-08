const create_user_session = (request, user, action) => {
  request.session.uid = user._id.toString();
  request.session.email = user.email;
  request.session.save(action);
};
const delete_user_authentication = (request) => {
  request.session.uid = null;
  request.session.email = null;
};
module.exports = {
  create_user_session,
  delete_user_authentication,
};
