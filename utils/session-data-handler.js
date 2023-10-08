const get_session_data = (request) => {
  const session_data = request.session.data;
  request.session.data = null;
  return session_data;
};

const recieve_session_data = (request, data, action) => {
  request.session.data = data;
  request.session.save(action);
};

module.exports = {
  get_session_data,
  recieve_session_data,
};
