
import express from "express";
import { ObjectId } from "mongodb";
import eventsCollection from "../models/Event.js";

const router = express.Router();

// GET: All upcoming events
router.get("/", async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10);

    let query = eventsCollection()
      .find({ date: { $gte: new Date().toISOString() } })
      .sort({ date: 1 });

    if (Number.isInteger(limit) && limit > 0) {
      query = query.limit(limit);
    }

    const events = await query.toArray();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch events",
      error: error.message,
    });
  }
});

// GET: Joined events by user email
// Keep this route before GET /:id
router.get("/joined/:email", async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({
        message: "User email is required",
      });
    }

    const events = await eventsCollection()
      .find({ "joinedUsers.email": email })
      .sort({ date: 1 })
      .toArray();

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch joined events",
      error: error.message,
    });
  }
});

// GET: Single event by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await eventsCollection().findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch event",
      error: error.message,
    });
  }
});

// POST: Create new event
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      thumbnail,
      location,
      date,
      creatorEmail,
    } = req.body;

    if (
      !title ||
      !description ||
      !eventType ||
      !thumbnail ||
      !location ||
      !date ||
      !creatorEmail
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        message: "Invalid event date",
      });
    }

    if (eventDate <= new Date()) {
      return res.status(400).json({
        message: "Event date must be in the future",
      });
    }

    const newEvent = {
      title,
      description,
      eventType,
      thumbnail,
      location,
      date: eventDate.toISOString(),
      creatorEmail,
      joinedUsers: [],
      createdAt: new Date().toISOString(),
    };

    const result = await eventsCollection().insertOne(newEvent);

    res.status(201).json({
      message: "Event created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create event",
      error: error.message,
    });
  }
});

// PUT: Update an event
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      eventType,
      thumbnail,
      location,
      date,
      creatorEmail,
    } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    if (!creatorEmail) {
      return res.status(400).json({ message: "Creator email is required" });
    }

    const collection = eventsCollection();

    const event = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.creatorEmail !== creatorEmail) {
      return res.status(403).json({
        message: "You can only update your own event",
      });
    }

    const eventDate = new Date(date);

    if (
      !title ||
      !description ||
      !eventType ||
      !thumbnail ||
      !location ||
      !date ||
      isNaN(eventDate.getTime())
    ) {
      return res.status(400).json({
        message: "Please provide valid event information",
      });
    }

    if (eventDate <= new Date()) {
      return res.status(400).json({
        message: "Event date must be in the future",
      });
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          eventType,
          thumbnail,
          location,
          date: eventDate.toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    );

    res.status(200).json({
      message: "Event updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update event",
      error: error.message,
    });
  }
});

// DELETE: Delete an event
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { creatorEmail } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    if (!creatorEmail) {
      return res.status(400).json({
        message: "Creator email is required",
      });
    }

    const collection = eventsCollection();

    const event = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.creatorEmail !== creatorEmail) {
      return res.status(403).json({
        message: "You can only delete your own event",
      });
    }

    await collection.deleteOne({
      _id: new ObjectId(id),
    });

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete event",
      error: error.message,
    });
  }
});

// POST: Join an event
router.post("/:id/join", async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail, userName } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    if (!userEmail) {
      return res.status(400).json({
        message: "User email is required",
      });
    }

    const collection = eventsCollection();

    const event = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (new Date(event.date) <= new Date()) {
      return res.status(400).json({
        message: "You cannot join a past event",
      });
    }

    const result = await collection.updateOne(
      {
        _id: new ObjectId(id),
        date: { $gt: new Date().toISOString() },
        "joinedUsers.email": { $ne: userEmail },
      },
      {
        $push: {
          joinedUsers: {
            email: userEmail,
            name: userName || "",
            joinedAt: new Date().toISOString(),
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(409).json({
        message: "You have already joined this event",
      });
    }

    res.status(200).json({
      message: "Successfully joined the event",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to join event",
      error: error.message,
    });
  }
});

export default router;
