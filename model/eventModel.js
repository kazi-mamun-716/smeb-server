const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    participants:[{
       type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    nonRegisterd: {
        type: Boolean,
        default: false,
        required: true
    },
    isPaymentAccept: {
        type: Boolean,
        required: true
    },
    amount: Number,
    reference: String,
    totalCollection: Number,
    validity: {
        type: Date,
    },
    published: {
        type: Boolean,
        default: true
    }
},{timestamps: true});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;