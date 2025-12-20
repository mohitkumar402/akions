const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Project = require('../models/Project');
const Internship = require('../models/Internship');
const emailService = require('../services/emailService');

// Helper to sanitize mongoose documents
const sanitize = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return { id: String(obj._id), ...obj, _id: undefined, __v: undefined };
};

// Get all active products
router.get('/products', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('[Products API] MongoDB not connected, returning empty array');
      return res.json([]);
    }
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products.map(sanitize));
  } catch (error) {
    console.error('Get products error:', error);
    // Return empty array instead of error to allow frontend to work
    res.json([]);
  }
});

// Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(sanitize(product));
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all published blogs
router.get('/blogs', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('[Blogs API] MongoDB not connected, returning empty array');
      return res.json([]);
    }
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs.map(sanitize));
  } catch (error) {
    console.error('Get blogs error:', error);
    // Return empty array instead of error to allow frontend to work
    res.json([]);
  }
});

// Get single blog
router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, isPublished: true });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(sanitize(blog));
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all active projects
router.get('/projects', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('[Projects API] MongoDB not connected, returning empty array');
      return res.json([]);
    }
    const projects = await Project.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(projects.map(sanitize));
  } catch (error) {
    console.error('Get projects error:', error);
    // Return empty array instead of error to allow frontend to work
    res.json([]);
  }
});

// Product contact request
router.post('/products/contact', async (req, res) => {
  try {
    const { productId, productName, name, email, phone, company, message } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields (name, email, phone)' });
    }

    // Log the request
    console.log('Product Contact Request:', {
      productId,
      productName,
      name,
      email,
      phone,
      company,
      message,
      timestamp: new Date().toISOString(),
    });

    // Send email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@ekions.com';
      await emailService.sendProductContactEmail({
        to: adminEmail,
        productName: productName || 'Unknown Product',
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        company: company || 'Not provided',
        message: message || 'No additional message',
        productId,
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ 
      message: 'Contact request submitted successfully. Our team will reach out to you soon.',
      success: true 
    });
  } catch (error) {
    console.error('Product contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Custom product request
router.post('/products/custom-request', async (req, res) => {
  try {
    const { name, email, phone, company, productType, description, budget, timeline } = req.body;
    
    if (!name || !email || !description) {
      return res.status(400).json({ error: 'Missing required fields (name, email, description)' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Log the request
    console.log('Custom Product Request:', {
      name,
      email,
      phone,
      company,
      productType,
      description,
      budget,
      timeline,
      timestamp: new Date().toISOString(),
    });

    // Send email to admin (mkfunmasti@gmail.com)
    try {
      const adminEmail = 'mkfunmasti@gmail.com';
      await emailService.sendCustomProductRequestEmail({
        to: adminEmail,
        customerName: name,
        customerEmail: email,
        customerPhone: phone || 'Not provided',
        company: company || 'Not provided',
        productType: productType || 'Not specified',
        description,
        budget: budget || 'Not specified',
        timeline: timeline || 'Not specified',
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ 
      message: 'Request submitted successfully. Our team will contact you soon.',
      success: true 
    });
  } catch (error) {
    console.error('Custom product request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact form submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Log the request
    console.log('Contact Form Submission:', {
      name,
      email,
      subject: subject || 'General Inquiry',
      timestamp: new Date().toISOString(),
    });

    // Send email to akions@hotmail.com
    try {
      await emailService.sendContactFormEmail({
        name: name.trim(),
        email: email.trim(),
        subject: subject ? subject.trim() : 'Contact Form Submission from Akions Website',
        message: message.trim(),
      });
    } catch (emailError) {
      console.error('Failed to send contact form email:', emailError);
      // Don't fail the request if email fails, but log it
    }

    res.json({ 
      message: 'Thank you for contacting us! We have received your message and will get back to you soon.',
      success: true 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, isActive: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(sanitize(project));
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all active internships
router.get('/internships', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('[Internships API] MongoDB not connected, returning empty array');
      return res.json([]);
    }
    const internships = await Internship.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(internships.map(sanitize));
  } catch (error) {
    console.error('Get internships error:', error);
    // Return empty array instead of error to allow frontend to work
    res.json([]);
  }
});

// Get single internship
router.get('/internships/:id', async (req, res) => {
  try {
    const internship = await Internship.findOne({ _id: req.params.id, isActive: true });
    if (!internship) return res.status(404).json({ error: 'Internship not found' });
    res.json(sanitize(internship));
  } catch (error) {
    console.error('Get internship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

