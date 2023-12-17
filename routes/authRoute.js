const router = require("express").Router();
const authController = require('../controller/authController');
const verifyToken = require("../utils/verifyToken");

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/addMember', authController.addUser);
router.get("/members", authController.getAllUser);
router.put("/approveMember", verifyToken, authController.approveUser)
router.route('/:id')
    .get()
    .put(authController.updateUser)
    .delete(authController.deleteUser)
    

module.exports = router;