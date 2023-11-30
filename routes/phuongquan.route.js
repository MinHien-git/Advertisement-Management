const express = require("express");
const router = express();
router.get("management/advertise");
router.get("management/license");
router.post("management/license/request");
router.post("management/license/decline");
router.get("management/license/edit");
router.get("management/report");
router.get("management/report/:id");
router.post("management/report/edit/:id");

module.exports = router;
