const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');
const RefreshToken = require('./models/RefreshToken');
const InternshipApplication = require('./models/InternshipApplication');

// Derive role from email domain (simple heuristic)
const deriveRole = (email) => (email && email.endsWith('@ekions.com') ? 'admin' : 'user');

const toPlain = (doc) => (doc && doc.toObject ? doc.toObject() : doc);

const sanitizeUser = (user) => {
  if (!user) return null;
  const obj = toPlain(user);
  if (!obj) return null;
  const { password, __v, ...rest } = obj;
  // Normalize id field
  return { id: obj._id ? String(obj._id) : obj.id, ...rest };
};

const createUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email }).lean();
  if (existing) throw new Error('User already exists');
  const hashed = await bcrypt.hash(password, 10);
  const resolvedRole = role || deriveRole(email);
  const user = await User.create({ name, email, password: hashed, role: resolvedRole });
  return sanitizeUser(user);
};

const findByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return null;
  // Return full doc (with password) for internal checks
  const obj = toPlain(user);
  obj.id = String(obj._id);
  return obj;
};

const verifyPassword = async (plain, hashed) => bcrypt.compare(plain, hashed);

const addRefreshToken = async (userId, token) => {
  try {
    // Use findOneAndUpdate with upsert to avoid duplicate key errors
    await RefreshToken.findOneAndUpdate(
      { token },
      { userId: new mongoose.Types.ObjectId(userId), token },
      { upsert: true, new: true }
    );
  } catch (error) {
    // If it's a duplicate key error, that's okay - token already exists
    if (error.code === 11000) {
      console.warn('Refresh token already exists, skipping insert');
    } else {
      throw error;
    }
  }
};

const hasRefreshToken = async (token) => {
  const rt = await RefreshToken.findOne({ token }).lean();
  return !!rt;
};

const revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

const deleteUserById = async (id) => {
  await RefreshToken.deleteMany({ userId: new mongoose.Types.ObjectId(id) });
  await User.deleteOne({ _id: id });
};

const findById = async (id) => {
  const user = await User.findById(id);
  if (!user) return null;
  const obj = toPlain(user);
  obj.id = String(obj._id);
  return obj;
};

const updatePassword = async (id, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  const updated = await User.findByIdAndUpdate(
    id,
    { $set: { password: hashed } },
    { new: true }
  );
  return sanitizeUser(updated);
};

const updateName = async (id, name) => {
  const updated = await User.findByIdAndUpdate(
    id,
    { $set: { name } },
    { new: true }
  );
  if (!updated) throw new Error('User not found');
  return sanitizeUser(updated);
};

const updateLoginMeta = async (id, ip) => {
  await User.findByIdAndUpdate(id, { $set: { lastLoginIp: ip, lastLoginAt: new Date() } });
};

const listUsers = async () => {
  const all = await User.find({}).lean();
  return all.map((u) => sanitizeUser(u));
};

const updateUserRole = async (id, role) => {
  const updated = await User.findByIdAndUpdate(
    id,
    { $set: { role } },
    { new: true }
  );
  if (!updated) throw new Error('User not found');
  return sanitizeUser(updated);
};

const applyForInternship = async ({ internshipId, userId, ip, fullName, email, phone, coverLetter, experience, skills, education, availability, additionalInfo, resume }) => {
  const doc = await InternshipApplication.create({ 
    internshipId, 
    userId: new mongoose.Types.ObjectId(userId), 
    ip,
    fullName,
    email,
    phone,
    coverLetter,
    experience,
    skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
    education,
    availability,
    additionalInfo,
    resume,
  });
  const obj = toPlain(doc);
  return {
    id: String(obj._id),
    internshipId: obj.internshipId,
    userId: String(obj.userId),
    appliedAt: obj.appliedAt || obj.createdAt,
    ip: obj.ip,
    fullName: obj.fullName,
    email: obj.email,
    phone: obj.phone,
    coverLetter: obj.coverLetter,
    experience: obj.experience,
    skills: obj.skills,
    education: obj.education,
    availability: obj.availability,
    additionalInfo: obj.additionalInfo,
  };
};

const listApplications = async () => {
  const rows = await InternshipApplication.find({}).lean();
  return rows.map((a) => ({
    id: String(a._id),
    internshipId: a.internshipId,
    userId: String(a.userId),
    appliedAt: a.appliedAt || a.createdAt,
    ip: a.ip,
  }));
};

const listApplicationsByUser = async (userId) => {
  const rows = await InternshipApplication.find({ userId: new mongoose.Types.ObjectId(userId) }).lean();
  return rows.map((a) => ({
    id: String(a._id),
    internshipId: a.internshipId,
    userId: String(a.userId),
    appliedAt: a.appliedAt || a.createdAt,
    ip: a.ip,
  }));
};

module.exports = {
  createUser,
  findByEmail,
  verifyPassword,
  sanitizeUser,
  addRefreshToken,
  hasRefreshToken,
  revokeRefreshToken,
  deleteUserById,
  findById,
  updatePassword,
  updateName,
  updateLoginMeta,
  listUsers,
  updateUserRole,
  applyForInternship,
  listApplications,
  listApplicationsByUser,
};
