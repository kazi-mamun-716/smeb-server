const router = require("express").Router();
const { loggedInUser, emailVerification, verifyEmail, countUser } = require("../controller/userController");
const verifyToken = require("../utils/verifyToken");


router.get("/loggedInUser", verifyToken, loggedInUser);
router.get("/countMember", verifyToken, countUser);
router.post("/emailVerification", verifyToken, emailVerification);
router.get("/verifyEmail/:id", verifyEmail);

module.exports = router;
