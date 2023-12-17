const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    description: {
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
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;