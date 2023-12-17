const User = require("../model/userModel");
const emailVerification = require("../utils/emailVarification");

module.exports = {
  loggedInUser: async (req, res) => {
    const { email } = req.user;
    const user = await User.findOne({ email })
    .select({
      agreeWithCondition: 0,
      password:0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    })
    .populate("forums","-author -comments -__v");
    res.status(200).json(user);
  },
  emailVerification: async (req, res) => {
    const { url } = req.body;
    const { email } = req.user;
    emailVerification(email, url);
    res.status(200).json({
      message: "email send successfully",
    });
  },
  verifyEmail: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await User.findByIdAndUpdate(id, {
        $set: {
          emailVerified: true
        }
      });
      res.status(200).json(result)
    } catch (err) {
      console.log(err);
      res.status(400).json({message: "User Not Found"})
    } 
  },
  countUser: async(req, res)=>{
    const count = await User.countDocuments();
    res.status(200).json({count})
  }
};
