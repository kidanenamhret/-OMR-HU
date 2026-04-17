const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Member = require('../models/Member');
const Audit = require('../models/Audit');

const upload = multer({ storage: multer.memoryStorage() });

// @route   POST api/import
// @desc    Bulk import members from Excel
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const importResults = {
      success: 0,
      errors: 0,
      details: []
    };

    for (const row of data) {
      try {
        // Map excel columns to model fields
        const memberData = {
          fullName: row.fullName || row['Full Name'],
          universityId: row.universityId || row['University ID'],
          department: row.department || row['Department'],
          yearOfStudy: row.yearOfStudy || row['Year'] || 1,
          phone: String(row.phone || row['Phone'] || ''),
          baptismalName: row.baptismalName || row['Baptismal Name'],
          homeParish: row.homeParish || row['Parish'],
          status: row.status || 'Active'
        };

        const newMember = new Member(memberData);
        await newMember.save();
        importResults.success++;
      } catch (err) {
        importResults.errors++;
        importResults.details.push({ id: row.universityId, error: err.message });
      }
    }

    // Audit Log
    await Audit.create({
      action: 'BULK_IMPORT',
      collectionName: 'Members',
      performedBy: 'Admin',
      details: { total: data.length, success: importResults.success, errors: importResults.errors }
    });

    res.json(importResults);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error during import');
  }
});

module.exports = router;
