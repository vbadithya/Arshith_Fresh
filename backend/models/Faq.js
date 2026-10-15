const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'GREETINGS',
      'PRODUCTS',
      'CART_CHECKOUT',
      'ORDERS_DELIVERY',
      'PAYMENTS',
      'RETURNS_REFUNDS',
      'OFFERS_DISCOUNTS',
      'ACCOUNT_TECH'
    ],
    index: true
  },
  question: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  keywords: {
    type: [String],
    default: [],
    index: true
  },
  followUps: {
    type: [String],
    default: []
  },
  quickActions: [
    {
      label: { type: String, required: true },
      action: { type: String, default: 'chat' }, // 'chat', 'url', 'filter', 'cart'
      value: { type: String, default: '' }
    }
  ],
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

faqSchema.index({ question: 'text', answer: 'text', keywords: 'text' });

module.exports = mongoose.model('Faq', faqSchema);
