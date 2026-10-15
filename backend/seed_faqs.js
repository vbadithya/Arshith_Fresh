const mongoose = require('mongoose');
require('dotenv').config();
const Faq = require('./models/Faq');
const BotSettings = require('./models/BotSettings');
const FAQ_DATA = require('./data/faqData');
const connectDB = require('./config/db');

async function seedFaqs() {
  try {
    await connectDB();
    console.log(`\n🌱 Starting FAQ & BotSettings Seeder for Arshith Fresh...`);

    // 1. Seed or Upsert all 76 FAQs
    let upsertedCount = 0;
    for (const item of FAQ_DATA) {
      await Faq.findOneAndUpdate(
        { question: item.question },
        {
          $set: {
            category: item.category,
            answer: item.answer,
            keywords: item.keywords,
            followUps: item.followUps || [],
            quickActions: item.quickActions || [],
            isPublished: true,
            order: item.order || 0
          }
        },
        { upsert: true, new: true }
      );
      upsertedCount++;
    }
    console.log(`✅ Successfully seeded/updated ${upsertedCount} FAQs into MongoDB collection 'faqs'!`);

    // 2. Seed Default Bot Settings
    const defaultSettings = {
      key: 'default',
      greeting: "Hii! 👋 Welcome to Arshith Fresh! I'm your AI shopping assistant. How can I help you today?",
      quickActions: [
        { label: 'Shop Products', action: 'chat', value: 'What products do you sell?' },
        { label: 'Product Information', action: 'chat', value: 'What products are available?' },
        { label: 'Orders & Delivery', action: 'chat', value: 'How long does delivery take?' },
        { label: 'Payment Help', action: 'chat', value: 'Which payment methods are supported?' },
        { label: 'Returns & Cancellations', action: 'chat', value: 'What is your return policy?' },
        { label: 'Offers & Discounts', action: 'chat', value: 'Are there any current offers?' },
        { label: 'Talk to Support', action: 'chat', value: 'How can I contact a human support agent?' }
      ],
      storePolicies: {
        freeShippingThreshold: 1000,
        deliveryTimeDays: '3 to 5 business days',
        returnWindowDays: 7,
        supportEmail: 'support@arshithfresh.com',
        supportPhone: '+91 9945676029',
        supportHours: 'Mon-Sat, 9:00 AM - 7:00 PM IST',
        whatsappUrl: 'https://api.whatsapp.com/send/?phone=919945676029&text=Hi%20Arshith%20Fresh!'
      }
    };

    await BotSettings.findOneAndUpdate(
      { key: 'default' },
      { $set: defaultSettings },
      { upsert: true, new: true }
    );
    console.log(`✅ Successfully seeded/updated BotSettings in MongoDB!`);

    const count = await Faq.countDocuments();
    console.log(`📊 Total FAQs currently in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
    process.exit(1);
  }
}

seedFaqs();
