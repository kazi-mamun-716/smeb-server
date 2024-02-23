const Admin = require("../model/adminModel");

module.exports = async (req, res, next) => {
  try {
    const { email } = req.user;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(403).json({
        message: "Admin Access Only",
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({
      message: "Forbidden Access",
    });
  }
};
