const express = require('express');
const router = express.Router();
const PrayerRequest = require('../models/PrayerRequest');

// @route   GET api/prayers
// @desc    Get all prayer requests
router.get('/', async (req, res) => {
  try {
    const prayers = await PrayerRequest.find()
      .populate('memberId', 'fullName baptismalName')
      .sort({ createdAt: -1 });
    res.json(prayers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/prayers
// @desc    Add a prayer request
router.post('/', async (req, res) => {
  try {
    const newPrayer = new PrayerRequest(req.body);
    const prayer = await newPrayer.save();
    res.json(prayer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/prayers/:id/reply
// @desc    Add a word of support/reply to a prayer
router.post('/:id/reply', async (req, res) => {
  try {
    const prayer = await PrayerRequest.findById(req.params.id);
    if (!prayer) return res.status(404).json({ msg: 'Prayer request not found' });

    prayer.replies.push({ content: req.body.content });
    await prayer.save();
    res.json(prayer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
