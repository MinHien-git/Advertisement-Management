const express = require("express");
const { route } = require("express/lib/application");
const authentication_controller = require("../controllers/authentication.controller");

const router = express.Router();

router.get("/login", authentication_controller._get_login);
router.post("/login", authentication_controller._login);

router.get("/register", authentication_controller._get_register);
router.post("/register", authentication_controller._register);

router.post("/logout", authentication_controller._logout);

router.get("/update", (request, response) => {});
router.post("/update", (request, response) => {});

module.exports = router;
