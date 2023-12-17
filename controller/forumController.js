const Forum = require("../model/forumModel");
const User = require("../model/userModel");

module.exports = {
  createForum: async (req, res) => {
    const { id } = req.user;
    const forumData = { ...req.body, author: id };
    const forum = await Forum.create(forumData);
    await User.findByIdAndUpdate(id,{
      $push: {
        forums: forum._id
      }
    })
    res.status(201).json({
      message: "Forum Create Successfully"
    });
  },
  GetForum: async (req, res) => {
    const forums = await Forum.find({}).populate("author", "name -_id");
    console.log(forums);
    res.status(200).json(forums);
  },
  singleForum: async (req, res) => {
    const { id } = req.params;
    const forum = await Forum.find({ _id: id });
    res.status(200).json(forum);
  },
  editForum: async (req, res) => {
    const { id } = req.params;
    await Forum.findByIdAndUpdate(id, {
        $set:{...req.body}
    },{new: true})
    res.status(200).json({
        message: "Update Successfully"
    })
  },
  deleteForum: async (req, res) => {
    const { id } = req.params;
    await Forum.findByIdAndDelete(id);
    res.status(200).json({
        message: "Forum Delete Successfull"
    })
  },
  forumComment: async (req, res) => {

  },
  getForumComment: async (req, res) => {},
  editForumComment: async (req, res) => {},
  deleteForumComment: async (req, res) => {},
};
