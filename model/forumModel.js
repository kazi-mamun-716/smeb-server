const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema({
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
        ref: "User"
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    lastComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    status:{
        type: String,
        enum: ['pending', 'published'],
        default: "pending",
    }
},{timestamps: true});

const Forum = mongoose.model("Forum", forumSchema);
module.exports = Forum;