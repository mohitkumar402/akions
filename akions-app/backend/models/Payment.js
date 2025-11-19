const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: String, required: true },
    productType: { type: String, enum: ['product', 'project'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethod: { type: String, default: 'razorpay' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

