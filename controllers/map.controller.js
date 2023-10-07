const _get_map = (request, response) => {
  response.render("users/map-page/map", { action: false });
};

module.exports = { _get_map };
