const Comment = require("../model/commentModel");
const Forum = require("../model/forumModel");
const User = require("../model/userModel");

module.exports = {
  createForum: async (req, res) => {
    const { id } = req.user;
    const forumData = { ...req.body, author: id };
    const forum = await Forum.create(forumData);
    await User.findByIdAndUpdate(id, {
      $push: {
        forums: forum._id,
      },
    });
    res.status(201).json({
      message: "Discussion Posted Successfully",
    });
  },
  GetForum: async (req, res) => {
    const forums = await Forum.find({})
      .populate("author", "name")
      .populate({
        path: "lastComment",
        select: "author content createdAt -_id",
        populate: { path: "author", model: "User", select: "name" },
      });
    res.status(200).json(forums);
  },
  singleForum: async (req, res) => {
    const { id } = req.params;
    const forum = await Forum.findOne({ _id: id })
      .populate("author", "name _id photo")
      .populate("comments");
    res.status(200).json(forum);
  },
  getForumByUser: async (req, res) => {},
  editForum: async (req, res) => {
    const { id } = req.params;
    await Forum.findByIdAndUpdate(
      id,
      {
        $set: { ...req.body },
      },
      { new: true }
    );
    res.status(200).json({
      message: "Update Successfully",
    });
  },
  deleteForum: async (req, res) => {
    const { id } = req.params;
    await Forum.findByIdAndDelete(id);
    res.status(200).json({
      message: "Forum Delete Successfull",
    });
  },
  forumComment: async (req, res) => {
    try {
      const { id } = req.user;
      const { fId } = req.params;
      const comment = await Comment.create({
        content: req.body.reply,
        author: id,
        forum: fId,
      });
      await Forum.findByIdAndUpdate(
        fId,
        {
          $push: { comments: comment._id },
          lastComment: comment._id,
        },
        { new: true, useFindAndModify: false }
      );
      res.status(200).json({
        message: "Comment Created Successfully",
        comment,
      });
    } catch (error) {
      console.log("comment error", error);
      res.status(500).json({
        message: "Internal Server Error!",
        error,
      });
    }
  },
  getForumComment: async (req, res) => {},
  editForumComment: async (req, res) => {},
  deleteForumComment: async (req, res) => {},
};
