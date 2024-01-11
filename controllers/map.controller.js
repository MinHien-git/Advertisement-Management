const { request, response } = require("express");
const { getDb } = require("../database/database");

const _get_map = async (request, response) => {
  let billboards = await getDb()
    .collection("billboards")
    .aggregate([
      {
        $unwind: "$properties.boards",
      },
      {
        $lookup: {
          from: "licenses",
          localField: "properties.boards.license",
          foreignField: "_id",
          as: "properties.boards.license",
        },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          "properties.place": 1,
          "properties.place_type": 1,
          "properties.type_advertise": 1,
          "properties.status": 1,
          "properties.board_amount": 1,
          boards: "$properties.boards",
          geometry: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          type: { $first: "$type" },
          properties: { $first: "$properties" },
          boards: { $push: "$boards" },
          geometry: { $first: "$geometry" },
        },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          "properties.place": 1,
          "properties.place_type": 1,
          "properties.type_advertise": 1,
          "properties.status": 1,
          "properties.board_amount": 1,
          "properties.boards": "$boards",
          geometry: 1,
        },
      },
    ])
    .toArray();
  console.log(JSON.stringify(billboards, null, "  "), billboards.length);

  let ward = response.locals.ward ? response.locals.ward : "";
  let district = response.locals.district ? response.locals.district : "";

  let reports = [];
  billboards = billboards.filter((i) => {
    if (ward == "" && district == "") return true;
    let address = i?.properties?.place.split(", ");

    if (
      (address.find((a) => a == ward) || ward == "") &&
      (address.find((a) => a == district) || district == "")
    ) {
      return true;
    }
    return false;
  });
  if (response.locals.type_user == 0 || !response.locals.type_user) {
    if (true) {
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
