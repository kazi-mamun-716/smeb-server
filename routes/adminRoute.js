const router = require("express").Router();
const {
  login,
  register,
  loggedInAdmin,
  approveUser,
  changeRole,
  allPaymentRequest,
  paymentsByMemberId,
  paymentAction,
  forgotAdminPassword,
  changePassword,
  resetAdminPassword,
  allTransactions,
  createExpenseRequest,
  expenseRequestByUser,
  findMember,
  changeMembership,
  fundDetails,
} = require("../controller/adminController");
const { allMember, memberById, countUser } = require("../controller/commonController");
const upload = require("../lib/multerData");
const verifyAdmin = require("../utils/verifyAdmin");
const verifyToken = require("../utils/verifyToken");

// router.post("/create", register);
router.post("/login", login);
router.put("/restePassword", verifyToken, verifyAdmin, changePassword);
router.get("/loggedIn", verifyToken, verifyAdmin, loggedInAdmin);
router.get("/allMember", verifyToken, verifyAdmin, allMember);
router.get("/member/:id", verifyToken, verifyAdmin, memberById);
router.get("/searchMember/:smebId", verifyToken, verifyAdmin, findMember);
router.put("/approveMember", verifyToken, verifyAdmin, approveUser);
router.put("/changeRole", verifyToken, verifyAdmin, changeRole);
router.put("/membership/:id", verifyToken, verifyAdmin, changeMembership);
router.get("/count", verifyToken, verifyAdmin, countUser);
router.put("/forgotPass", verifyToken, forgotAdminPassword);
router.put("/resetPass", resetAdminPassword);

//payment related route
router.get("/fund", verifyToken, verifyAdmin, fundDetails);
router.get("/allPaymentRequest", verifyToken, verifyAdmin, allPaymentRequest);
router.post("/createExpense", verifyToken, verifyAdmin, createExpenseRequest);
router.get("/expenseReqByUser", verifyToken, verifyAdmin, expenseRequestByUser);
router.get("/allTransaction", verifyToken, verifyAdmin, allTransactions);
router.get("/:id/payments", verifyToken, verifyAdmin, paymentsByMemberId);
router.put(
  "/paymentAction/:id",
  verifyToken,
  verifyAdmin,
  upload.single("doc"),
  paymentAction
);

module.exports = router;
