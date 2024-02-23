const Admin = require("../model/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const memberApproval = require("../utils/memberApproval");
const adminNotificationMail = require("../utils/adminNotificationMail");
const mongoose = require("mongoose");
const Account = require("../model/accountModel");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, password, email, role } = req.body;
      const exists = await Admin.findOne({ email });
      if (!exists) {
        const hashed = await bcrypt.hash(password, 11);
        await Admin.create({
          name,
          email,
          password: hashed,
          role,
        });
        return res.status(201).json({
          message: "Registration Successfull",
        });
      }
      return res.status(401).json({
        message: "Admin Already Registered",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Admin Not Found!",
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
  changePassword: async (req, res) => {
    const { id } = req.user;
    const { current, password } = req.body;
    try {
      const admin = await Admin.findById(id);
      const compare = await bcrypt.compare(current, admin.password);
      if (compare) {
        const hashed = await bcrypt.hash(password, 11);
        console.log(hashed);
        await Admin.findByIdAndUpdate(id, { password: hashed }, { new: true });
        res.status(200).json({ message: "Password Change Successfully!" });
      } else {
        res.status(400).json({
          message: "Current Password is Incorrect!",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internel Server Error!" });
    }
  },
  loggedInAdmin: async (req, res) => {
    const { email } = req.user;
    const admin = await Admin.findOne({ email }).select({
      password: 0,
      backupPass:0,
      __v: 0,
    });
    res.status(200).json(admin);
  },
  allMember: async (req, res) => {
    try {
      const { page, size, filter } = req.query;
      let users;
      let newFilter = {};
      if (filter !== "all") {
        newFilter = { status: filter };
      }
      if (page || size) {
        users = await User.find(newFilter)
          .select({
            password: 0,
            __v: 0,
          })
          .limit(parseInt(size))
          .skip(parseInt(size) * parseInt(page))
          .populate("forums", "-author -comments -__v")
          .populate("academicInfo", "-_id -__v -user")
          .populate("personalInfo", "-_id -__v -user");
      } else {
        users = await User.find(newFilter).select({
          password: 0,
          __v: 0,
        });
      }
      res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
  approveUser: async (req, res) => {
    const { id } = req.query;
    const user = await User.findOne({ _id: id });
    const financeSecretary = await Admin.findOne({ role: "finance secretary" });
    const generalSecretary = await Admin.findOne({ role: "general secretary" });
    const president = await Admin.findOne({ role: "president" });
    let newStatus;
    if (req.body.status === "admin secretary") {
      newStatus = "finance secretary";
      const text = `
        Hello ${user.name}, Your application is verified by ${newStatus}
    `;
      memberApproval(user.email, text);
      const adminText = `
        Admin Secretary verified ${user.name}'s application.
        Now need to your approval for further action. 
        Please verify this id.
      `;
      adminNotificationMail(financeSecretary.email, adminText);
    } else if (req.body.status === "finance secretary") {
      newStatus = "general secretary";
      const text = `
        Hello ${user.name}, Your application is verified by ${newStatus}
    `;
      memberApproval(user.email, text);
      const adminText = `
        Admin Secretary verified ${user.name}'s application.
        Now need to your approval for further action. 
        Please verify this id.
      `;
      adminNotificationMail(generalSecretary.email, adminText);
    } else if (req.body.status === "general secretary") {
      newStatus = "president";
      const text = `
        Hello ${user.name}, Your application is verified by ${newStatus}
    `;
      memberApproval(user.email, text);
      const adminText = `
        General Secretary verified ${user.name}'s application.
        Now need to your approval for further action. 
        Please verify this id.
      `;
      adminNotificationMail(president.email, adminText);
    } else {
      newStatus = "active";
      const lastUser = await User.findOne({}, {}, { sort: { smebId: -1 } });
      const lastSmebId = lastUser.smebId ? lastUser.smebId : 1000;
      const smebId = lastSmebId + 1;
      await User.findByIdAndUpdate(id, { smebId }, { new: true, upsert: true });
      const text = `
        Hello ${user.name}, congratulation! Your Id are now activated.
    `;
      memberApproval(user.email, text);
    }
    await User.findByIdAndUpdate(id, { status: newStatus }, { new: true });
    res.status(200).json({
      message: "Updated Successfully",
    });
  },
  changeRole: async (req, res) => {
    try {
      const { id, role } = req.body;
      if (
        role === "president" ||
        role === "vice president" ||
        role === "general secretary" ||
        role === "admin secretary" ||
        role === "finance secretary"
      ) {
        await User.findOneAndUpdate(
          { role },
          {
            $set: {
              role: "member",
            },
          },
          { new: true }
        );
        await User.findByIdAndUpdate(
          id,
          {
            $set: {
              role,
            },
          },
          { new: true }
        );
      } else {
        await User.findByIdAndUpdate(
          id,
          {
            $set: {
              role,
            },
          },
          { new: true }
        );
      }
      res.status(200).json({
        message: "Updated Successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
  countUser: async (req, res) => {
    let newFilter = {};
    if (req.query.filter !== "all") {
      newFilter = { status: req.query.filter };
    }
    const count = await User.countDocuments(newFilter);
    res.status(200).json({ count });
  },
  //payment request controlling
  allPaymentRequest: async (req, res) => {
    try {
      const { page, size } = req.query;
      let paymentReq;
      if (page || size) {
        paymentReq = await Account.find({ status: "pending" })
          .populate("member", "name email")
          .limit(parseInt(size))
          .skip(parseInt(size) * parseInt(page));
      } else {
        paymentReq = await Account.find({ status: "pending" }).populate(
          "member",
          "name email"
        );
      }
      if (paymentReq) {
        res.status(200).json(paymentReq);
      } else {
        res.status(400).json({
          message: "No Payment Request Found!",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
  paymentAction: async (req, res) => {
    try {
      const { id } = req.params;
      const host = req.get("host");
      const filePath =
        req.protocol + "://" + host + "/" + req.file.path.replace(/\\/g, "/");
      const pending = await Account.findById(id);
      const lastActiveDocument = await Account.findOne({ status: "accepted" })
        .sort({ _id: -1 })
        .limit(1);
      if (lastActiveDocument) {
        const amount =
          pending?.transactionType === "revenue"
            ? parseInt(lastActiveDocument.presentAmount) +
              parseInt(pending.amount)
            : parseInt(lastActiveDocument.presentAmount) -
              parseInt(pending.amount);
        await Account.findByIdAndUpdate(
          id,
          { status: "accepted", presentAmount: amount },
          { new: true }
        );
      } else {
        await Account.findByIdAndUpdate(
          id,
          {
            status: "accepted",
            presentAmount: pending.amount,
            payslip: filePath,
          },
          { new: true }
        );
      }
      res.status(202).json({ message: "Payment Status Updated Successfully!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
  paymentsByMemberId: async (req, res) => {
    const { id } = req.params;
    const { page, size } = req.query;
    let payments;
    if (page || size) {
      payments = await Account.find({
        mamber: new mongoose.Types.ObjectId(id),
      })
        .limit(parseInt(size))
        .skip(parseInt(size) * parseInt(page));
    } else {
      payments = await Account.find({
        mamber: new mongoose.Types.ObjectId(id),
      });
    }
    if (payments) {
      res.status(200).json(payments);
    } else {
      res.status(400).json({
        message: "No Payment Found!",
      });
    }
  },
  forgotAdminPassword: async (req, res) => {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin) {
      const code = sendVerification(email);
      res.status(200).json({
        message: "email sent to your address",
        code,
      });
    } else {
      res.status(404).json({
        message: "Admin Not Found!",
      });
    }
  },
  resetAdminPassword: async (req, res) => {
    try {
      const { email, password, token, code } = req.body;
      const admin = await Admin.findOne({ email });
      if (admin) {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
          if (err) {
            console.log(err);
            res.status(403).json({
              message: "Forbidden Access",
            });
          } else {
            if (decoded === code) {
              const hashed = await bcrypt.hash(password, 11);
              await Admin.findOneAndUpdate(
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
          message: "Admin Not Found!",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Side Error!",
      });
    }
  },
  allTransactions: async(req, res)=>{
    let transactions;
    const { page, size, filter } = req.query;
    
    if (page || size) {
      transactions = await Account.find({ status: "accepted", transactionType: filter })
        .populate("member", "name smebId")
        .limit(parseInt(size))
        .skip(parseInt(size) * parseInt(page));
    } else {
      transactions = await Account.find({ status: "accepted", transactionType: filter }).populate("member", "name smebId");
    }
    if (transactions) {
      res.status(200).json(transactions);
    } else {
      res.status(400).json({
        message: "No Transaction Found!",
      });
    }
  }
};
