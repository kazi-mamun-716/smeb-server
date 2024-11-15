const router = require("express").Router();
const event = require("../controller/eventController");
const verifyAdmin = require("../utils/verifyAdmin");
const verifyToken = require("../utils/verifyToken");

//for admins
router
  .route("/")
  .get(event.getAllEvents)
  .post(verifyToken, verifyAdmin, event.createEvent);
router.get("/count", event.countEvent);
router.get(
  "/:id/nonRegisterParticipateCount",
  event.nonRegisterParticipateCount
);
router
  .route("/nonRegisterdParticipate/:eventId")
  .get(event.getNonregisterdParticipatesByEventId)
  .post(event.nonRegisterdParticipate);

router
  .route("/:id")
  .post(verifyToken, event.participate)
  .get(event.getEventById)
  .put(verifyToken, verifyAdmin, event.editEvent)
  .delete(verifyToken, verifyAdmin, event.deleteEvent);
router.get(
  "/:id/participates",
  verifyToken,
  verifyAdmin,
  event.getParticipatesByEventId
);
router.put(
  "/participate/:event",
  verifyToken,
  verifyAdmin,
  event.eventParticipateAction
);
//for user
router.get("/checkParticipation/:id", verifyToken, event.checkParticipation);
router.get("/countParticipate/:id", event.participateCount);
router.post("/checkNonRegisterParticipate/:email", event.nonRegisterdParticipateChecking)

module.exports = router;
