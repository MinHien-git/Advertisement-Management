const express = require("express");
const map_controller = require("../controllers/map.controller");

const router = express.Router();

router.get("/", map_controller._get_map);

module.exports = router;
