const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const auth_routes = require("./routes/authentication.route");
const map_routes = require("./routes/home.route");
const report_routes = require("./routes/report.route");
const citizen_routes = require("./routes/nguoidan.route");
const wardStreet_routes = require("./routes/phuongquan.route");
const Department_routes = require("./routes/soVHTT.route");
const mail_routes = require("./routes/mail.route");
const otp_routes = require("./routes/otp.route");

const check_authentication_status = require("./middlewares/check-authentication");
const db = require("./database/database");
const create_session_config = require("./config/session");
const express_session = require("express-session");
const session_config = create_session_config();
const passport = require("passport");

require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT;
app.use(express.json({ limit: "150mb" }));
app.use(
  express.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: "150mb",
  })
);

app.use(express_session(session_config));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(check_authentication_status);

app.use(auth_routes);
app.use(map_routes);
app.use(report_routes);
app.use(citizen_routes);
app.use(wardStreet_routes);
app.use(Department_routes);
app.use(mail_routes);
app.use(otp_routes);

db.connectToDataBase()
  .then(() => app.listen(port, () => console.log(`listen to port ${port}`)))
  .catch((error) => {
    console.error("Failed to connect to database");
    console.log(error);
  });
