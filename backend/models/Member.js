const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const encrypt = (text) => {
  if (!text) return text;
  return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
};

const decrypt = (text) => {
  if (!text) return text;
  try {
    const bytes = CryptoJS.AES.decrypt(text, process.env.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    return text; // Return as is if decryption fails (for existing data)
  }
};

const memberSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  universityId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  yearOfStudy: { type: Number, required: true },
  phone: { 
    type: String, 
    required: true,
    set: encrypt,
    get: decrypt
  },
  baptismalName: { type: String, required: true },
  homeParish: { type: String },
  denomination: {
    type: String,
    enum: ['Orthodox', 'Other', 'Not specified'],
    default: 'Orthodox'
  },
  status: {
    type: String,
    enum: ['Active', 'Graduated', 'Transferred', 'Left'],
    default: 'Active'
  },
  role: {
    type: String,
    enum: ['Member', 'Leader', 'Prayer Coordinator', 'Committee'],
    default: 'Member'
  },
  joinedDate: { type: Date, default: Date.now },
  graduationYear: { type: Number },
  fastingCommitment: {
    type: String,
    enum: ['Observes all fasts', 'Partial', 'Not yet'],
    default: 'Not yet'
  },
  interests: [{ type: String }],
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  notes: { type: String }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

module.exports = mongoose.model('Member', memberSchema);
