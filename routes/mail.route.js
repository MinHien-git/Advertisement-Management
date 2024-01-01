const express = require("express");

const router = express.Router();
const nodemailer = require("nodemailer");
const Otp = require("../models/otp.model");
const { getDb } = require("../database/database");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lmhien21@clc.fitus.edu.vn",
    pass: "LMinhHien16102003",
  },
});

router.post("/generateOTP", (req, res) => {
  const { email } = req.body;

  // Generate a new OTP code and send it via email
  this.otpCode = Math.floor(100000 + Math.random() * 900000);
  const mailOptions = {
    from: "my@gmail.com",
    to: email,
    subject: "Reset password OTP",
    html: `
    <p>Dear user,</p>
    
    <p>Your OTP code to reset password is <h3>${this.otpCode}</h3></p>
    
    <p>This OTP will expire three hours after this email was sent.</p>

    <p>If you did not make this require, Please ingore this email</p>`,
  };

  transporter.sendMail(mailOptions, (error, _info) => {
    if (error) {
      console.error("Error sending email: ", error);
      res.status(500).send({ message: "Failed to send OTP" });
    } else {
      let otp = new Otp(email, this.otpCode);
      otp.save();
      console.log("OTP sent: ", this.otpCode);
      res.locals.email = email;
      res.render("otpconfirm");
    }
  });
});

router.post("/confirmOTP", async (req, res) => {
  const { OTP, email } = req.body;

  let otp = new Otp(email, OTP);
  res.locals.email = email;
  if (otp.confirm()) {
    let user = await getDb().collection("users").findOne({ email: email });
    if (user) {
      res.locals._id = user._id;
      console.log(res.locals._id);
      return res.render("updatepassword");
    }
  }
  res.render("otpconfirm");
});

module.exports = router;

module.exports = router;
