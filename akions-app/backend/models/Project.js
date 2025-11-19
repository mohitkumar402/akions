const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    features: [String],
    technologies: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

