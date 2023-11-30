const express = require("express");
const router = express();

router.get("management/advertise");
router.post("management/account/edit/:id");
router.post("management/account/delete/:id");
router.post("management/account/create");

router.get("management/license");
router.post("management/license/approve");
router.post("management/license/request");
router.post("management/license/decline");

router.get("management/report");

router.get("management/account");
router.post("management/account/edit/:id");
router.post("management/account/delete/:id");
router.post("management/account/create");
module.exports = router;
