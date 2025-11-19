const express = require('express');
const router = express.Router();
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
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products.map(sanitize));
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs.map(sanitize));
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    const projects = await Project.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(projects.map(sanitize));
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@akions.com';
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
    const internships = await Internship.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(internships.map(sanitize));
  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({ error: 'Internal server error' });
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

