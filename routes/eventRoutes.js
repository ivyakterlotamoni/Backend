
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

    // Apply limit only when a valid limit is provided
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

export default router;
