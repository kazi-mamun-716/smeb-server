const { allAcademi, createAcademi, deleteAcademi, getCec } = require('../controller/basicController');
const verifyToken = require("../utils/verifyToken");
const verifyAdmin = require("../utils/verifyAdmin");

const router = require('express').Router();

router.route('/academi')
    .get(allAcademi)
    .post(createAcademi)
router.route("/:id").delete(verifyToken, verifyAdmin, deleteAcademi)
router.get("/cec", getCec);

module.exports = router;