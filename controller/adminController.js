const Admin = require("../model/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const memberApproval = require("../utils/memberApproval");
const adminNotificationMail = require("../utils/adminNotificationMail");
const mongoose = require("mongoose");
const Account = require("../model/accountModel");
const Fund = require("../model/fundModel");
const Cec = require("../model/cecModel");

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
      { id: user._id, name: user.name, email, userId: user?.userId },
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
      backupPass: 0,
      __v: 0,
    });
    res.status(200).json(admin);
  },
  findMember: async (req, res) => {
    const { smebId } = req.params;
    const member = await User.find({ smebId })
      .select({
        password: 0,
        __v: 0,
      })
      .populate("academicInfo", "-_id -__v -user");
    if (!member) {
      res.status(400).json({
        message: "Member Not Found!",
      });
    } else {
      res.status(200).json({ member });
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
      const lastSmebId = lastUser.smebId ? lastUser.smebId : 1060;
      const smebId = lastSmebId + 1;
      await User.findByIdAndUpdate(
        id,
        { smebId, membership: "member" },
        { new: true, upsert: true }
      );
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
  changeMembership: async (req, res) => {
    try {
      const { id } = req.params;
      let newMembership;
      const { membership } = req.body;
      if (membership === "member") {
        newMembership = "life time member";
      } else {
        newMembership = "member";
      }
      await User.findByIdAndUpdate(id, {
        $set: { membership: newMembership },
      });
      res.status(200).json({ message: "Updated Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
  //cec area
  searchMemberForCec: async (req, res) => {
    const { data, membersId } = req.body;
    try {
      let query;

      if (isNaN(data)) {
        // If `data` is not a valid number, search by name only
        query = {
          _id: { $nin: membersId },
          status: "active",
          name: { $regex: data, $options: "i" },
        };
      } else {
        // If `data` is a valid number, search by smebId or name
        query = {
          _id: { $nin: membersId },
          status: "active",
          $or: [
            { smebId: Number(data) }, // Exact match for smebId
            { name: { $regex: data, $options: "i" } }, // Partial match for name
          ],
        };
      }
      const users = await User.find(query);

      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  addCecMember: async (req, res) => {
    try {
      await Cec.create(req.body);
      res.status(201).json({ message: "cec pannel successfully posted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  getCecMemberById: async (req, res) => {
    try {
      const { id } = req.query;
      const cecPanel = await Cec.findById(id).populate('users.user_id', 'name photo')
      res.status(200).json(cecPanel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  updateCecMember: async (req, res) => {
    try {
      const { id } = req.query;
      const data = await Cec.findByIdAndUpdate(id, req.body, {new: true})
      console.log(id, data)
      res.status(200).json({message: 'Updated Successfully!'})
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  //payment request controlling
  fundDetails: async (req, res) => {
    const fund = await Fund.find({});
    res.status(200).json(fund);
  },
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
        "https://" + host + "/" + req.file.path.replace(/\\/g, "/");
      const pending = await Account.findById(id);
      let presentAmountUpdate;
      if (pending?.transactionType === "revenue") {
        await Fund.findOneAndUpdate(
          {},
          {
            $inc: {
              totalFunds: pending.amount,
              totalRevenue: pending.amount,
            },
          },
          { new: true }
        );
        presentAmountUpdate = { $inc: { presentAmount: pending.amount } };
      } else {
        await Fund.findOneAndUpdate(
          {},
          {
            $inc: {
              totalFunds: -pending.amount,
              totalExpenses: pending.amount,
            },
          },
          { new: true }
        );
        presentAmountUpdate = { $inc: { presentAmount: -pending.amount } };
      }

      await Account.findByIdAndUpdate(
        id,
        {
          status: "accepted",
          payslip: filePath,
          presentAmount: presentAmountUpdate,
        },
        { new: true }
      );
      if (pending?.transactionType === "revenue") {
        const [month, year] = pending.month.split("-");
        const lastPaymentDate = new Date(`${year}-${month}-01`);
        await User.findByIdAndUpdate(pending.member, {
          $set: {
            lastPayment: new mongoose.Types.ObjectId(pending._id),
            lastPaymentDate,
          },
        });
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
  allTransactions: async (req, res) => {
    let transactions;
    const { page, size, filter } = req.query;

    if (page || size) {
      transactions = await Account.find({
        status: "accepted",
        transactionType: filter,
      })
        .populate("member", "name smebId")
        .limit(parseInt(size))
        .skip(parseInt(size) * parseInt(page));
    } else {
      transactions = await Account.find({
        status: "accepted",
        transactionType: filter,
      }).populate("member", "name smebId");
    }
    if (transactions) {
      res.status(200).json(transactions);
    } else {
      res.status(400).json({
        message: "No Transaction Found!",
      });
    }
  },
  createExpenseRequest: async (req, res) => {
    try {
      const { id } = req.user;
      const data = { member: id, ...req.body, transactionType: "expense" };
      const expense = await Account.create(data);
      res.status(201).json({
        message: "Expense Request Created Successfully!",
        expense,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
  expenseRequestByUser: async (req, res) => {
    try {
      const { id } = req.user;
      const expenses = await Account.find({
        member: new mongoose.Types.ObjectId(id),
        transactionType: "expense",
      });
      res.status(200).json({ expenses });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
};
