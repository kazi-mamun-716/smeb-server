const { default: mongoose } = require("mongoose");
const Event = require("../model/eventModel");
const EventParticipate = require("../model/eventParticipantModel");
const NonRegisterdEventParticipate = require("../model/nonRegisterdParticipationModel");

//for smeb admins

const createEvent = async (req, res) => {
  const author = req.user;
  const doc = {
    ...req.body,
    author: author.userId,
  };
  const event = await Event.create(doc);
  res.status(200).json({
    message: "Event Created Successfully!",
    event,
  });
};

const editEvent = async (req, res) => {
  const id = req.params.id;
  const updateData = {...req.body}
  if (req.body.validity) {
    const validityDate = new Date(req.body.validity);
    if (validityDate > new Date()) {
      updateData.published = true; // Set published to true if validity is in the future
    }
  }
  await Event.findByIdAndUpdate(
    id,
    {
      $set: updateData,
    },
    { new: true }
  );
  res.status(200).json({ message: "Event update successfully!" });
};

const deleteEvent = async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const event = await Event.findById(id);
  if (event.author.toString() !== user.userId) {
    return res
      .status(400)
      .json({ message: "You are not authorized to delete this event." });
  }
  await Event.findByIdAndDelete(id);
  res.json({ message: "Event Delete Successfully!" });
};

const eventParticipateAction = async (req, res) => {
  const { event } = req.params;
  const { amount, id, registerdData, ...rest } = req.body;
  if (registerdData === "registerd") {
    await EventParticipate.findByIdAndUpdate(
      id,
      {
        $set: {
          ...rest,
        },
      },
      { new: true }
    );
  } else {
    await NonRegisterdEventParticipate.findByIdAndUpdate(
      id,
      {
        $set: {
          ...rest,
        },
      },
      { new: true }
    );
  }
  await Event.findByIdAndUpdate(
    event,
    {
      $push: {
        participants: id,
      },
      $inc: {
        totalCollection: amount,
      },
    },
    { new: true }
  );
  res.status(200).json({ messge: "Updated Successfully" });
};

//common

const countEvent = async (req, res) => {
  const { filter } = req.query;
  let query = {};
  if (filter) {
    query = { published: filter };
  }
  const count = await Event.countDocuments(query);
  res.status(200).json({ count });
};

const getAllEvents = async (req, res) => {
  const { page, size, filter } = req.query;
  let query = {};
  if (filter) {
    query = { published: filter };
  }
  let events;
  if (page || size || filter) {
    events = await Event.find(query)
      .populate("author", "name")
      .limit(parseInt(size))
      .skip(parseInt(size) * parseInt(page))
      .sort({ createdAt: -1 });
  } else {
    events = await Event.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 });
  }
  res.status(200).json(events);
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate("author", "name role")
      .populate("participants");
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

//for user
const participateCount = async (req, res) => {
  const { id } = req.params;
  const query = { event: new mongoose.Types.ObjectId(id) };
  if (req.query.filter !== "all") {
    query.status = req.query.filter;
  }
  const count = await EventParticipate.countDocuments(query);
  res.status(200).json(count);
};
const participate = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  try {
    const exists = await EventParticipate.findOne({
      event: new mongoose.Types.ObjectId(id),
      user: new mongoose.Types.ObjectId(user.id),
    });
    if (!exists) {
      await EventParticipate.create({
        ...req.body,
        event: id,
        user: user.id,
      });
      return res.status(201).json({ message: "Congratulation" });
    } else {
      return res
        .status(400)
        .json({ message: "Already participate on this event!" });
    }
  } catch (err) {
    console.log("participate error!", err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

const checkParticipation = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const event = await EventParticipate.findOne({
    event: new mongoose.Types.ObjectId(id),
    user: new mongoose.Types.ObjectId(user.id),
  }).select("status");
  res.status(200).json(event);
};

const getParticipatesByEventId = async (req, res) => {
  const { id } = req.params;
  const { page, size, filter } = req.query;
  let query = { event: new mongoose.Types.ObjectId(id) };
  if (req.query.filter !== "all") {
    query.status = req.query.filter;
  }
  let event;
  if (page || size || filter) {
    event = await EventParticipate.find(query)
      .limit(parseInt(size))
      .skip(parseInt(size) * parseInt(page))
      .sort({ createdAt: -1 })
      .populate("user", "name");
  } else {
    event = await EventParticipate.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name");
  }
  res.status(200).json(event);
};

const nonRegisterdParticipate = async (req, res) => {
  const { eventId } = req.params;
  try {
    const exists = await NonRegisterdEventParticipate.findOne({
      event: new mongoose.Types.ObjectId(eventId),
      email: req.body.email,
    });
    if (!exists) {
      await NonRegisterdEventParticipate.create({
        event: eventId,
        ...req.body,
      });
      res.status(201).json({ message: "congratulation" });
    } else {
      res.status(400).json({ message: "Alreday Participated on This Event!" });
    }
  } catch (err) {
    console.log(err);
    res.staus(500).json({ message: "Internal Server Error!" });
  }
};

const getNonregisterdParticipatesByEventId = async (req, res) => {
  const { eventId } = req.params;
  const { page, size, filter } = req.query;
  let query = { event: new mongoose.Types.ObjectId(eventId) };
  if (req.query.filter !== "all") {
    query.status = req.query.filter;
  }
  let event;
  if (page || size || filter) {
    event = await NonRegisterdEventParticipate.find(query)
      .limit(parseInt(size))
      .skip(parseInt(size) * parseInt(page))
      .sort({ createdAt: -1 });
  } else {
    event = await NonRegisterdEventParticipate.find(query).sort({
      createdAt: -1,
    });
  }
  res.status(200).json(event);
};

const nonRegisterParticipateCount = async (req, res) => {
  const { id } = req.params;
  const query = { event: new mongoose.Types.ObjectId(id) };
  if (req.query.filter !== "all") {
    query.status = req.query.filter;
  }
  const count = await NonRegisterdEventParticipate.countDocuments(query);
  res.status(200).json(count);
};

const nonRegisterdParticipateChecking = async (req, res) => {
  try {
    const data = await NonRegisterdEventParticipate.findOne({email:req.params.email})
    res.status(200).json(data)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal sever error!" });
  }
};

//auto off publicity of event
const updatePublishedStatus = async () => {
  try {
    const now = new Date();

    // Find all events where validity date has passed but still published
    const eventsToUpdate = await Event.find({
      validity: { $lt: now },
      published: true,
    });

    // Update each event
    for (let event of eventsToUpdate) {
      event.published = false;
      await event.save();
    }

    console.log('Published status updated for expired events.');
  } catch (error) {
    console.error('Error updating published status:', error);
  }
};



module.exports = {
  createEvent,
  editEvent,
  deleteEvent,
  getAllEvents,
  countEvent,
  getEventById,
  participate,
  checkParticipation,
  getParticipatesByEventId,
  participateCount,
  eventParticipateAction,
  nonRegisterdParticipate,
  getNonregisterdParticipatesByEventId,
  nonRegisterParticipateCount,
  nonRegisterdParticipateChecking,
  updatePublishedStatus, //update event publishing status
};
