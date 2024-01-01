const express = require("express");

const router = express.Router();

router.get("/resetpassword", (req, res) => {
  res.render("forgotpassword");
});

module.exports = router;
