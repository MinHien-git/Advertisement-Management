const { request, response } = require("express");
const { getDb } = require("../database/database");

const _get_map = async (request, response) => {
  let billboards = await getDb().collection("billboard").find({}).toArray();
  let ward = response.locals.ward ? response.locals.ward:''
  let province = response.locals.province ? response.locals.province:''

  billboards = billboards.filter((i)=> {
    if (ward == '' && province == '')
      return i
    let address = i?.properties?.place.split(', ')

    if ((address[1] == ward) && (address[2] == province)) {
      return i
    }
  })
  console.log(billboards)
  response.render("users/map-page/map", {
    action: false,
    billboards: billboards,
  });
};

const _manage_map = async (request,response) => {
  let billboards = await getDb().collection("billboard").find({}).toArray();
  let ward = response.locals.ward ? response.locals.ward:'Bến Nghé'
  let province = response.locals.street ? response.locals.province:'Quận 1'

  billboards = billboards.filter((i)=> {
    let address = i?.properties?.place.split(', ')

    if ((address[1] == ward) && (address[2] == province)) {
      return i
    }
  })
  //if(response.locals.province){
   return response.render("users/billboard-management/billboard-management",{billboards:billboards})
  //}
  return response.redirect("/")
}

module.exports = { _get_map,_manage_map };
