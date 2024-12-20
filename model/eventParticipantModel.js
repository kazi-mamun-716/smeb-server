const mongoose = require('mongoose');


const eventParticipateSchema = new mongoose.Schema({
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
        enum: ["pending", "approved"],
        default: 'pending'
    },
    receipt: String,
    comment: String
});

const EventParticipate = mongoose.model('EventParticipate', eventParticipateSchema);
module.exports = EventParticipate;