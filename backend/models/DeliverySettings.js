const mongoose = require('mongoose');

const deliverySettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'default'
  },
  // Universal free shipping override
  isFreeShippingForAll: {
    type: Boolean,
    default: false
  },
  // Universal free delivery threshold (default: ₹2000)
  freeShippingThreshold: {
    type: Number,
    default: 2000
  },
  // 1. Bangalore Location (orders under ₹2000)
  bangaloreCharge: {
    type: Number,
    default: 50
  },
  // 2. South India (orders under ₹1000)
  southIndiaTier1Charge: {
    type: Number,
    default: 145
  },
  // South India Tier 2 Threshold (default: ₹1000)
  southIndiaTier2Threshold: {
    type: Number,
    default: 1000
  },
  // South India Tier 2 Delivery Charge (orders ₹1000 to ₹1999)
  southIndiaTier2Charge: {
    type: Number,
    default: 100
  },
  // 3. Rest of India (orders under ₹2000)
  restOfIndiaCharge: {
    type: Number,
    default: 150
  },
  // Region definitions (editable in Admin)
  southIndiaStates: {
    type: [String],
    default: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala']
  },
  bangalorePincodes: {
    type: [String],
    default: ['560']
  },
  // Backward compatibility fields
  standardCharge: {
    type: Number,
    default: 50
  },
  enableMidTier: {
    type: Boolean,
    default: true
  },
  midTierThreshold: {
    type: Number,
    default: 1000
  },
  midTierCharge: {
    type: Number,
    default: 100
  },
  estimatedDeliveryDays: {
    type: String,
    default: '3 to 5 business days'
  },
  bannerMessage: {
    type: String,
    default: 'FREE Delivery on all orders above ₹2,000'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DeliverySettings', deliverySettingsSchema);
