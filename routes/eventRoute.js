const router = require("express").Router();
const event = require("../controller/eventController");
const verifyAdmin = require("../utils/verifyAdmin");
const verifyToken = require("../utils/verifyToken");

//for admins
router.route('/').get(event.getAllEvents).post(verifyToken, verifyAdmin, event.createEvent);
router.route('/:id')
    .get(event.getEventById)
    .put(verifyToken, verifyAdmin, event.editEvent)
    .delete(verifyToken, verifyAdmin, event.deleteEvent)

//for user

//common
router.get("/:id/participants", event.eventParticipants);


module.exports = router;