const User = require("../model/userModel");
const emailVerification = require("../utils/emailVarification");
const Personal = require("../model/personalModel");
const forgotPassMail = require("../utils/forgotPassMail");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sendVerification = require("../lib/sendVerification");
const jwt = require("jsonwebtoken");
const Account = require("../model/accountModel");

module.exports = {
  loggedInUser: async (req, res) => {
    const { email } = req.user;
    const user = await User.findOne({ email })
      .select({
        agreeWithCondition: 0,
        password: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      })
      .populate("forums", "-author -comments -__v")
      .populate("academicInfo", "-_id -__v -user")
      .populate("personalInfo", "-_id -__v -user");
    res.status(200).json(user);
  },
  userById: async (req, res) => {
    try {
      const { id } = req.params;
      const member = await User.findOne({ _id: id })
        .select({
          password: 0,
          __v: 0,
        })
        .populate("academicInfo", "-_id -__v -user")
        .populate("personalInfo", "-_id -__v -user");
      if (!member) {
        res.status(400).json({
          message: "Member Not Found!",
        });
      } else {
        res.status(200).json({ member });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Side Error!",
      });
    }
  },
  uploadDocument: async (req, res) => {
    if (!req.files) {
      console.log("No file received");
      return res.send({
        success: false,
      });
    } else {
      try {
        const host = req.get("host");
        for (let file in req.files) {
          const filePath =
            "https://" +
            host +
            "/" +
            req.files[file][0].path.replace(/\\/g, "/");
          if (file === "courseConfirmation") {
            const result = await User.findByIdAndUpdate(
              req.user.id,
              {
                $set: { courseConfirmation: filePath },
              },
              {
                new: true,
              }
            );
          } else if (file === "ageConfirmation") {
            const result = await User.findByIdAndUpdate(
              req.user.id,
              {
                $set: { ageConfirmation: filePath },
              },
              {
                new: true,
              }
            );
          } else {
            const result = await User.findByIdAndUpdate(
              req.user.id,
              {
                $set: { photo: filePath },
              },
              {
                new: true,
              }
            );
          }
        }
        res.status(200).json({ message: "Photo Upload Successfully" });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: "server error occurd",
        });
      }
    }
  },
  emailVerificationCode: async (req, res) => {
    // const { url } = req.body;
    const { email } = req.user;
    // emailVerification(email, url);
    const code = sendVerification(email);
    res.status(200).json({
      message: "email send successfully",
      code,
    });
  },
  verifyVCode: async (req, res) => {
    const { id } = req.user;
    const { token, code } = req.body;
    try {
      jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {
          console.log(err);
          res.status(403).json({
            message: "Forbidden Access",
          });
        } else {
          if (decoded === code) {
            await User.findByIdAndUpdate(
              id,
              {
                $set: {
                  emailVerified: true,
                },
              },
              { new: true }
            );
            res.status(200).json({
              message: "verification successfully",
            });
          } else {
            res.status(401).json({
              message: "Code Not Matched!",
            });
          }
        }
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "User Not Found" });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { id } = req.user;
      const { current, password } = req.body;
      const user = await User.findById(id);
      const matched = await bcrypt.compare(current, user.password);
      if (!matched) {
        return res.status(400).json({
          message: "Password Not Matched!",
        });
      } else {
        const hashed = await bcrypt.hash(password, 11);
        await User.findByIdAndUpdate(id, { password: hashed });
        res.status(200).json({
          message: "Password Changed Successfully!",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const code = sendVerification(email);
      res.status(200).json({
        message: "email sent to your address",
        code,
      });
    } else {
      res.status(404).json({
        message: "User Not Found!",
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email, password, token, code } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
          if (err) {
            console.log(err);
            res.status(403).json({
              message: "Forbidden Access",
            });
          } else {
            if (decoded === code) {
              const hashed = await bcrypt.hash(password, 11);
              await User.findOneAndUpdate(
                { email },
                {
                  $set: {
                    password: hashed,
                  },
                }
              );
              res.status(200).json({
                message: "Password Reset Successfull",
              });
            } else {
              res.status(401).json({
                message: "Code Not Matched!",
              });
            }
          }
        });
      } else {
        res.status(404).json({
          message: "User Not Found!",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({
        message: "User Not Found!",
      });
    }
  },
  makePaymentRequest: async (req, res) => {
    try {
      const { id } = req.user;
      const data = { member: id, ...req.body, transactionType: "revenue" };
      const payment = await Account.create(data);
      res.status(201).json({
        message: "Payment Request Created Successfully!",
        payment,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
  myPayments: async (req, res) => {
    const { id } = req.user;
    const { page, size } = req.query;
    let payments;
    if (page || size) {
      payments = await Account.find({
        member: new mongoose.Types.ObjectId(id),
      })
        .limit(parseInt(size))
        .skip(parseInt(size) * parseInt(page));
    } else {
      payments = await Account.find({
        member: new mongoose.Types.ObjectId(id),
      });
    }
    res.status(200).json(payments);
  },
  deletePayment: async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { id } = req.user;
      await Account.findByIdAndDelete(paymentId, {
        member: new mongoose.Types.ObjectId(id),
        status: "pending",
      });
      res.status(200).json({
        message: "Payment Request Deleted",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
};
