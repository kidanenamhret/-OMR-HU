const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  action: { type: String, required: true },
  collectionName: { type: String, required: true },
  recordId: { type: mongoose.Schema.Types.ObjectId },
  performedBy: { type: String, required: true },
  details: { type: Object }
}, {
  timestamps: true
});

module.exports = mongoose.model('Audit', auditSchema);
