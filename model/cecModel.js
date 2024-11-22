const mongoose = require("mongoose");

const cecSchema = new mongoose.Schema(
  {
    batch: {
      type: Number,
      required: true,
    },
    members: [{
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }],
    starting: {
      type: String,
      required: true,
    },
    expired: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cec = mongoose.model("Cec", cecSchema);

module.exports = Cec;
