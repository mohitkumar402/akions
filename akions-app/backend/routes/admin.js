const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Project = require('../models/Project');
const Internship = require('../models/Internship');
const Document = require('../models/Document');
const { ChatMessage, ChatSession } = require('../models/Chat');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Helper to sanitize mongoose documents
const sanitize = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return { id: String(obj._id), ...obj, _id: undefined, __v: undefined };
};

// ========== PRODUCT ROUTES ==========

// Create product
router.post('/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, image, category, price, rating } = req.body;
    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields (title, description, category, price)' });
    }
    const product = await Product.create({ title, description, image: image || '', category, price, rating: rating || 0 });
    res.status(201).json(sanitize(product));
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products (admin)
router.get('/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products.map(sanitize));
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
router.put('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(sanitize(product));
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== BLOG ROUTES ==========

// Create blog
router.post('/blogs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please check MongoDB connection.' });
    }
    
    const { title, excerpt, content, author, publishedDate, image, category, likes, shares, comments, isPublished } = req.body;
    if (!title || !excerpt || !content || !author || !category) {
      return res.status(400).json({ error: 'Missing required fields (title, excerpt, content, author, category)' });
    }
    
    const blog = await Blog.create({ 
      title, 
      excerpt, 
      content, 
      author, 
      publishedDate: publishedDate || new Date(), 
      image: image || '', 
      category, 
      likes: likes || 0, 
      shares: shares || 0, 
      comments: comments || [],
      isPublished: isPublished !== undefined ? isPublished : true
    });
    res.status(201).json(sanitize(blog));
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get all blogs (admin)
router.get('/blogs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs.map(sanitize));
  } catch (error) {
    console.error('Get blogs error:', error);
    res.json([]);
  }
});

