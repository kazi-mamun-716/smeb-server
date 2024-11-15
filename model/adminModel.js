const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    userId:{
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: false,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
