const express = require('express');
const router = express.Router();

// Major Ethiopian Orthodox Feast Dates (2026-2027 Sample)
// In a production app, these would be calculated or fetched from a liturgical API
const feasts = [
  { name: "Meskel (Finding of the True Cross)", date: "2026-09-27", type: "Fixed" },
  { name: "Lidet (Christmas)", date: "2027-01-07", type: "Fixed" },
  { name: "Timket (Epiphany)", date: "2027-01-19", type: "Fixed" },
  { name: "Hosanna (Palm Sunday)", date: "2027-04-25", type: "Moveable" },
  { name: "Siklet (Good Friday)", date: "2027-04-30", type: "Moveable" },
  { name: "Tensae (Easter)", date: "2027-05-02", type: "Moveable" },
  { name: "Paracletos (Pentecost)", date: "2027-06-20", type: "Moveable" }
];

router.get('/', (req, res) => {
  const today = new Date();
  const upcoming = feasts
    .filter(f => new Date(f.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  res.json(upcoming);
});

module.exports = router;
