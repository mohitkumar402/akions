const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    // Legacy string category (for backward compatibility)
    category: { type: String, default: '' },
    // Reference to Category model  
    categoryId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      default: null,
    },
    price: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isActive: { type: Boolean, default: true },
    // SEO Meta Fields
    metaTitle: { type: String, default: '' },
    metaKeyword: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    sequenceNo: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);

