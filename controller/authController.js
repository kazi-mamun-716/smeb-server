const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const Academic = require("../model/academicModel");
const Personal = require("../model/personalModel");
const memberApproval = require("../utils/memberApproval");
const emailVarification = require("../utils/emailVarification");
const { default: mongoose } = require("mongoose");
const sendVerification = require("../lib/sendVerification");
const adminNotificationMail = require("../utils/adminNotificationMail");
const Admin = require("../model/adminModel");

module.exports = {
  register: async (req, res) => {
    try {
      const {
        name,
        password,
        email,
        gender,
        mobile,
        whatsapp,
        telegram,
        url,
        ...rest
      } = req.body;
      const { course, institute, intake, passed, ...personal } = rest;
      const exists = await User.findOne({ email });
      if (!exists) {
        const hashed = await bcrypt.hash(password, 11);
        const user = await User.create({
          name,
          email,
          password: hashed,
          gender,
          mobile,
          whatsapp,
          telegram,
        });
        const academicInfo = await Academic.create({
          user: user._id,
          course,
          institute,
          intake,
          passed,
        });
        const personalInfo = await Personal.create({
          user: user._id,
          ...personal,
        });
        await User.findByIdAndUpdate(user._id, {
          $set: {
            personalInfo: personalInfo._id,
            academicInfo: academicInfo._id,
          },
        });
        //send verification code
        const code = sendVerification(email);
        const jwtToken = jwt.sign(
          { id: user._id, name: user.name, email },
          process.env.SECRET
        );
        //send mail to admin secretary
        const as = await Admin.findOne({ role: "admin secretary" });
        const gs = await Admin.findOne({ role: "general secretary" });
        const adminText = `
        ${user.name}' applied for registration.
        Now need to your approval for further action. 
        Please verify this id.
        `;
        const gsText = `
        ${user.name}' applied for registration.
        Now need to admins approval for further action. 
        Please verify this id.
        `;
        adminNotificationMail(as.email, adminText);
        adminNotificationMail(gs.email, gsText);
        return res.status(201).json({
          message: "Registration Successfull",
          token: jwtToken,
          code,
        });
      }
      return res.status(401).json({
        message: "Member Already Registered",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User Not Found!",
      });
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(401).json({
        message: "Password is incorrect!",
      });
    }
    const jwtToken = jwt.sign(
      { id: user._id, name: user.name, email },
      process.env.SECRET
    );
    res.status(200).json({
      message: "Login Successfull",
      token: jwtToken,
    });
  },
  updateUser: async (req, res) => {},
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      await Personal.deleteOne({ user: new mongoose.Types.ObjectId(id) });
      await Academic.deleteOne({ user: new mongoose.Types.ObjectId(id) });
      res.status(200).json({
        message: "Member Delete Successfully!",
      });
    } catch (err) {
      res.status(500).json({
        message: "Server Side Error!",
      });
      console.log(err);
    }
  },
  countUser: async (req, res) => {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  },
};
