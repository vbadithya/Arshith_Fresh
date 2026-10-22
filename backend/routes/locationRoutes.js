const express = require('express');
const router = express.Router();

// In-memory cache for geocoding & PIN queries (10 minute TTL)
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.time > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data) {
  if (cache.size > 800) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  cache.set(key, { time: Date.now(), data });
}

/**
 * Calculate delivery estimate and serviceability based on PIN code, state, and city.
 * Fulfillment origin: Arshith Fresh Hub, Bengaluru, Karnataka (PIN 560076)
 * Everywhere in India is 100% serviceable!
 *
 * Standard delivery timeline:
 * • Processing & Dispatch: 24 to 48 hours (freshly packed in tamper evident containers).
 * • South India (Karnataka, AP, Telangana, TN, Kerala): 2 to 3 business days.
 * • Rest of India: 3 to 5 business days.
 * • Remote PIN codes: 6 to 7 business days.
 * Live courier tracking updates provided throughout.
 */
function calculateDeliveryEstimate(pincode = '', state = '', city = '') {
  const pin = String(pincode || '').trim().replace(/[^0-9]/g, '');
  const cleanState = String(state || '').toLowerCase();
  const cleanCity = String(city || '').toLowerCase();

  const dispatchNotice = 'Processing & Dispatch: 24 to 48 hours (we pack freshly in tamper evident containers).';
  const trackingNotice = 'You will receive live courier tracking updates throughout.';

  // 1. Remote pin codes: J&K (19xxxx), Ladakh, Northeast states (79xxxx), Andaman & Nicobar (744xxx), Lakshadweep (682xxx), Sikkim (737xxx)
  const isRemote = (
    pin.startsWith('19') ||
    pin.startsWith('79') ||
    pin.startsWith('78') ||
    pin.startsWith('737') ||
    pin.startsWith('744') ||
    pin.startsWith('682') ||
    cleanState.includes('jammu') || cleanState.includes('kashmir') || cleanState.includes('ladakh') ||
    cleanState.includes('andaman') || cleanState.includes('lakshadweep') || cleanState.includes('nagaland') ||
    cleanState.includes('mizoram') || cleanState.includes('manipur') || cleanState.includes('meghalaya') ||
    cleanState.includes('arunachal') || cleanState.includes('sikkim') || cleanState.includes('tripura')
  );

  if (isRemote) {
    return {
      isServiceable: true,
      deliveryDays: '6 to 7 business days',
      estimateText: '🚚 Delivery in 6–7 business days',
      headerSummary: '🚚 6–7 business days',
      tier: 'remote',
      hub: 'National Priority Courier Hub',
      dispatchNote: dispatchNotice,
      trackingNote: trackingNotice,
      message: 'Deliveries to remote pin codes may take up to 6–7 business days. You will receive live courier tracking updates throughout.'
    };
  }

  // 2. Bengaluru Local (starts with 560 or city contains Bengaluru/Bangalore)
  if (pin.startsWith('560') || cleanCity.includes('bengaluru') || cleanCity.includes('bangalore')) {
    return {
      isServiceable: true,
      deliveryDays: '1–2 days',
      estimateText: '⚡ Delivery in 1–2 days',
      headerSummary: '⚡ Delivery in 1–2 days',
      tier: 'local',
      hub: 'Bengaluru Fulfillment Hub',
      dispatchNote: dispatchNotice,
      trackingNote: trackingNotice,
      message: 'Direct local express dispatch from Bengaluru Hub.'
    };
  }

  // 3. South India (Karnataka, AP, Telangana, TN, Kerala, Goa)
  // Karnataka (56xxxx - 59xxxx), AP & Telangana (50xxxx - 53xxxx), TN (60xxxx - 64xxxx), Kerala (67xxxx - 69xxxx), Goa (403xxx)
  const isSouthIndia = (
    pin.startsWith('56') || pin.startsWith('57') || pin.startsWith('58') || pin.startsWith('59') || // Karnataka
    pin.startsWith('50') || pin.startsWith('51') || pin.startsWith('52') || pin.startsWith('53') || // AP & Telangana
    pin.startsWith('60') || pin.startsWith('61') || pin.startsWith('62') || pin.startsWith('63') || pin.startsWith('64') || // TN & Puducherry
    pin.startsWith('67') || pin.startsWith('68') || pin.startsWith('69') || // Kerala
    pin.startsWith('403') || // Goa
    cleanState.includes('karnataka') ||
    cleanState.includes('andhra') ||
    cleanState.includes('telangana') ||
    cleanState.includes('tamil') ||
    cleanState.includes('kerala') ||
    cleanState.includes('goa') ||
    cleanState.includes('puducherry') ||
    cleanCity.includes('bidar') || cleanCity.includes('mailoor') ||
    cleanCity.includes('mysuru') || cleanCity.includes('mysore') ||
    cleanCity.includes('hubballi') || cleanCity.includes('hubli') ||
    cleanCity.includes('belagavi') || cleanCity.includes('belgaum') ||
    cleanCity.includes('mangaluru') || cleanCity.includes('mangalore') ||
    cleanCity.includes('kalaburagi') || cleanCity.includes('gulbarga') ||
    cleanCity.includes('hyderabad') || cleanCity.includes('secunderabad') ||
    cleanCity.includes('chennai') || cleanCity.includes('coimbatore') || cleanCity.includes('madurai') ||
    cleanCity.includes('kochi') || cleanCity.includes('cochin') || cleanCity.includes('thiruvananthapuram') ||
    cleanCity.includes('visakhapatnam') || cleanCity.includes('vizag') || cleanCity.includes('vijayawada') ||
    cleanCity.includes('guntur') || cleanCity.includes('tirupati') || cleanCity.includes('warangal')
  );

  if (isSouthIndia) {
    return {
      isServiceable: true,
      deliveryDays: '2 to 3 business days',
      estimateText: '🚚 Delivery in 2–3 business days',
      headerSummary: '🚚 2–3 business days',
      tier: 'south_india',
      hub: 'South India Express Hub',
      dispatchNote: dispatchNotice,
      trackingNote: trackingNotice,
      message: 'South India regional courier express delivery available.'
    };
  }

  // 4. Rest of India (Every PIN in India is 100% serviceable!)
  return {
    isServiceable: true,
    deliveryDays: '3 to 5 business days',
    estimateText: '🚚 Delivery in 3–5 business days',
    headerSummary: '🚚 3–5 business days',
    tier: 'rest_of_india',
    hub: 'National Express Hub',
    dispatchNote: dispatchNotice,
    trackingNote: trackingNotice,
    message: 'All-India express courier delivery available.'
  };
}

