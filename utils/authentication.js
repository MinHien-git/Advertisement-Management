const create_user_session = (request, user, action) => {
  request.session.uid = user._id.toString();
  request.session.save(action);
};

module.exports = {
  create_user_session,
};