// Update blog
router.put('/blogs/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(sanitize(blog));
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete blog
router.delete('/blogs/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== PROJECT ROUTES ==========

// Create project
router.post('/projects', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please check MongoDB connection.' });
    }
    
    const { title, description, image, category, price, features, technologies, isActive } = req.body;
    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields (title, description, category, price)' });
    }
    
    const project = await Project.create({ 
      title, 
      description, 
      image: image || '', 
      category, 
      price, 
      features: features || [], 
      technologies: technologies || [],
      isActive: isActive !== undefined ? isActive : true
    });
    res.status(201).json(sanitize(project));
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get all projects (admin)
router.get('/projects', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json(projects.map(sanitize));
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
router.put('/projects/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(sanitize(project));
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project
router.delete('/projects/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== INTERNSHIP ROUTES ==========

// Create internship
router.post('/internships', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, company, location, type, duration, stipend, description, image } = req.body;
    if (!title || !company || !location || !type || !duration || !stipend || !description) {
      return res.status(400).json({ error: 'Missing required fields (title, company, location, type, duration, stipend, description)' });
    }
    const internship = await Internship.create({ title, company, location, type, duration, stipend, description, image: image || '' });
    res.status(201).json(sanitize(internship));
  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all internships (admin)
router.get('/internships', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const internships = await Internship.find({}).sort({ createdAt: -1 });
    res.json(internships.map(sanitize));
  } catch (error) {
    console.error('Get internships error:', error);
    res.json([]);
  }
});

// Update internship
router.put('/internships/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findByIdAndUpdate(id, req.body, { new: true });
    if (!internship) return res.status(404).json({ error: 'Internship not found' });
    res.json(sanitize(internship));
  } catch (error) {
    console.error('Update internship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete internship
router.delete('/internships/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findByIdAndDelete(id);
    if (!internship) return res.status(404).json({ error: 'Internship not found' });
    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    console.error('Delete internship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== DOCUMENT ROUTES ==========

// Create document
router.post('/documents', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, fileUrl, category, type, size } = req.body;
    if (!title || !fileUrl || !category) {
      return res.status(400).json({ error: 'Missing required fields (title, fileUrl, category)' });
    }
    const document = await Document.create({ title, description, fileUrl, category, type, size });
    res.status(201).json(sanitize(document));
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all documents (admin)
router.get('/documents', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const documents = await Document.find({}).sort({ createdAt: -1 });
    res.json(documents.map(sanitize));
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update document
router.put('/documents/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findByIdAndUpdate(id, req.body, { new: true });
    if (!document) return res.status(404).json({ error: 'Document not found' });
    res.json(sanitize(document));
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete document
router.delete('/documents/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findByIdAndDelete(id);
    if (!document) return res.status(404).json({ error: 'Document not found' });
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== CHAT MANAGEMENT ROUTES ==========

// Get all chat sessions (admin)
router.get('/chats/sessions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    
    const sessions = await ChatSession.find(query)
      .populate('userId', 'name email')
      .sort({ lastMessageAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await ChatSession.countDocuments(query);
    
    res.json({
      sessions: sessions.map(session => ({
        id: String(session._id),
        sessionId: session.sessionId,
        userId: session.userId ? {
          id: String(session.userId._id),
          name: session.userId.name,
          email: session.userId.email,
        } : null,
        status: session.status,
        startedAt: session.startedAt,
        lastMessageAt: session.lastMessageAt,
        messageCount: session.messageCount,
        metadata: session.metadata,
        createdAt: session.createdAt,
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat messages for a session (admin)
router.get('/chats/sessions/:sessionId/messages', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await ChatMessage.find({ sessionId })
      .populate('userId', 'name email')
      .sort({ timestamp: 1 });
    
    res.json(messages.map(msg => ({
      id: String(msg._id),
      sessionId: msg.sessionId,
      userId: msg.userId ? {
        id: String(msg.userId._id),
        name: msg.userId.name,
        email: msg.userId.email,
      } : null,
      message: msg.message,
      sender: msg.sender,
      timestamp: msg.timestamp,
      isRead: msg.isRead,
      metadata: msg.metadata,
    })));
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send admin message to a chat session
router.post('/chats/sessions/:sessionId/message', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    const adminMessage = await ChatMessage.create({
      sessionId,
      message: message.trim(),
      sender: 'admin',
      isRead: false,
    });
    
    await ChatSession.findByIdAndUpdate(session._id, {
      lastMessageAt: new Date(),
      $inc: { messageCount: 1 },
    });
    
    res.json({
      id: String(adminMessage._id),
      sessionId,
      message: adminMessage.message,
      sender: 'admin',
      timestamp: adminMessage.timestamp,
    });
  } catch (error) {
    console.error('Send admin message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update chat session status
router.put('/chats/sessions/:sessionId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;
    
    if (!['active', 'closed', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const session = await ChatSession.findOneAndUpdate(
      { sessionId },
      { status },
      { new: true }
    );
    
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    res.json({
      id: String(session._id),
      sessionId: session.sessionId,
      status: session.status,
    });
  } catch (error) {
    console.error('Update session status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete chat session and all messages
router.delete('/chats/sessions/:sessionId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    await ChatMessage.deleteMany({ sessionId });
    const session = await ChatSession.findOneAndDelete({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    res.json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    console.error('Delete chat session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat statistics (admin)
router.get('/chats/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalSessions = await ChatSession.countDocuments();
    const activeSessions = await ChatSession.countDocuments({ status: 'active' });
    const totalMessages = await ChatMessage.countDocuments();
    const botMessages = await ChatMessage.countDocuments({ sender: 'bot' });
    const userMessages = await ChatMessage.countDocuments({ sender: 'user' });
    const adminMessages = await ChatMessage.countDocuments({ sender: 'admin' });
    
    // Get sessions from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSessions = await ChatSession.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });
    
    res.json({
      totalSessions,
      activeSessions,
      recentSessions,
      totalMessages,
      botMessages,
      userMessages,
      adminMessages,
    });
  } catch (error) {
    console.error('Get chat stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

