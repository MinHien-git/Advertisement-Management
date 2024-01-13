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
const { readFile } = require("fs/promises");
const { ObjectId } = require("mongodb");

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
    .then(async () => {
        app.listen(port, () => console.log(`listen to port ${port}`));
        let cc = await db.getDb().listCollections().toArray();
        const collections = [
            "billboards",
            "licenses",
            "billboard-request",
            "board-request",
            "reports",
            "billboard_types",
            "ad_types",
            "place_types",
            "report_types",
            "district-ward",
            "users",
        ];
        let collection_states = {};
        for (let i = 0; i < collections.length; i++) {
            Object.assign(collection_states, {
                [collections[i]]: false,
            });
        }
        for (let i = 0; i < cc.length; i++) {
            if (cc[i].name == "sessions") continue;

            collection_states[cc[i].name] = true;
        }
        console.log("existing collection states:", collection_states);
        for (let [key, value] of Object.entries(collection_states)) {
            if (value == true) continue;
            let file = JSON.parse(
                await readFile("./test_data/" + key + ".json", "utf-8")
            );
            if (file[0]._id) {
                if (key == "billboards") {
                    for (let i = 0; i < file.length; i++) {
                        file[i]._id = new ObjectId(file[i]._id["$oid"]);
                        if (file[i].properties.boards?.length > 0) {
                            for (
                                let j = 0;
                                j < file[i].properties.boards?.length;
                                j++
                            ) {
                                file[i].properties.boards[j]._id = new ObjectId(
                                    file[i].properties.boards[j]._id["$oid"]
                                );
                            }
                        }
                    }
                } else if (key == "licenses") {
                    for (let i = 0; i < file.length; i++) {
                        file[i]._id = new ObjectId(file[i]._id["$oid"]);
                        file[i].billboard.billboard_id = new ObjectId(
                            file[i].billboard.billboard_id["$oid"]
                        );
                        file[i].billboard.board_id = new ObjectId(
                            file[i].billboard.board_id["$oid"]
                        );
                    }
                } else if (key.includes("request")) {
                    for (let i = 0; i < file.length; i++) {
                        file[i]._id = new ObjectId(file[i]._id["$oid"]);
                        file[i].billboard = new ObjectId(
                            file[i].billboard["$oid"]
                        );
                    }
                } else if (key == "reports") {
                    for (let i = 0; i < file.length; i++) {
                        file[i]._id = new ObjectId(file[i]._id["$oid"]);
                        file[i].properties.send_day = new Date(
                            file[i].properties.send_day["$date"]
                        );
                    }
                }
            }
            await db.getDb().collection(key).insertMany(file);
            console.log("Collection ", key, "added!");
        }
    })
    .catch((error) => {
        console.error("Failed to connect to database");
        console.log(error);
    });
