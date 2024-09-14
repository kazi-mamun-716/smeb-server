const User = require("../model/userModel");

module.exports = {
  allMember: async (req, res) => {
    try {
      const { page, size, filter } = req.query;
      let users;
      let newFilter = {};
      if (filter && filter !== "all") {
        newFilter = { status: filter };
      }
      if (page || size) {
        users = await User.find(newFilter)
          .select({
            password: 0,
            __v: 0,
          })
          .limit(parseInt(size))
          .sort({smebId: 1})
          .skip(parseInt(size) * parseInt(page))
          .populate("forums", "-author -comments -__v")
          .populate("academicInfo", "-_id -__v -user")
          .populate("personalInfo", "-_id -__v -user");
      } else {
        users = await User.find(newFilter).select({
          password: 0,
          __v: 0,
        });
      }
      res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
  countUser: async (req, res) => {
    let newFilter = {};
    if (req.query.filter !== "all") {
      newFilter = { status: req.query.filter };
    }
    const count = await User.countDocuments(newFilter);
    res.status(200).json({ count });
  },
  memberById: async (req, res) => {
    try {
      const { id } = req.params;
      const member = await User.findOne({ _id: id })
        .select({
          password: 0,
          __v: 0,
        })
        .populate("academicInfo", "-_id -__v -user")
        .populate("personalInfo", "-_id -__v -user");
      if (!member) {
        res.status(400).json({
          message: "Member Not Found!",
        });
      } else {
        res.status(200).json({ member });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Side Error!",
      });
    }
  },
};