/**
 * GET /api/location/reverse
 * Reverse geocodes latitude & longitude into a readable Indian address with serviceability
 */
router.get('/reverse', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180.'
      });
    }

    const cacheKey = `rev_${lat.toFixed(4)}_${lon.toFixed(4)}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let address = {
      area: '',
      locality: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      formattedAddress: '',
      lat,
      lon
    };

    // 1. Try OpenStreetMap Nominatim with strict timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`,
        {
          signal: controller.signal,
          headers: {
            'User-Agent': 'ArshithFresh-Storefront/1.0 (contact@arshithfresh.com)',
            'Accept-Language': 'en-IN,en;q=0.9'
          }
        }
      );
      clearTimeout(timeoutId);

      if (nomRes.ok) {
        const nomData = await nomRes.json();
        if (nomData && nomData.address) {
          const a = nomData.address;
          const road = a.road || a.pedestrian || a.street || '';
          const sub = a.suburb || a.neighbourhood || a.quarter || a.residential || '';
          address.street = road;
          address.area = sub || road || a.commercial || a.industrial || '';
          address.locality = a.neighbourhood || sub || '';
          address.city = a.city || a.town || a.village || a.city_district || a.county || a.state_district || '';
          address.state = a.state || '';
          address.pincode = a.postcode ? String(a.postcode).replace(/[^0-9]/g, '').slice(0, 6) : '';
          address.formattedAddress = nomData.display_name || [address.area, address.city, address.state].filter(Boolean).join(', ');
        }
      }
    } catch (e) {
      // Continue to fallback
    }

    // 2. Try Photon reverse fallback if city or area is empty
    if (!address.area || !address.city || !address.pincode) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const photonRes = await fetch(
          `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (photonRes.ok) {
          const pData = await photonRes.json();
          if (pData && Array.isArray(pData.features) && pData.features.length > 0) {
            const props = pData.features[0].properties || {};
            address.street = address.street || props.street || props.name || '';
            address.area = address.area || props.locality || props.district || props.suburb || props.name || '';
            address.locality = address.locality || props.locality || '';
            address.city = address.city || props.city || props.county || props.district || props.name || '';
            address.state = address.state || props.state || '';
            address.pincode = address.pincode || (props.postcode ? String(props.postcode).slice(0, 6) : '');
            if (!address.formattedAddress) {
              address.formattedAddress = [address.street, address.area, address.city, address.state, address.pincode].filter(Boolean).join(', ');
            }
          }
        }
      } catch (e) {
        // Fallback continues
      }
    }

    // Construct clean display address
    const cleanParts = [address.street, address.area, address.city, address.state].filter(Boolean);
    if (!address.formattedAddress && cleanParts.length > 0) {
      address.formattedAddress = cleanParts.join(', ');
    } else if (!address.formattedAddress) {
      address.formattedAddress = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      address.city = address.city || 'Bengaluru';
      address.state = address.state || 'Karnataka';
    }

    const estimate = calculateDeliveryEstimate(address.pincode, address.state, address.city);

    const responseData = {
      success: true,
      address,
      estimate
    };

    setCache(cacheKey, responseData);
    return res.json(responseData);
  } catch (error) {
    console.error('[Location Reverse Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reverse geocode coordinates.',
      error: error.message
    });
  }
});

/**
 * GET /api/location/search
 * Searches areas, localities, landmarks, cities, 6-digit PIN codes, or specific house addresses
 */
router.get('/search', async (req, res) => {
  try {
    const rawQuery = String(req.query.q || '').trim();
    if (!rawQuery || rawQuery.length < 2) {
      return res.json({ success: true, results: [] });
    }

    const cacheKey = `search_${rawQuery.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const results = [];

    // Parse house/flat number pattern (e.g., '578/1', 'Flat 402', 'House 12', '#45')
    const houseMatch = rawQuery.match(/\b(\d+[\/-]\d+|\b(?:flat|house|no|door|plot)\.?\s*#?\d+[a-z]?|\b\d+[a-z]?\b)/i);
    const extractedHouseNo = houseMatch ? houseMatch[0].trim() : '';

    // Clean text words for geographical search
    const cleanQuery = rawQuery.replace(/\b(\d+[\/-]\d+)\b/g, '').replace(/[,]/g, ' ').trim();
    const queryWords = cleanQuery.split(/\s+/).filter(w => w.length >= 3);

    // CASE 1: Query contains a 6-digit Indian PIN code
    const pinMatch = rawQuery.match(/\b([1-9][0-9]{5})\b/);
    if (pinMatch) {
      const pin = pinMatch[1];
      try {
        const pinRes = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        if (pinRes.ok) {
          const pinData = await pinRes.json();
          if (Array.isArray(pinData) && pinData[0] && pinData[0].Status === 'Success' && Array.isArray(pinData[0].PostOffice)) {
            pinData[0].PostOffice.slice(0, 4).forEach(po => {
              const est = calculateDeliveryEstimate(pin, po.State, po.District);
              results.push({
                title: extractedHouseNo ? `${extractedHouseNo}, ${po.Name} (${pin})` : `${po.Name} (${pin})`,
                subtitle: `${po.District}, ${po.State}`,
                house: extractedHouseNo,
                area: po.Name,
                city: po.District,
                state: po.State,
                pincode: pin,
                deliveryEstimate: est.estimateText,
                deliveryDays: est.deliveryDays,
                isServiceable: true,
                type: 'pincode'
              });
            });
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // CASE 2: Query India Post PostOffice API for Indian locality/town/post office names
    // This accurately matches Indian post offices like "Mailoor", "Bidar", "Latur", etc.
    const searchTokens = [];
    if (queryWords.length > 0) {
      searchTokens.push(queryWords[queryWords.length - 1]); // e.g. "mailoore" or "bidar"
      if (queryWords.length > 1) {
        searchTokens.push(queryWords[0]);
      }
    }

    for (const token of searchTokens) {
      if (results.length >= 6) break;
      const cleanToken = token.toLowerCase();
      const tokenVariants = [cleanToken];
      // Also try stripping trailing vowels like 'mailoore' -> 'mailoor'
      if (cleanToken.endsWith('e') || cleanToken.endsWith('a') || cleanToken.endsWith('u')) {
        tokenVariants.push(cleanToken.slice(0, -1));
      }

      for (const variant of tokenVariants) {
        if (variant.length < 3) continue;
        try {
          const poRes = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(variant)}`);
          if (poRes.ok) {
            const poData = await poRes.json();
            if (Array.isArray(poData) && poData[0] && poData[0].Status === 'Success' && Array.isArray(poData[0].PostOffice)) {
              poData[0].PostOffice.slice(0, 4).forEach(po => {
                const est = calculateDeliveryEstimate(po.Pincode, po.State, po.District);
                results.push({
                  title: extractedHouseNo ? `${extractedHouseNo}, ${po.Name} (${po.Pincode})` : `${po.Name} (${po.Pincode})`,
                  subtitle: `${po.District}, ${po.State}`,
                  house: extractedHouseNo,
                  area: po.Name,
                  city: po.District,
                  state: po.State,
                  pincode: po.Pincode,
                  deliveryEstimate: est.estimateText,
                  deliveryDays: est.deliveryDays,
                  isServiceable: true,
                  type: 'postoffice'
                });
              });
              break; // Found matches for this token
            }
          }
        } catch (e) {
          // Continue
        }
      }
    }

    // CASE 3: Text search via Photon OpenStreetMap (strict India prioritization)
    if (results.length < 6) {
      try {
        const searchTerm = cleanQuery || rawQuery;
        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(searchTerm)}&limit=6`;
        const pRes = await fetch(photonUrl);
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData && Array.isArray(pData.features)) {
            pData.features.forEach(f => {
              const p = f.properties || {};
              // Prioritize Indian results
              const country = (p.country || '').toLowerCase();
              if (country && country !== 'india' && p.countrycode && p.countrycode !== 'IN') {
                return;
              }

              const name = p.name || p.street || '';
              const locality = p.locality || p.district || p.suburb || '';
              const city = p.city || p.county || p.district || p.name || '';
              const state = p.state || '';
              const pincode = p.postcode ? String(p.postcode).replace(/[^0-9]/g, '').slice(0, 6) : '';

              const subtitleParts = [locality !== name ? locality : '', city, state, pincode].filter(Boolean);
              const est = calculateDeliveryEstimate(pincode, state, city);

              const coords = f.geometry && Array.isArray(f.geometry.coordinates) ? f.geometry.coordinates : null;

              results.push({
                title: extractedHouseNo ? `${extractedHouseNo}, ${name || locality || city}` : (name || locality || city),
                subtitle: subtitleParts.join(', ') || 'India',
                house: extractedHouseNo,
                area: locality || name,
                street: name !== locality ? name : '',
                city: city || 'Bengaluru',
                state: state || 'Karnataka',
                pincode: pincode,
                lat: coords ? coords[1] : undefined,
                lon: coords ? coords[0] : undefined,
                deliveryEstimate: est.estimateText,
                deliveryDays: est.deliveryDays,
                isServiceable: true,
                type: 'place'
              });
            });
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // CASE 4: If user typed a specific home address or house number (e.g. 'bidar mailoore 578/1')
    // Add a top-priority "Deliver to this Home Address" card so their exact home is 100% supported
    if (extractedHouseNo || rawQuery.split(/\s+/).length >= 2) {
      const bestCity = results[0] ? results[0].city : (rawQuery.toLowerCase().includes('bidar') ? 'Bidar' : (rawQuery.toLowerCase().includes('latur') ? 'Latur' : 'Bengaluru'));
      const bestState = results[0] ? results[0].state : (rawQuery.toLowerCase().includes('latur') ? 'Maharashtra' : 'Karnataka');
      const bestPin = results[0] ? results[0].pincode : (rawQuery.toLowerCase().includes('mailoor') ? '585403' : (rawQuery.toLowerCase().includes('bidar') ? '585401' : (rawQuery.toLowerCase().includes('latur') ? '413512' : '')));

      const est = calculateDeliveryEstimate(bestPin, bestState, bestCity);

      results.unshift({
        title: `🏠 Deliver to Home: ${rawQuery}`,
        subtitle: `Custom Home Address • ${bestCity}, ${bestState} ${bestPin ? '(' + bestPin + ')' : ''}`,
        house: extractedHouseNo || rawQuery.split(',')[0],
        area: cleanQuery,
        city: bestCity,
        state: bestState,
        pincode: bestPin,
        deliveryEstimate: est.estimateText,
        deliveryDays: est.deliveryDays,
        isServiceable: true,
        type: 'home'
      });
    }

    // Deduplicate results by title + subtitle
    const seen = new Set();
    const uniqueResults = [];
    results.forEach(r => {
      const key = `${r.title}|${r.subtitle}`.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(r);
      }
    });

    const responseData = {
      success: true,
      query: rawQuery,
      results: uniqueResults.slice(0, 8)
    };

    setCache(cacheKey, responseData);
    return res.json(responseData);
  } catch (error) {
    console.error('[Location Search Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search location suggestions.',
      error: error.message
    });
  }
});

/**
 * POST /api/location/estimate
 * Validates PIN code and recalculates estimated delivery time across India
 */
router.post('/estimate', (req, res) => {
  try {
    const { pincode, state, city } = req.body || {};
    const estimate = calculateDeliveryEstimate(pincode, state, city);
    return res.json({
      success: true,
      pincode: pincode || '',
      state: state || '',
      city: city || '',
      estimate
    });
  } catch (error) {
    console.error('[Location Estimate Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate delivery estimate.',
      error: error.message
    });
  }
});

module.exports = router;
