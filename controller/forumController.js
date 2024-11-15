const { default: mongoose } = require("mongoose");
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
  getForumCount: async (req, res) => {
    const { filter } = req.query;
    let query = {};
    if (filter && filter !== "all") {
      query = { status: filter };
    }
    const count = await Forum.countDocuments(query);
    res.status(200).json({ count });
  },
  GetForum: async (req, res) => {
    const { page, size, filter } = req.query;
    let forums;
    let query = {};
    if (page || size || filter) {
      if (filter !== "all") {
        query = { status: filter };
      }
      forums = await Forum.find(query)
        .populate("author", "name")
        .populate({
          path: "lastComment",
          select: "author content updatedAt -_id",
          populate: { path: "author", model: "User", select: "name" },
        })
        .limit(parseInt(size))
        .skip(parseInt(size) * parseInt(page))
        .sort({ createdAt: -1 });
    } else {
      forums = await Forum.find({})
        .populate("author", "name")
        .populate({
          path: "lastComment",
          select: "author content updatedAt -_id",
          populate: { path: "author", model: "User", select: "name" },
        })
        .sort({ createdAt: -1 });
    }
    res.status(200).json(forums);
  },
  singleForum: async (req, res) => {
    try {
      const { id } = req.params;
      const forum = await Forum.findOne({ _id: id })
        .populate("author", "name _id photo")
        .populate({
          path: "comments",
          populate: { path: "author", model: "User", select: "name photo" },
        });
      res.status(200).json(forum);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  getForumByUser: async (req, res) => {
    const { id } = req.user;
    const forums = await Forum.find({
      author: new mongoose.Types.ObjectId(id),
    }).sort({ createdAt: -1 });
    res.status(200).json(forums);
  },
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
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await Comment.deleteMany({ forum: id });
      await User.findByIdAndUpdate(userId, { $pull: { forums: id } });
      await Forum.findByIdAndDelete(id);
      res.status(200).json({
        message: "Discussion Delete Successfull",
      });
    } catch (error) {
      console.log("forum delete error", error);
      res.status(500).json({
        message: "Internal Server Error!",
        error,
      });
    }
  },
  getCommentCount: async (req, res) => {
    const count = await Comment.countDocuments({});
    res.status(200).json({ count });
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
