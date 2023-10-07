let mongodb = require("mongodb");
let database;

const client = new mongodb.MongoClient(
  "mongodb://127.0.0.1:27017/advertise-management",
  {
    serverApi: {
      version: mongodb.ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);
async function connectToDataBase() {
  let res = await client.connect();
  database = res.db();
}

function getDb() {
  if (!database) {
    throw new Error("Could not find database");
  }
  return database;
}

module.exports = {
  connectToDataBase: connectToDataBase,
  getDb: getDb,
};
