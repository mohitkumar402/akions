const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], required: true },
    duration: { type: String, required: true },
    stipend: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    skills: [{ type: String }],
    requirements: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Internship || mongoose.model('Internship', InternshipSchema);

