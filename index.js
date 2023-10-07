const express = require("express");
const path = require("path");

const app = express();
const auth_routes = require("./routes/authentication.route");
const map_routes = require("./routes/home.route");
const db = require("./database/database");
const create_session_config = require("./config/session");
const express_session = require("express-session");
const session_config = create_session_config();

require("dotenv").config();

const port = process.env.PORT;
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: "50mb",
  })
);

app.use(express_session(session_config));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(auth_routes);
app.use(map_routes);

db.connectToDataBase()
  .then(() => app.listen(port, () => console.log(`listen to port ${port}`)))
  .catch((error) => {
    console.error("Failed to connect to database");
    console.log(error);
  });
