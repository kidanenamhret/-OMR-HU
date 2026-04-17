const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// @route   GET api/events
// @desc    Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/events
// @desc    Create an event
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/events/:id/attend
// @desc    Toggle member attendance for an event
router.put('/:id/attend', async (req, res) => {
  try {
    const { memberId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    const index = event.attendees.indexOf(memberId);
    if (index === -1) {
      event.attendees.push(memberId);
    } else {
      event.attendees.splice(index, 1);
    }

    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
