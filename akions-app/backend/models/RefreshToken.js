const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, index: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.RefreshToken || mongoose.model('RefreshToken', RefreshTokenSchema);
