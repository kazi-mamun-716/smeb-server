const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: Number,
    ref: String,
    month: String,
    accountNo: String,
    transactionType: {
      type: String,
      enum: ["revenue", "expense"],
    },
    status: {
      type: String,
      default: "pending",
    },
    payslip: String,
    presentAmount: {
      type: Number,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
