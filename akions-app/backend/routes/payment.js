const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const { authenticateToken } = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret_1234567890',
});

// Create Razorpay order
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { productId, productType, amount } = req.body;

    if (!productId || !productType || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        productId,
        productType,
        userId: req.user.id,
      },
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = await Payment.create({
      userId: req.user.id,
      productId,
      productType,
      amount,
      razorpayOrderId: order.id,
      status: 'pending',
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment
router.post('/verify-payment', authenticateToken, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !paymentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret_1234567890')
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'completed',
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ message: 'Payment verified successfully', payment });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Get user's payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments.map((p) => ({
      id: String(p._id),
      productId: p.productId,
      productType: p.productType,
      amount: p.amount,
      status: p.status,
      createdAt: p.createdAt,
    })));
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

