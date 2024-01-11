const express = require("express");
const router = express.Router();

const { ObjectId } = require("mongodb");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images/user_images");
  },
  filename: function (req, file, callback) {
    if (file.mimetype === "image/png") {
      callback(null, new ObjectId().toString() + ".png");
    }
    if (file.mimetype === "image/jpeg") {
      callback(null, new ObjectId().toString() + ".jpeg");
    }
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: { fieldSize: 10 * 1024 * 1024 },
});

const controller = require("../controllers/nguoidan.controller");

router.post(
  "/report",
  controller._post_report
);

module.exports = router;
