const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    amount: Number,
    date: new Date(),
    verified: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

