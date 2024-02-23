const jwt = require("jsonwebtoken");
const sendVerifyCode = require("../utils/sendVerifyCode");

module.exports = (mail) => {
  const randomNumber = Math.floor(Math.random()*(10000-1000));
  const code = jwt.sign(randomNumber, process.env.SECRET);
  sendVerifyCode(mail, randomNumber)
  return code;
};
