const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

module.exports = (req, res, next) => {
  const authToken = req.headers.authorization.split(" ")[1];
  jwt.verify(authToken, process.env.SECRET, async (err, decoded) => {
    if (err) {
      res.status(403).json({
        message: "Forbidden Access",
      });
    } else {
      const { id } = decoded;
      const user = await User.findById(id);
      next();
    }
  });
};
