const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    message: { type: String, required: true },
    sender: { type: String, enum: ['user', 'bot', 'admin'], required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    metadata: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true }
);

const ChatSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['active', 'closed', 'archived'], default: 'active' },
    startedAt: { type: Date, default: Date.now },
    lastMessageAt: { type: Date, default: Date.now },
    messageCount: { type: Number, default: 0 },
    metadata: {
      ip: String,
      userAgent: String,
      referrer: String,
    },
  },
  { timestamps: true }
);

const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);
const ChatSession = mongoose.models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);

module.exports = { ChatMessage, ChatSession };






