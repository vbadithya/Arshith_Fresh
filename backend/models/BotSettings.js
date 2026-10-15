const mongoose = require('mongoose');

const botSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'default'
  },
  greeting: {
    type: String,
    default: "Hii! 👋 Welcome to Arshith Fresh! I'm your AI shopping assistant. How can I help you today?"
  },
  quickActions: [
    {
      label: { type: String, required: true },
      action: { type: String, default: 'chat' },
      value: { type: String, default: '' }
    }
  ],
  storePolicies: {
    freeShippingThreshold: { type: Number, default: 1000 },
    deliveryTimeDays: { type: String, default: '3 to 5 business days' },
    returnWindowDays: { type: Number, default: 7 },
    supportEmail: { type: String, default: 'support@arshithfresh.com' },
    supportPhone: { type: String, default: '+91 9945676029' },
    supportHours: { type: String, default: 'Mon-Sat, 9:00 AM - 7:00 PM IST' },
    whatsappUrl: { type: String, default: 'https://api.whatsapp.com/send/?phone=919945676029&text=Hi%20Arshith%20Fresh!' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BotSettings', botSettingsSchema);
