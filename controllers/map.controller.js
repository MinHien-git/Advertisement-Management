const { request, response } = require("express");
const { getDb } = require("../database/database");

const _get_map = async (request, response) => {
  let billboards = await getDb().collection("billboards").find({}).toArray();
  let ward = response.locals.ward ? response.locals.ward : "";
  let district = response.locals.district ? response.locals.district : "";
  let reports = [];
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
    if (
      (billboards = billboards.filter((i) => {
        if (ward == "" && district == "") return i;
        let address = i?.properties?.place.split(", ");

        if (
          (address.find((a) => a == ward) || !ward) &&
          (address.find((a) => a == district) || !district)
        ) {
          return i;
        }
      }))
    ) {
      reports = await getDb()
        .collection("reports")
        .find({
          "properties.sender_email": { $eq: response.locals.email },
        })
        .toArray();
      return response.render("phan-cum-nguoi-dan/trangchu", {
        action: false,
        billboards: billboards,
        reports: reports,
      });
    }
  } else if (response.locals.type_user == 1) {
    return response.redirect("/dashboard");
  } else if (response.locals.type_user == 2) {
    return response.redirect("/management/billboards");
  }
};

const _manage_map = async (request, response) => {
  let billboards = await getDb().collection("billboards").find({}).toArray();
  let reports = await getDb().collection("reports").find({}).toArray();
  return response.render("phan-cum-soVHTT/map", {
    billboards: billboards,
    reports: reports,
  });
};

module.exports = { _get_map, _manage_map };
