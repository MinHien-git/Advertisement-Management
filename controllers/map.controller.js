const { request, response } = require("express");
const { getDb } = require("../database/database");

const _get_map = async (request, response) => {
  let billboards = await getDb().collection("billboard").find({}).toArray();
  let ward = response.locals.ward ? response.locals.ward : "";
  let district = response.locals.district ? response.locals.district : "";

  billboards = billboards.filter((i) => {
      if (ward == "" && district == "") return i;
      let address = i?.properties?.place.split(", ");

      if (
          (address.find((a) => a == ward) || !ward) &&
          (address.find((a) => a == district) || !district)
      ) {
          return i;
      }
  });
  if (response.locals.type_user == 0 || !response.locals.type_user) {
    return response.render("phan-cum-nguoi-dan/trangchu", {
      action: false,
      billboards: billboards,
    });
  } else if (response.locals.type_user == 1) {
    return response.render("phan-cum-phuong/trangchu", {
      action: false,
      billboards: billboards,
    });
  } else if (response.locals.type_user == 2) {
    return response.render("phan-cum-soVHTT/map", {
      action: false,
      billboards: billboards,
    });
  }
};

const _manage_map = async (request, response) => {
  let billboards = await getDb().collection("billboard").find({}).toArray();

  return response.render("phan-cum-soVHTT/map", {
    billboards: billboards,
  });
};

module.exports = { _get_map, _manage_map };
