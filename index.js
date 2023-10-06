const express = require("express");
const path = require("path");

const app = express();
const auth_routes = require("./routes/authentication.route");
const map_routes = require("./routes/home.route");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(auth_routes);
app.use(map_routes);

app.listen(5000, () => console.log("listen to port ", 5000));
