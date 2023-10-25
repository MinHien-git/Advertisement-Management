const { getDb } = require("../database/database");

const _get_map = async (request, response) => {
  let billboards = await getDb().collection("billboard").find({}).toArray();
  let ward = response.locals.ward ?response.locals.ward:''
  let street=response.locals.street ?response.locals.street:''

  billboards = billboards.filter((i)=> {
    let address = i?.properties?.place.split(', ')

    if ((address.find(a=>a==ward)||!ward) && (address.find(a=>a == street)||!street)){
      return i
    }
  })
  console.log(billboards)
  response.render("users/map-page/map", {
    action: false,
    billboards: billboards,
  });
};

module.exports = { _get_map };
