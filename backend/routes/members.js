const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Audit = require('../models/Audit');

// @route   GET api/members
// @desc    Get all members with filters
router.get('/', async (req, res) => {
  try {
    const { search, department, status, yearOfStudy } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { universityId: { $regex: search, $options: 'i' } },
        { baptismalName: { $regex: search, $options: 'i' } },
        { homeParish: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) query.department = department;
    if (status) query.status = status;
    if (yearOfStudy) query.yearOfStudy = yearOfStudy;

    const members = await Member.find(query).sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/members
// @desc    Add new member
router.post('/', async (req, res) => {
  try {
    const newMember = new Member(req.body);
    const member = await newMember.save();
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/members/:id
// @desc    Update member
router.put('/:id', async (req, res) => {
  try {
    let member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ msg: 'Member not found' });

    member = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // Audit Log
    await Audit.create({
      action: 'UPDATE',
      collectionName: 'Members',
      recordId: member._id,
      performedBy: 'Admin',
      details: req.body
    });

    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/members/:id
// @desc    Delete member
router.delete('/:id', async (req, res) => {
  try {
    let member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ msg: 'Member not found' });

    await Member.findByIdAndDelete(req.params.id);

    // Audit Log
    await Audit.create({
      action: 'DELETE',
      collectionName: 'Members',
      recordId: req.params.id,
      performedBy: 'Admin',
      details: { name: member?.fullName }
    });

    res.json({ msg: 'Member removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
