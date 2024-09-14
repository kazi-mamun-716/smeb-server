const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    forum: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Forum"
    }
}, {timestamps: true});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;