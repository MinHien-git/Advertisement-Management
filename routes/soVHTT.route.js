const express = require("express");
const router = express();

router.get("/management/advertise");
router.post("/management/advertise/edit/:id");
router.delete("/management/advertise/delete/:id");
router.post("/management/advertise/create");

router.get("/management/license");
router.post("/management/license/approve");
router.post("/management/license/request");
router.post("/management/license/decline");

router.get("/management/report");

router.get("/management/account");
router.post("/management/account/edit/:id");
router.delete("/management/account/delete/:id");
router.post("/management/account/create");
module.exports = router;
