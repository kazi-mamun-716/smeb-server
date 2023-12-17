const router = require('express').Router();
const forumController = require("../controller/forumController");
const verifyToken = require("../utils/verifyToken");

router.post("/create", verifyToken, forumController.createForum );
router.get("/all", forumController.GetForum);
router.route("/:id")
    .get(forumController.singleForum)
    .put(verifyToken, forumController.editForum)
    .delete(verifyToken, forumController.deleteForum)
router.post("/comment", verifyToken, forumController.forumComment);
router.get("/allComment/:id", forumController.getForumComment);
router.route("/comment/:id")
    .put(verifyToken, forumController.editForumComment)
    .delete(verifyToken, forumController.deleteForumComment)


module.exports = router;