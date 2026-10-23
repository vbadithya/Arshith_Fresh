const express = require('express');
const router = express.Router();
const DeliverySettings = require('../models/DeliverySettings');

const DEFAULT_SETTINGS = {
  key: 'default',
  isFreeShippingForAll: false,
  freeShippingThreshold: 2000,
  bangaloreCharge: 50,
  southIndiaTier1Charge: 145,
  southIndiaTier2Threshold: 1000,
  southIndiaTier2Charge: 100,
  restOfIndiaCharge: 150,
  southIndiaStates: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala'],
  bangalorePincodes: ['560'],
  standardCharge: 50,
  enableMidTier: true,
  midTierThreshold: 1000,
  midTierCharge: 100,
  estimatedDeliveryDays: '3 to 5 business days',
  bannerMessage: 'FREE Delivery on all orders above ₹2,000'
};

// Helper to get or create settings
async function getOrCreateDeliverySettings() {
  let settings = await DeliverySettings.findOne({ key: 'default' });
  if (!settings) {
    settings = await DeliverySettings.create(DEFAULT_SETTINGS);
  }
  return settings;
}

// Helper to calculate delivery fee based on subtotal and customer location
function calculateDeliveryFee(subtotal, location = {}, settings) {
  if (!subtotal || subtotal <= 0) {
    return { charge: 0, region: 'None', reason: 'Zero cart subtotal' };
  }
  
  if (settings.isFreeShippingForAll) {
    return { charge: 0, region: 'Free for All', reason: '100% Free delivery active storewide' };
  }

  const freeThreshold = Number(settings.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : 2000);
  if (subtotal >= freeThreshold) {
    return { 
      charge: 0, 
      region: 'All India', 
      reason: `Order of ₹${subtotal.toLocaleString('en-IN')} qualifies for FREE Delivery (above ₹${freeThreshold.toLocaleString('en-IN')})` 
    };
  }

  const city = String(location.city || '').trim().toLowerCase();
  const state = String(location.state || '').trim().toLowerCase();
  const pincode = String(location.pincode || location.pinCode || location.postalCode || '').trim();

  // 1. Check Bangalore
  const isBangaloreCity = city.includes('bangalore') || city.includes('bengaluru');
  const bangalorePincodes = Array.isArray(settings.bangalorePincodes) ? settings.bangalorePincodes : ['560'];
  const isBangalorePincode = bangalorePincodes.some(prefix => prefix && pincode.startsWith(prefix));
  if (isBangaloreCity || isBangalorePincode) {
    const charge = Number(settings.bangaloreCharge !== undefined ? settings.bangaloreCharge : 50);
    return { charge, region: 'Bangalore', reason: `Flat ₹${charge} delivery fee for Bangalore` };
  }

  // 2. Check South India (Tamil Nadu, Andhra Pradesh, Telangana, Karnataka outside Bangalore, Kerala)
  const southStates = (Array.isArray(settings.southIndiaStates) ? settings.southIndiaStates : ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala'])
    .map(s => String(s).trim().toLowerCase());
  const isSouthIndia = southStates.some(s => s && (state.includes(s) || s.includes(state))) ||
    city.includes('chennai') || city.includes('hyderabad') || city.includes('mysore') || city.includes('kochi') || city.includes('visakhapatnam') || city.includes('vijayawada');

  if (isSouthIndia) {
    const tier2Threshold = Number(settings.southIndiaTier2Threshold !== undefined ? settings.southIndiaTier2Threshold : 1000);
    if (subtotal >= tier2Threshold) {
      const charge = Number(settings.southIndiaTier2Charge !== undefined ? settings.southIndiaTier2Charge : 100);
      return { 
        charge, 
        region: 'South India', 
        reason: `₹${charge} delivery fee for South India orders (₹${tier2Threshold} - ₹${freeThreshold - 1})` 
      };
    } else {
      const charge = Number(settings.southIndiaTier1Charge !== undefined ? settings.southIndiaTier1Charge : 145);
      return { 
        charge, 
        region: 'South India', 
        reason: `₹${charge} delivery fee for South India orders (under ₹${tier2Threshold})` 
      };
    }
  }

  // 3. Rest of India
  const charge = Number(settings.restOfIndiaCharge !== undefined ? settings.restOfIndiaCharge : 150);
  return { charge, region: 'Rest of India', reason: `Flat ₹${charge} delivery fee for Rest of India` };
}

// @route   GET /api/settings/delivery
// @desc    Get active delivery fee configuration
router.get('/', async (req, res) => {
  try {
    const settings = await getOrCreateDeliverySettings();
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching delivery settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve delivery settings',
      settings: DEFAULT_SETTINGS
    });
  }
});

