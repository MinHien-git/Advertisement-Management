const { request, response } = require("express");
const { getDb } = require("../database/database");

const _get_map = async (request, response) => {
  let billboards = await getDb().collection("billboard").find({}).toArray();
  let ward = response.locals.ward ? response.locals.ward : "";
  let street = response.locals.street ? response.locals.street : "";

  billboards = billboards.filter((i)=> {
    if (ward == '' && province == '')
      return i
    let address = i?.properties?.place.split(', ')

    if ((address.find(a=>a==ward)||!ward) && (address.find(a=>a == street)||!street)){
      return i
    }
  });
  response.render("phan-cum-nguoi-dan/trangchu", {
    action: false,
    billboards: billboards,
  });
};

const _manage_map = async (request, response) => {
  let billboards = await getDb().collection("billboard").find({}).toArray();
  let ward = response.locals.ward ?response.locals.ward:''
  let street=response.locals.street ?response.locals.street:''

  billboards = billboards.filter((i) => {
    let address = i?.properties?.place.split(", ");

    if ((address.find(a=>a==ward)||!ward) && (address.find(a=>a == street)||!street)){
      return i
    }
  })
  if(response.locals.street){
   return response.render("users/billboard-management/billboard-management",{billboards:billboards})
  }
  return response.redirect("/")
}

module.exports = { _get_map, _manage_map };
