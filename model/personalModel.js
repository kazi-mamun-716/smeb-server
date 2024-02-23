const mongoose = require("mongoose");

const personalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    father: {
      type: String,
    },
    mother: {
      type: String,
    },
    birthDate: {
      type: String,
    },
    presentAddress: {
      type: String,
    },
    permanentAddress: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    nationality: {
      type: String,
    },
    emergencyPerson: {
      type: String,
    },
    relation: {
      type: String,
    },
    emergencyNo: {
      type: String,
    },
  },
  {
    timestamps: false,
  }
);

const Personal = mongoose.model("Personal", personalSchema);

module.exports = Personal;
