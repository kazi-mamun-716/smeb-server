const mongoose = require('mongoose');


const eventParticipantSchema = new mongoose.Schema({
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    payment: Number,
    paymentInfo: String,
    status: {
        type: String,
        enum: ["pending", "approved"]
    },
    comment: String
})