const express = require("express");
const router = express.Router();

const controller = require("../controllers/nguoidan.controller");

router.post("/report", controller._post_report);

module.exports = router;
