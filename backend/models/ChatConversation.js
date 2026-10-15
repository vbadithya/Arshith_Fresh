const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'bot', 'agent'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  products: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  chips: {
    type: [String],
    default: []
  },
  intent: {
    type: String,
    default: ''
  }
});

const chatConversationSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customerName: {
    type: String,
    default: 'Guest Shopper'
  },
  customerEmail: {
    type: String,
    default: ''
  },
  customerPhone: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated'],
    default: 'active',
    index: true
  },
  category: {
    type: String,
    default: 'General'
  },
  context: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  messages: [messageSchema],
  unresolvedQuestion: {
    type: String,
    default: ''
  },
  isEscalated: {
    type: Boolean,
    default: false,
    index: true
  },
  notes: {
    type: String,
    default: ''
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatConversation', chatConversationSchema);
