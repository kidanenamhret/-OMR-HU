const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// @route   GET api/stats
// @desc    Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    const totalActive = await Member.countDocuments({ status: 'Active' });
    const totalGraduated = await Member.countDocuments({ status: 'Graduated' });
    
    // New members this academic year (assuming academic year starts in September)
    const currentYear = new Date().getFullYear();
    const academicYearStart = new Date(currentYear, 8, 1); // Sept 1st
    const newMembers = await Member.countDocuments({ 
      joinedDate: { $gte: academicYearStart } 
    });

    const freshers = await Member.countDocuments({ 
      yearOfStudy: 1, 
      status: 'Active' 
    });

    // Department distribution for charts
    const deptDistribution = await Member.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalActive,
      totalGraduated,
      newMembers,
      freshers,
      deptDistribution: deptDistribution.map(d => ({ name: d._id, value: d.count }))
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
