const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: true,
    trim: true,
  },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true,
  },
  parentCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    default: null,
  },
  description: { 
    type: String, 
    default: '' 
  },
  
  // Content (Rich text for category page)
  content: { 
    type: String, 
    default: '' 
  },
  headerContent: { 
    type: String, 
    default: '' 
  },
  
  // Images
  image: { 
    type: String, 
    default: '' 
  },
  headerImage: { 
    type: String, 
    default: '' 
  },
  icon: { 
    type: String, 
    default: '📦' 
  },
  
  // Display Settings
  sequenceNo: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  showInMenu: { 
    type: Boolean, 
    default: true 
  },
  showInFooter: { 
    type: Boolean, 
    default: false 
  },
  
  // SEO Meta Fields
  metaTitle: { 
    type: String, 
    default: '' 
  },
  metaKeywords: { 
    type: String, 
    default: '' 
  },
  metaDescription: { 
    type: String, 
    default: '' 
  },
  
}, { timestamps: true });

// Generate slug from name before saving
CategorySchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for getting child categories
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory',
});

// Virtual for getting products in this category
CategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
});

// Ensure virtuals are included in JSON
CategorySchema.set('toJSON', { virtuals: true });
CategorySchema.set('toObject', { virtuals: true });

// Static method to get categories with hierarchy
CategorySchema.statics.getHierarchy = async function() {
  const categories = await this.find({ isActive: true })
    .populate('parentCategory', 'name slug')
    .sort({ sequenceNo: -1, name: 1 });
  
  // Build tree structure
  const parentCategories = categories.filter(c => !c.parentCategory);
  const childCategories = categories.filter(c => c.parentCategory);
  
  const hierarchy = parentCategories.map(parent => ({
    ...parent.toObject(),
    children: childCategories.filter(
      child => child.parentCategory._id.toString() === parent._id.toString()
    ),
  }));
  
  return hierarchy;
};

// Static method to get all parent categories (for dropdown)
CategorySchema.statics.getParentCategories = async function() {
  return this.find({ parentCategory: null, isActive: true })
    .sort({ sequenceNo: -1, name: 1 });
};

module.exports = mongoose.models.Category || mongoose.model('Category', CategorySchema);
