const router = require("express").Router();
const { allMember, countUser } = require("../controller/commonController");
const {
  loggedInUser,
  emailVerificationCode,
  uploadDocument,
  forgotPassword,
  resetPassword,
  verifyVCode,
  makePaymentRequest,
  myPayments,
  deletePayment,
  changePassword,
  userById,
} = require("../controller/userController");
const upload = require("../lib/multerData");
const verifyToken = require("../utils/verifyToken");

router.get("/loggedInUser", verifyToken, loggedInUser);
router.get("/singleUser/:id", userById);
router.get("/members", verifyToken, allMember);
router.get("/count", countUser);
router.put(
  "/uploadDoc",
  verifyToken,
  upload.fields([
    { name: "ageConfirmation", maxCount: 1 },
    { name: "courseConfirmation", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  uploadDocument
);
router.post("/emailVerification", verifyToken, emailVerificationCode);
router.post("/verifyVCode", verifyToken, verifyVCode);
router.post("/forgotPass", forgotPassword);
router.put("/changePassword", verifyToken, changePassword)
router.put("/resetPass", resetPassword);
//payment actions
router.post("/makePaymentRequest", verifyToken, makePaymentRequest);
router.get("/myPayments", verifyToken, myPayments);
router.delete("/payment/:paymentId", verifyToken, deletePayment);

module.exports = router;
