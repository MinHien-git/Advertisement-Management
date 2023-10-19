const mongoDBStore = require("connect-mongodb-session");
const express_session = require("express-session");

const create_session_store = () => {
  const mongoStore = mongoDBStore(express_session);

  let store = new mongoStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "advertise-management",
    collection: "sessions",
  });

  return store;
};

const create_session_config = () => {
  return {
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    store: create_session_store(),
  };
};

module.exports = create_session_config;
