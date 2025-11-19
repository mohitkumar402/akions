const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    avatar: { type: String },
    text: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { _id: true }
);

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    publishedDate: { type: String, required: true },
    image: { type: String, default: '' },
    category: { type: String, required: true },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: [CommentSchema],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

