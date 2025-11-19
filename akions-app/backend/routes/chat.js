const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ChatMessage, ChatSession } = require('../models/Chat');
const { v4: uuidv4 } = require('uuid');
const { generateResponse } = require('../services/chatbotService');

// Health check for chat routes
router.get('/chat/health', (req, res) => {
  res.json({ status: 'ok', service: 'chat', timestamp: new Date().toISOString() });
});

// Create or get chat session
router.post('/chat/session', async (req, res) => {
  try {
    const { sessionId, userId } = req.body;
    let session;
    
    // Validate userId if provided (should be a valid MongoDB ObjectId string)
    let validUserId = null;
    if (userId) {
      // Check if userId is a valid ObjectId format
      if (mongoose.Types.ObjectId.isValid(userId)) {
        validUserId = userId;
      } else {
        console.warn('Invalid userId format:', userId);
      }
    }
    
    if (sessionId) {
      session = await ChatSession.findOne({ sessionId });
    }
    
    if (!session) {
      const newSessionId = sessionId || uuidv4();
      try {
        session = await ChatSession.create({
          sessionId: newSessionId,
          userId: validUserId,
          metadata: {
            ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
            userAgent: req.headers['user-agent'] || 'unknown',
            referrer: req.headers.referer || 'unknown',
          },
        });
      } catch (createError) {
        // If creation fails due to duplicate sessionId, try to find it
        if (createError.code === 11000) {
          session = await ChatSession.findOne({ sessionId: newSessionId });
        } else {
          throw createError;
        }
      }
    }
    
    res.json({ sessionId: session.sessionId });
  } catch (error) {
    console.error('Create session error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    res.status(500).json({ 
      error: 'Failed to create chat session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get chat history
router.get('/chat/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await ChatMessage.find({ sessionId })
      .sort({ timestamp: 1 })
      .limit(50);
    
    if (messages.length === 0) {
      return res.json([]);
    }
    
    res.json(messages.map(msg => ({
      id: String(msg._id),
      text: msg.message,
      message: msg.message, // Include both for compatibility
      sender: msg.sender,
      timestamp: msg.timestamp,
    })));
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

// Chat endpoint with real-time support
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, userId, conversationHistory } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // Ensure session exists
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = await ChatSession.create({
        sessionId,
        userId: userId || null,
        metadata: {
          ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown',
        },
      });
    }
    
    // Save user message
    const userMessage = await ChatMessage.create({
      sessionId,
      userId: userId || null,
      message: message.trim(),
      sender: 'user',
      metadata: {
        ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
      },
    });
    
    // Update session
    await ChatSession.findByIdAndUpdate(session._id, {
      lastMessageAt: new Date(),
      $inc: { messageCount: 1 },
    });
    
    // Simulate thinking time for realistic experience
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Generate bot response using the enhanced chatbot service
    const responseText = await generateResponse(message, conversationHistory || [], sessionId);
    
    // Save bot response
    const botMessage = await ChatMessage.create({
      sessionId,
      message: responseText,
      sender: 'bot',
    });
    
    res.json({
      response: responseText,
      timestamp: new Date().toISOString(),
      messageId: String(botMessage._id),
      sessionId: sessionId,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.',
      response: 'I apologize, but I\'m having trouble processing your request right now. Please try rephrasing your question or contact us directly at contact@akions.com for immediate assistance.'
    });
  }
});

module.exports = router;

