const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, default: 'pdf' }, // pdf, doc, video, etc.
    size: { type: Number }, // File size in bytes
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Document || mongoose.model('Document', DocumentSchema);





