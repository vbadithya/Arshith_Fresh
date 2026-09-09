const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { createShiprocketOrder } = require('../utils/shiprocketService');

// Helper to initialize Razorpay instance strictly using process.env
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return null;
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// @route   GET /api/payment/key
// @desc    Get public Razorpay Key ID for client checkout
router.get('/key', (req, res) => {
  const key = process.env.RAZORPAY_KEY_ID || '';
  res.json({
    key,
    configured: Boolean(key && process.env.RAZORPAY_KEY_SECRET),
  });
});

// @route   POST /api/payment/create-order
// @desc    Create a new Razorpay Order & register pending DB order
router.post('/create-order', async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      billingAddress,
      customerName,
      customerEmail,
      customerPhone,
      itemsPrice,
      shippingPrice,
      totalPrice,
      discountPrice,
      couponCode,
    } = req.body;

    console.log('\n==========================================');
    console.log('🛒 [POST /api/payment/create-order]');
    console.log(`   Customer: ${customerName} (${customerEmail})`);
    console.log(`   Total Price: ₹${totalPrice}`);
    console.log('==========================================\n');

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      console.error('❌ Razorpay credentials missing in process.env (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET)');
      return res.status(500).json({
        success: false,
        message: 'Razorpay credentials (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are missing or invalid in server environment.',
      });
    }

    let calculatedTotal = Number(totalPrice);
    if (!calculatedTotal || calculatedTotal <= 0) {
      const itemsSum = Number(itemsPrice) || orderItems.reduce((acc, item) => acc + (Number(item.price || 0) * Math.max(1, Number(item.qty || item.quantity || 1))), 0);
      calculatedTotal = itemsSum + Number(shippingPrice || 0) - Number(discountPrice || 0);
    }
    const amountInPaise = Math.round(Number(calculatedTotal) * 100);

    if (amountInPaise <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid order amount' });
    }

    // Create official order with Razorpay API
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-8)}`,
      notes: {
        customerName: customerName || 'Customer',
        customerEmail: customerEmail || '',
      },
    };

    const rzpOrder = await razorpay.orders.create(options);
    console.log(`✅ Razorpay Order Created: ID="${rzpOrder.id}", Amount=${rzpOrder.amount} paise`);

    // Consolidate duplicate products into single item entries with combined quantity
    const itemMap = new Map();
    (orderItems || []).forEach(item => {
      if (!item) return;
      const key = String(item.product || item.name || item.title || '').trim().toLowerCase();
      const qty = Math.max(1, Number(item.qty || item.quantity || 1));
      const price = Number(item.price || 0);
      if (itemMap.has(key)) {
        const existing = itemMap.get(key);
        existing.qty = (Number(existing.qty || 1)) + qty;
      } else {
        itemMap.set(key, {
          ...item,
          name: item.name || item.title || 'Fresh Product',
          qty: qty,
          price: price,
        });
      }
    });
    const sanitizedOrderItems = Array.from(itemMap.values());

    // Create pending Order in MongoDB
    const order = new Order({
      customerName: customerName || 'Customer',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      orderItems: sanitizedOrderItems,
      shippingAddress: shippingAddress || {
        address: 'N/A',
        city: 'N/A',
        postalCode: '000000',
        country: 'India',
      },
      billingAddress: billingAddress || shippingAddress || {
        address: 'N/A',
        city: 'N/A',
        postalCode: '000000',
        country: 'India',
      },
      paymentMethod: 'Razorpay',
      itemsPrice: itemsPrice || calculatedTotal,
      discountPrice: discountPrice || 0,
      couponCode: couponCode || '',
      shippingPrice: shippingPrice || 0,
      totalPrice: calculatedTotal,
      status: 'Pending',
      paymentStatus: 'pending',
      isPaid: false,
      razorpayOrderId: rzpOrder.id,
    });

    const savedOrder = await order.save();
    console.log(`📦 MongoDB Pending Order Saved: ID="${savedOrder._id}", status="Pending", isPaid=false`);

    res.status(201).json({
      success: true,
      order: rzpOrder,
      dbOrderId: savedOrder._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate Razorpay payment',
      error: error.message,
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature and update order status
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    console.log('\n==========================================');
    console.log('💳 [POST /api/payment/verify] REQUEST RECEIVED:');
    console.log('   dbOrderId:          ', dbOrderId);
    console.log('   razorpay_order_id:  ', razorpay_order_id);
    console.log('   razorpay_payment_id:', razorpay_payment_id);
    console.log('   razorpay_signature: ', razorpay_signature ? `${razorpay_signature.slice(0, 15)}...` : 'MISSING');
    console.log('==========================================\n');

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('❌ Verification Error: Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature');
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details (order ID, payment ID, or signature)',
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('❌ Verification Error: RAZORPAY_KEY_SECRET is missing from process.env');
      return res.status(500).json({
        success: false,
        message: 'RAZORPAY_KEY_SECRET is not configured in environment variables.',
      });
    }

    // Verify HMAC-SHA256 signature: razorpay_order_id + "|" + razorpay_payment_id
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const isValid = (generatedSignature === razorpay_signature);

    console.log('🔑 Signature Verification Analysis:');
    console.log('   Payload:            ', payload);
    console.log('   Generated Signature:', generatedSignature);
    console.log('   Received Signature: ', razorpay_signature);
    console.log('   Result:             ', isValid ? '✅ MATCH / SIGNATURE VALID' : '❌ MISMATCH / SIGNATURE INVALID');

    // Find the pending order in MongoDB
    let order = null;
    if (dbOrderId && mongoose.Types.ObjectId.isValid(dbOrderId)) {
      order = await Order.findById(dbOrderId);
    }
    if (!order && razorpay_order_id) {
      order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    }

    if (!order) {
      console.error(`❌ MongoDB Order Not Found for dbOrderId="${dbOrderId}" / razorpayOrderId="${razorpay_order_id}"`);
      return res.status(404).json({ success: false, message: 'Order not found for this payment verification' });
    }

    console.log(`📦 Found MongoDB Order ID="${order._id}". Pre-verification state: status="${order.status}", isPaid=${order.isPaid}`);

    if (isValid) {
      // Update order to paid & confirmed
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = 'Confirmed';
      order.paymentStatus = 'paid';
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      order.transactionId = razorpay_payment_id;
      
      const updatedOrder = await order.save();

      console.log(`✅ [ORDER UPDATED IN MONGODB]`);
      console.log(`   Order ID:       ${updatedOrder._id}`);
      console.log(`   status:         "${updatedOrder.status}"`);
      console.log(`   isPaid:         ${updatedOrder.isPaid}`);
      console.log(`   paymentStatus:  "${updatedOrder.paymentStatus}"`);
      console.log(`   paidAt:         ${updatedOrder.paidAt}`);
      console.log(`   transactionId:  "${updatedOrder.transactionId}"`);

      // Trigger Shiprocket Order ONLY after payment verification succeeds
      createShiprocketOrder(updatedOrder).catch(err => {
        console.warn('[Shiprocket] Auto push payment notice:', err.message);
      });

      return res.json({
        success: true,
        message: 'Payment verified and order confirmed successfully',
        orderId: updatedOrder._id,
      });
    } else {
      order.paymentStatus = 'failed';
      order.status = 'Cancelled';
      await order.save();

      console.error(`❌ Signature Mismatch! Order ID="${order._id}" marked as failed/cancelled.`);

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Verification failed.',
      });
    }
  } catch (error) {
    console.error('❌ Exception during payment verification:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification server error',
      error: error.message,
    });
  }
});

// @route   POST /api/payment/webhook
// @desc    Razorpay Webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!secret || !signature) {
      return res.status(400).json({ status: 'error', message: 'Missing webhook secret or signature' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ status: 'invalid signature' });
    }

    const event = req.body.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      const order = await Order.findOne({ razorpayOrderId: orderId });
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = 'Confirmed';
        order.paymentStatus = 'paid';
        order.razorpayPaymentId = paymentId;
        order.transactionId = paymentId;
        await order.save();
        console.log(`✅ [WEBHOOK] Order ${order._id} confirmed via Razorpay webhook.`);
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
