const { getDb } = require("../database/database");

const _get_map = async (request, response) => {
  let billboards = await getDb().collection("billboard").find({}).toArray();
  console.log(billboards);
  response.render("users/map-page/map", {
    action: false,
    billboards: billboards,
  });
};

module.exports = { _get_map };
