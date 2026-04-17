const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true, default: Date.now },
  type: {
    type: String,
    enum: ['Liturgy', 'Bible study', 'Fellowship', 'Charity', 'Meeting'],
    default: 'Liturgy'
  },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
