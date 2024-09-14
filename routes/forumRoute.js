const router = require('express').Router();
const forumController = require("../controller/forumController");
const verifyToken = require("../utils/verifyToken");

router.post("/create", verifyToken, forumController.createForum );
router.get("/all", forumController.GetForum);
router.get("/getForumByUser", verifyToken, forumController.getForumByUser);
router.route("/:id")
    .get(forumController.singleForum)
    .put(verifyToken, forumController.editForum)
    .delete(verifyToken, forumController.deleteForum)
//for comment of single forum
router.route("/:fId/comment")
    .get(forumController.getForumComment)
    .post(verifyToken, forumController.forumComment)
//for target comment using id
router.route('/comment/:id')    
    .put(verifyToken, forumController.editForumComment)
    .delete(verifyToken, forumController.deleteForumComment)


module.exports = router;