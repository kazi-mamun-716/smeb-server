const mongoose = require('mongoose');


const eventParticipateSchema = new mongoose.Schema({
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    payment: Number,
    paymentInfo: String,
    name: String,
    email: String,
    mobile: String,
    course: String,
    intake: String,
    institute: String,
    isMarinner: Boolean,
    status: {
        type: String,
        enum: ["pending", "approved"],
        default: 'pending'
    },
    receipt: String,
    comment: String
});

const NonRegisterdEventParticipate = mongoose.model('NonRegisterdEventParticipate', eventParticipateSchema);
module.exports = NonRegisterdEventParticipate;