const mongoose = require('mongoose');

const prayerRequestSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Health', 'Academic', 'Spiritual', 'Family', 'Other'],
    default: 'Spiritual'
  },
  isAnonymous: { type: Boolean, default: false },
  replies: [{
    content: String,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('PrayerRequest', prayerRequestSchema);
