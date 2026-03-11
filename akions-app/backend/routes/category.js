const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// ==================== PUBLIC ROUTES ====================

// Get all categories (public - for frontend menu)
router.get('/', async (req, res) => {
  try {
    const { active = 'true', menu = 'false', hierarchy = 'false' } = req.query;
    
    let query = {};
    if (active === 'true') {
      query.isActive = true;
    }
    if (menu === 'true') {
      query.showInMenu = true;
    }
    
    if (hierarchy === 'true') {
      const hierarchyData = await Category.getHierarchy();
      return res.json(hierarchyData);
    }
    
    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug')
      .sort({ sequenceNo: -1, name: 1 });
    
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Get parent categories only (for dropdown)
router.get('/parents', async (req, res) => {
  try {
    const parents = await Category.getParentCategories();
    res.json(parents);
  } catch (error) {
    console.error('Get parent categories error:', error);
    res.status(500).json({ message: 'Failed to fetch parent categories' });
  }
});

// Get category hierarchy for menu
router.get('/menu', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true, showInMenu: true })
      .populate('parentCategory', 'name slug')
      .sort({ sequenceNo: -1, name: 1 });
    
    // Build tree structure
    const parentCategories = categories.filter(c => !c.parentCategory);
    const childCategories = categories.filter(c => c.parentCategory);
    
    const menu = parentCategories.map(parent => ({
      _id: parent._id,
      name: parent.name,
      slug: parent.slug,
      icon: parent.icon,
      image: parent.image,
      children: childCategories
        .filter(child => child.parentCategory._id.toString() === parent._id.toString())
        .sort((a, b) => b.sequenceNo - a.sequenceNo)
        .map(child => ({
          _id: child._id,
          name: child.name,
          slug: child.slug,
          icon: child.icon,
          image: child.image,
        })),
    }));
    
    res.json(menu);
  } catch (error) {
    console.error('Get menu categories error:', error);
    res.status(500).json({ message: 'Failed to fetch menu categories' });
  }
});

// Get single category by ID or slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    
    let category;
    // Check if it's a valid MongoDB ObjectId
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug)
        .populate('parentCategory', 'name slug');
    } else {
      category = await Category.findOne({ slug: idOrSlug })
        .populate('parentCategory', 'name slug');
    }
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Get child categories
    const children = await Category.find({ parentCategory: category._id, isActive: true })
      .sort({ sequenceNo: -1, name: 1 });
    
    // Get products in this category
    const products = await Product.find({ category: category._id })
      .sort({ sequenceNo: -1, createdAt: -1 })
      .limit(20);
    
    res.json({
      ...category.toObject(),
      children,
      products,
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
});

// Get products by category
router.get('/:idOrSlug/products', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    let category;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({ slug: idOrSlug });
    }
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Get all child category IDs too
    const childCategories = await Category.find({ parentCategory: category._id });
    const categoryIds = [category._id, ...childCategories.map(c => c._id)];
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find({ category: { $in: categoryIds } })
      .populate('category', 'name slug')
      .sort({ sequenceNo: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments({ category: { $in: categoryIds } });
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get category products error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all categories for admin (including inactive)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parentCategory', 'name slug')
      .sort({ sequenceNo: -1, createdAt: -1 });
    
    // Add product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat._id });
        return {
          ...cat.toObject(),
          productCount,
        };
      })
    );
    
    res.json(categoriesWithCount);
  } catch (error) {
    console.error('Admin get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Create category (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      parentCategory,
      description,
      content,
      headerContent,
      image,
      headerImage,
      icon,
      sequenceNo,
      isActive,
      showInMenu,
      showInFooter,
      metaTitle,
      metaKeywords,
      metaDescription,
    } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category with same name exists under same parent
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      parentCategory: parentCategory || null,
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const category = new Category({
      name,
      parentCategory: parentCategory || null,
      description: description || '',
      content: content || '',
      headerContent: headerContent || '',
      image: image || '',
      headerImage: headerImage || '',
      icon: icon || '📦',
      sequenceNo: sequenceNo || 0,
      isActive: isActive !== false,
      showInMenu: showInMenu !== false,
      showInFooter: showInFooter || false,
      metaTitle: metaTitle || '',
      metaKeywords: metaKeywords || '',
      metaDescription: metaDescription || '',
    });
    
    await category.save();
    
    // Populate parent for response
    await category.populate('parentCategory', 'name slug');
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Prevent category from being its own parent
    if (updateData.parentCategory === id) {
      return res.status(400).json({ message: 'Category cannot be its own parent' });
    }
    
    // Check for circular reference
    if (updateData.parentCategory) {
      let parent = await Category.findById(updateData.parentCategory);
      while (parent) {
        if (parent._id.toString() === id) {
          return res.status(400).json({ message: 'Circular reference detected' });
        }
        parent = parent.parentCategory ? await Category.findById(parent.parentCategory) : null;
      }
    }
    
    const category = await Category.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        parentCategory: updateData.parentCategory || null,
      },
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name slug');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Failed to update category' });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has children
    const childCount = await Category.countDocuments({ parentCategory: id });
    if (childCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category with ${childCount} child categories. Delete children first.` 
      });
    }
    
    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category with ${productCount} products. Move or delete products first.` 
      });
    }
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
});

// Bulk update sequence numbers
router.put('/admin/reorder', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, sequenceNo }
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: 'Updates array is required' });
    }
    
    await Promise.all(
      updates.map(({ id, sequenceNo }) =>
        Category.findByIdAndUpdate(id, { sequenceNo })
      )
    );
    
    res.json({ message: 'Categories reordered successfully' });
  } catch (error) {
    console.error('Reorder categories error:', error);
    res.status(500).json({ message: 'Failed to reorder categories' });
  }
});

module.exports = router;
