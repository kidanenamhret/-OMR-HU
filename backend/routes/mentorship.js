const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// @route   GET api/mentorship
// @desc    Get all mentorship pairs
router.get('/', async (req, res) => {
  try {
    const pairs = await Member.find({ mentor: { $exists: true, $ne: null } })
      .populate('mentor', 'fullName baptismalName baptismalName')
      .select('fullName baptismalName mentor');
    res.json(pairs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/mentorship/eligible
// @desc    Get eligible mentors (Year 4+ or Graduated) and mentees (Year 1-2)
router.get('/eligible', async (req, res) => {
  try {
    const mentors = await Member.find({ 
      $or: [{ yearOfStudy: { $gte: 4 } }, { status: 'Graduated' }],
      status: { $ne: 'Left' }
    }).select('fullName baptismalName yearOfStudy status');

    const mentees = await Member.find({
      yearOfStudy: { $lte: 2 },
      status: 'Active',
      mentor: null
    }).select('fullName baptismalName yearOfStudy');

    res.json({ mentors, mentees });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
