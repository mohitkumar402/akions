const mongoose = require('mongoose');

const InternshipApplicationSchema = new mongoose.Schema(
  {
    internshipId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ip: { type: String },
    appliedAt: { type: Date, default: Date.now },
    // Application form fields
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    resume: { type: String }, // URL or base64
    coverLetter: { type: String },
    experience: { type: String },
    skills: [String],
    education: { type: String },
    availability: { type: String },
    additionalInfo: { type: String },
    status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.InternshipApplication || mongoose.model('InternshipApplication', InternshipApplicationSchema);
