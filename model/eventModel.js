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
    totalCollection: Number,
    validity: {
        type: Date,
        required: true
    },
    publish: Boolean
},{timestamps: true});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;