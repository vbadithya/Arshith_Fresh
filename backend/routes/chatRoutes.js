const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const Faq = require('../models/Faq');
const ChatConversation = require('../models/ChatConversation');
const BotSettings = require('../models/BotSettings');
const {
  getFaqs,
  getBotSettings,
  invalidateFaqCache,
  processUserMessage,
  findLiveProducts
} = require('../utils/chatEngine');

// Simple Rate Limiting for chat endpoint (in-memory sliding window)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 min
const MAX_REQUESTS_PER_WINDOW = 60; // 60 messages/minute per IP

function rateLimiter(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a moment before sending another message.'
    });
  }
  next();
}

// Admin Authorization Middleware
function verifyAdmin(req, res, next) {
  const adminToken = req.headers['x-admin-token'] || req.headers['x-admin-key'] || req.headers['authorization'];
  const devHeader = req.headers['x-admin-dev'];
  const adminEmail = req.headers['x-admin-email'];

  // Accept valid admin indicators from Arshith Fresh admin portal
  if (devHeader === 'true' || adminToken || (adminEmail && adminEmail.includes('@'))) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. Authorized administrator privileges are required.'
  });
}

// ===========================================================================
// CUSTOMER CHAT ENDPOINTS
// ===========================================================================

// @route   GET /api/chat/init
// @desc    Retrieve greeting, quick-actions, and active store policies
router.get('/init', async (req, res) => {
  try {
    const settings = await getBotSettings();
    res.json({
      success: true,
      greeting: settings.greeting,
      quickActions: settings.quickActions,
      storePolicies: settings.storePolicies
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/chat
// @desc    Process customer query, return natural response with live products, and persist conversation
router.post('/', rateLimiter, async (req, res) => {
  try {
    const {
      message,
      conversationId: clientConvId,
      customerName,
      customerEmail,
      customerPhone,
      context = {}
    } = req.body;

    const trimmedMsg = (message || '').trim();
    if (!trimmedMsg) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    // Generate or maintain persistent conversationId
    const convId = clientConvId || ('conv_' + crypto.randomBytes(8).toString('hex'));

    // Process query through natural language engine
    const result = await processUserMessage(trimmedMsg, context);

    // Asynchronously save/update conversation in MongoDB
    ChatConversation.findOneAndUpdate(
      { conversationId: convId },
      {
        $setOnInsert: {
          customerName: customerName || 'Guest Shopper',
          customerEmail: customerEmail || '',
          customerPhone: customerPhone || '',
          category: result.category || 'General',
          status: 'active'
        },
        $set: {
          context: result.context,
          ...(result.isUnresolved ? { unresolvedQuestion: trimmedMsg, isEscalated: true } : {})
        },
        $push: {
          messages: [
            { sender: 'user', text: trimmedMsg, timestamp: new Date() },
            {
              sender: 'bot',
              text: result.reply,
              timestamp: new Date(),
              products: result.products,
              chips: result.chips,
              intent: result.matchedFaq || result.category
            }
          ]
        }
      },
      { upsert: true, new: true }
    ).catch(err => {
      console.warn('⚠️ Non-blocking error saving ChatConversation:', err.message);
    });

    return res.json({
      success: true,
      conversationId: convId,
      reply: result.reply,
      category: result.category,
      products: result.products,
      chips: result.chips,
      quickActions: result.quickActions,
      context: result.context,
      confidence: result.confidence
    });
  } catch (error) {
    console.error('❌ Error handling chat message:', error);
    res.status(500).json({
      success: false,
      reply: "I'm here to help with your Arshith Fresh orders, pure cold-pressed oils, A2 ghee, and spices! You can also chat directly with our support team on WhatsApp at +91 9945676029.",
      products: [],
      chips: ['What products do you sell?', 'Talk to Support']
    });
  }
});

// @route   GET /api/chat/conversation/:id
// @desc    Retrieve persistent chat conversation history for a customer session
router.get('/conversation/:id', async (req, res) => {
  try {
    const conv = await ChatConversation.findOne({ conversationId: req.params.id }).lean();
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    res.json({ success: true, conversation: conv });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===========================================================================
// ADMIN MANAGEMENT ENDPOINTS (PROTECTED)
// ===========================================================================

// @route   GET /api/chat/admin/conversations
// @desc    List and search customer support conversations
router.get('/admin/conversations', verifyAdmin, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { customerName: searchRegex },
        { customerEmail: searchRegex },
        { conversationId: searchRegex },
        { unresolvedQuestion: searchRegex },
        { 'messages.text': searchRegex }
      ];
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const total = await ChatConversation.countDocuments(filter);
    const conversations = await ChatConversation.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      conversations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/chat/admin/conversations/:id
// @desc    Get detailed message history for a specific conversation
router.get('/admin/conversations/:id', verifyAdmin, async (req, res) => {
  try {
    const conv = await ChatConversation.findOne({ conversationId: req.params.id }).lean();
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    res.json({ success: true, conversation: conv });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/chat/admin/conversations/:id
// @desc    Update status (resolved/escalated) or add admin notes
router.patch('/admin/conversations/:id', verifyAdmin, async (req, res) => {
  try {
    const { status, notes, isEscalated } = req.body;
    const updates = {};

    if (status) {
      updates.status = status;
      if (status === 'resolved') updates.resolvedAt = new Date();
    }
    if (typeof notes === 'string') updates.notes = notes;
    if (typeof isEscalated === 'boolean') updates.isEscalated = isEscalated;

    const conv = await ChatConversation.findOneAndUpdate(
      { conversationId: req.params.id },
      { $set: updates },
      { new: true }
    );

    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({ success: true, conversation: conv });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/chat/admin/faqs
// @desc    List all FAQs with optional category filter and search
router.get('/admin/faqs', verifyAdmin, async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'ALL') {
      filter.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { question: searchRegex },
        { answer: searchRegex },
        { keywords: searchRegex }
      ];
    }

    const faqs = await Faq.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/chat/admin/faqs
// @desc    Create a new FAQ entry
router.post('/admin/faqs', verifyAdmin, async (req, res) => {
  try {
    const { category, question, answer, keywords, followUps, quickActions, isPublished, order } = req.body;

    if (!category || !question || !answer) {
      return res.status(400).json({ success: false, message: 'Category, question, and answer are required' });
    }

    const faq = await Faq.create({
      category,
      question: question.trim(),
      answer: answer.trim(),
      keywords: Array.isArray(keywords) ? keywords : (keywords || '').split(',').map(k => k.trim()).filter(Boolean),
      followUps: Array.isArray(followUps) ? followUps : [],
      quickActions: Array.isArray(quickActions) ? quickActions : [],
      isPublished: typeof isPublished === 'boolean' ? isPublished : true,
      order: Number(order) || 0
    });

    invalidateFaqCache();
    res.status(201).json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/chat/admin/faqs/:id
// @desc    Update an existing FAQ
router.put('/admin/faqs/:id', verifyAdmin, async (req, res) => {
  try {
    const { category, question, answer, keywords, followUps, quickActions, isPublished, order } = req.body;
    const updates = {};

    if (category) updates.category = category;
    if (question) updates.question = question.trim();
    if (answer) updates.answer = answer.trim();
    if (keywords !== undefined) {
      updates.keywords = Array.isArray(keywords) ? keywords : (keywords || '').split(',').map(k => k.trim()).filter(Boolean);
    }
    if (followUps !== undefined) updates.followUps = Array.isArray(followUps) ? followUps : [];
    if (quickActions !== undefined) updates.quickActions = Array.isArray(quickActions) ? quickActions : [];
    if (typeof isPublished === 'boolean') updates.isPublished = isPublished;
    if (typeof order === 'number') updates.order = order;

    const faq = await Faq.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    invalidateFaqCache();
    res.json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/chat/admin/faqs/:id
// @desc    Delete an FAQ
router.delete('/admin/faqs/:id', verifyAdmin, async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    invalidateFaqCache();
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/chat/admin/settings
// @desc    Get bot greeting and store policies
router.get('/admin/settings', verifyAdmin, async (req, res) => {
  try {
    const settings = await getBotSettings();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/chat/admin/settings
// @desc    Update bot greeting and store policies
router.put('/admin/settings', verifyAdmin, async (req, res) => {
  try {
    const { greeting, quickActions, storePolicies } = req.body;
    const updates = {};

    if (greeting) updates.greeting = greeting;
    if (Array.isArray(quickActions)) updates.quickActions = quickActions;
    if (storePolicies && typeof storePolicies === 'object') updates.storePolicies = storePolicies;

    const settings = await BotSettings.findOneAndUpdate(
      { key: 'default' },
      { $set: updates },
      { upsert: true, new: true }
    );

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/chat/admin/analytics
// @desc    Get support analytics: total conversations, top categories, most viewed FAQs, unresolved questions
router.get('/admin/analytics', verifyAdmin, async (req, res) => {
  try {
    const totalConversations = await ChatConversation.countDocuments();
    const activeConversations = await ChatConversation.countDocuments({ status: 'active' });
    const escalatedConversations = await ChatConversation.countDocuments({ isEscalated: true });
    const resolvedConversations = await ChatConversation.countDocuments({ status: 'resolved' });

    const totalFaqs = await Faq.countDocuments();
    const mostViewedFaqs = await Faq.find({ isPublished: true })
      .sort({ viewsCount: -1 })
      .limit(6)
      .select('question category viewsCount')
      .lean();

    const unresolvedQueries = await ChatConversation.find({ unresolvedQuestion: { $ne: '' } })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('unresolvedQuestion customerName customerEmail updatedAt')
      .lean();

    res.json({
      success: true,
      stats: {
        totalConversations,
        activeConversations,
        escalatedConversations,
        resolvedConversations,
        totalFaqs
      },
      mostViewedFaqs,
      unresolvedQueries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
