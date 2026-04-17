require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/prayers', require('./routes/prayers'));
app.use('/api/events', require('./routes/events'));
app.use('/api/mentorship', require('./routes/mentorship'));
app.use('/api/feasts', require('./routes/feasts'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/import', require('./routes/import'));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