// @route   PUT /api/settings/delivery
// @desc    Update delivery fee configuration
router.put('/', async (req, res) => {
  try {
    const {
      isFreeShippingForAll,
      freeShippingThreshold,
      bangaloreCharge,
      southIndiaTier1Charge,
      southIndiaTier2Threshold,
      southIndiaTier2Charge,
      restOfIndiaCharge,
      southIndiaStates,
      bangalorePincodes,
      standardCharge,
      enableMidTier,
      midTierThreshold,
      midTierCharge,
      estimatedDeliveryDays,
      bannerMessage
    } = req.body;

    const updates = {};
    if (typeof isFreeShippingForAll === 'boolean') updates.isFreeShippingForAll = isFreeShippingForAll;
    if (freeShippingThreshold !== undefined) updates.freeShippingThreshold = Math.max(0, Number(freeShippingThreshold) || 0);
    
    // Bangalore
    if (bangaloreCharge !== undefined) updates.bangaloreCharge = Math.max(0, Number(bangaloreCharge) || 0);

    // South India
    if (southIndiaTier1Charge !== undefined) updates.southIndiaTier1Charge = Math.max(0, Number(southIndiaTier1Charge) || 0);
    if (southIndiaTier2Threshold !== undefined) updates.southIndiaTier2Threshold = Math.max(0, Number(southIndiaTier2Threshold) || 0);
    if (southIndiaTier2Charge !== undefined) updates.southIndiaTier2Charge = Math.max(0, Number(southIndiaTier2Charge) || 0);

    // Rest of India
    if (restOfIndiaCharge !== undefined) updates.restOfIndiaCharge = Math.max(0, Number(restOfIndiaCharge) || 0);

    // Regions
    if (Array.isArray(southIndiaStates)) {
      updates.southIndiaStates = southIndiaStates.map(s => String(s).trim()).filter(Boolean);
    } else if (typeof southIndiaStates === 'string') {
      updates.southIndiaStates = southIndiaStates.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (Array.isArray(bangalorePincodes)) {
      updates.bangalorePincodes = bangalorePincodes.map(p => String(p).trim()).filter(Boolean);
    } else if (typeof bangalorePincodes === 'string') {
      updates.bangalorePincodes = bangalorePincodes.split(',').map(p => p.trim()).filter(Boolean);
    }

    // Sync legacy fields
    updates.standardCharge = updates.bangaloreCharge !== undefined ? updates.bangaloreCharge : (standardCharge !== undefined ? Number(standardCharge) : 50);
    if (typeof enableMidTier === 'boolean') updates.enableMidTier = enableMidTier;
    updates.midTierThreshold = updates.southIndiaTier2Threshold !== undefined ? updates.southIndiaTier2Threshold : (midTierThreshold !== undefined ? Number(midTierThreshold) : 1000);
    updates.midTierCharge = updates.southIndiaTier2Charge !== undefined ? updates.southIndiaTier2Charge : (midTierCharge !== undefined ? Number(midTierCharge) : 100);

    if (typeof estimatedDeliveryDays === 'string') updates.estimatedDeliveryDays = estimatedDeliveryDays.trim();
    if (typeof bannerMessage === 'string') updates.bannerMessage = bannerMessage.trim();

    const settings = await DeliverySettings.findOneAndUpdate(
      { key: 'default' },
      { $set: updates },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('✅ [Delivery Settings Updated Live]', {
      freeShippingThreshold: settings.freeShippingThreshold,
      bangaloreCharge: settings.bangaloreCharge,
      southIndiaTier1Charge: settings.southIndiaTier1Charge,
      southIndiaTier2Charge: settings.southIndiaTier2Charge,
      restOfIndiaCharge: settings.restOfIndiaCharge
    });

    res.json({
      success: true,
      message: 'Delivery settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating delivery settings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update delivery settings'
    });
  }
});

// @route   POST /api/settings/delivery/reset
// @desc    Reset delivery settings to default values
router.post('/reset', async (req, res) => {
  try {
    const settings = await DeliverySettings.findOneAndUpdate(
      { key: 'default' },
      { $set: DEFAULT_SETTINGS },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Delivery settings reset to default values',
      settings
    });
  } catch (error) {
    console.error('Error resetting delivery settings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset delivery settings'
    });
  }
});

// @route   GET /api/settings/delivery/calculate
// @desc    Calculate delivery charge for a given subtotal and optional customer location
router.get('/calculate', async (req, res) => {
  try {
    const subtotal = Math.max(0, parseFloat(req.query.subtotal) || 0);
    const city = req.query.city || '';
    const state = req.query.state || '';
    const pincode = req.query.pincode || req.query.postalCode || req.query.pinCode || '';

    const settings = await getOrCreateDeliverySettings();
    const result = calculateDeliveryFee(subtotal, { city, state, pincode }, settings);

    res.json({
      success: true,
      subtotal,
      deliveryCharge: result.charge,
      region: result.region,
      reason: result.reason,
      total: subtotal + result.charge,
      isFree: result.charge === 0,
      settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
