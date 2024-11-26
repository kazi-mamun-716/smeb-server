const mongoose = require("mongoose");

const cecSchema = new mongoose.Schema(
  {
    batch: {
      type: Number,
      required: true,
      unique: true,
    },
    users: [
      {
        user_id: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        cecRole: {
          type: String,
          required: true,
        },
      },
    ],
    startMonth: {
      type: Date,
      required: true,
    },
    endMonth: Date,
    isRunning: Boolean,
  },
  {
    timestamps: true,
  }
);

const Cec = mongoose.model("Cec", cecSchema);

module.exports = Cec;
