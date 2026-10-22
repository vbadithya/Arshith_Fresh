/**
 * ARSHITH FRESH — LOCATION DETECTION & GPS INTEGRATION
 * Features:
 *  - Instamart-style header delivery estimate & location badge
 *  - High-accuracy GPS geolocation with graceful permission/error fallbacks
 *  - Real-time address suggestions (Photon OSM & India Post PIN API)
 *  - Address details review & confirmation modal
 *  - 6-digit Indian postal PIN code validation & live estimate recalculation
 *  - LocalStorage persistence & multi-page synchronization
 *  - Logged-in user saved addresses integration
 *  - Checkout page pre-fill sync
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'arshith_delivery_location';
    const DEFAULT_LOCATION = {
        house: '',
        street: '',
        landmark: '',
        area: 'HSR Layout',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560102',
        deliveryDays: '1–2 days',
        estimateText: '⚡ Delivery in 1–2 days',
        headerSummary: '⚡ Delivery in 1–2 days',
        formattedAddress: 'HSR Layout, Bengaluru, Karnataka - 560102',
        shortDisplay: 'HSR Layout, Bengaluru',
        isServiceable: true,
        lat: 12.9116,
        lon: 77.6389,
        isDefault: true
    };

    function getApiBase() {
        if (typeof window.getApiHost === 'function') {
            return window.getApiHost();
        }
        if (window.location && window.location.origin) {
            const origin = window.location.origin;
            if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
                return 'http://localhost:5000';
            }
            if (origin.startsWith('http://') || origin.startsWith('https://')) {
                return origin;
            }
        }
        return 'http://localhost:5000';
    }

    // Current in-memory working state during modal interaction
    let currentTempAddress = null;
    let searchDebounceTimer = null;

    /**
     * Get persisted location from localStorage or default
     */
    function getSavedLocation() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && (parsed.pincode || parsed.city)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error('[Location] Failed to read saved location:', e);
        }
        return DEFAULT_LOCATION;
    }

    /**
     * Persist location to localStorage
     */
    function saveLocation(loc) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
            window.dispatchEvent(new CustomEvent('arshith:locationChanged', { detail: loc }));
        } catch (e) {
            console.error('[Location] Failed to save location:', e);
        }
    }

    /**
     * Updates header location badge UI
     */
    function updateHeaderUI(loc) {
        const timeEl = document.getElementById('headerLocDeliveryTime');
        const addrEl = document.getElementById('headerLocAddressText');

        if (timeEl) {
            timeEl.textContent = loc.headerSummary || loc.estimateText || '⚡ Delivery in 1–2 days';
        }

        if (addrEl) {
            let display = loc.shortDisplay || '';
            if (!display) {
                if (loc.area && loc.city) {
                    display = `${loc.area}, ${loc.city}`;
                } else if (loc.city && loc.state) {
                    display = `${loc.city}, ${loc.state}`;
                } else {
                    display = loc.formattedAddress || 'Bengaluru, Karnataka';
                }
            }
            // Strip trailing pincode or country if present
            display = display.replace(/ - \d{6}$/, '').replace(/, India$/, '');
            addrEl.textContent = display;
            addrEl.title = loc.formattedAddress || display;
        }
    }

    /**
     * Injects Header Location Selector Badge into .header-container
     */
    function injectHeaderBadge() {
        if (document.getElementById('headerLocationBtn')) return;

        const headerContainer = document.querySelector('.header-container');
        if (!headerContainer) return;

        const logo = headerContainer.querySelector('.header-logo');
        const badge = document.createElement('div');
        badge.id = 'headerLocationBtn';
        badge.className = 'header-location-selector';
        badge.setAttribute('role', 'button');
        badge.setAttribute('tabindex', '0');
        badge.setAttribute('aria-label', 'Change delivery location');
        badge.title = 'Click to change your delivery location';

        badge.innerHTML = `
            <div class="header-loc-pin-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
            </div>
            <div class="header-loc-content">
                <span class="header-loc-title" id="headerLocDeliveryTime">⚡ Delivery in 1–2 days</span>
                <span class="header-loc-desc">
                    <span class="header-loc-address-text" id="headerLocAddressText">Bengaluru, Karnataka</span>
                    <svg class="header-loc-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </div>
        `;

        badge.addEventListener('click', openModal);
        badge.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
            }
        });

        positionHeaderBadge(badge, headerContainer);
        window.addEventListener('resize', () => {
            const b = document.getElementById('headerLocationBtn');
            const h = document.querySelector('.header-container');
            if (b && h) positionHeaderBadge(b, h);
        });

        // Initialize display with saved location
        updateHeaderUI(getSavedLocation());
    }

    /**
     * Positions badge beside 'Become a Seller' (and beside Arshith logo) on desktop,
     * or as full-width row in header-container on mobile.
     */
    function positionHeaderBadge(badge, headerContainer) {
        if (!badge || !headerContainer) return;
        const navLinks = headerContainer.querySelector('.nav-links');

        if (window.innerWidth >= 992 && navLinks) {
            // Desktop: Place as 4th item in nav-links directly beside Become a Seller
            let li = document.getElementById('navLocationLi');
            if (!li) {
                li = document.createElement('li');
                li.id = 'navLocationLi';
                li.className = 'nav-location-item';
                navLinks.appendChild(li);
            }
            if (badge.parentElement !== li) {
                li.appendChild(badge);
            }
        } else {
            // Mobile: Place in headerContainer as full-width row
            const li = document.getElementById('navLocationLi');
            if (li) li.remove();
            if (badge.parentElement !== headerContainer) {
                headerContainer.appendChild(badge);
            }
        }
    }

    /**
     * Injects the complete Location Modal DOM into document.body
     */
    function injectModalDOM() {
        if (document.getElementById('arshithLocationBackdrop')) return;

        const backdrop = document.createElement('div');
        backdrop.id = 'arshithLocationBackdrop';
        backdrop.className = 'arshith-loc-backdrop';
        backdrop.setAttribute('role', 'dialog');
        backdrop.setAttribute('aria-modal', 'true');
        backdrop.setAttribute('aria-labelledby', 'locModalTitle');

        backdrop.innerHTML = `
            <div class="arshith-loc-modal">
                <!-- Modal Header -->
                <div class="arshith-loc-header">
                    <div>
                        <h3 class="arshith-loc-header-title" id="locModalTitle">Select Delivery Location</h3>
                        <p class="arshith-loc-header-sub">Check real-time delivery estimates and serviceability</p>
                    </div>
                    <button type="button" class="arshith-loc-close-btn" id="locCloseBtn" aria-label="Close location selector">&times;</button>
                </div>

                <!-- Modal Body -->
                <div class="arshith-loc-body">
                    
                    <!-- Alert / Status Notice Banner -->
                    <div id="locAlertBanner" class="arshith-loc-alert" style="display: none;"></div>

                    <!-- STEP 1: Search & GPS Screen -->
                    <div id="locStepSearch">
                        <!-- Search Box -->
                        <div class="arshith-loc-search-box">
                            <svg class="arshith-loc-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input type="text" id="locSearchInput" class="arshith-loc-search-input" placeholder="Search area, locality, city or 6-digit PIN code..." autocomplete="off">
                            <button type="button" id="locClearSearchBtn" class="arshith-loc-clear-btn" aria-label="Clear search">&times;</button>
                        </div>

                        <!-- Live Search Suggestions Dropdown -->
                        <div id="locSuggestionsList" class="arshith-loc-suggestions" style="display: none; margin-top: 8px;"></div>

                        <!-- "Use Current Location" GPS Card -->
                        <div id="useCurrentLocBtn" class="arshith-loc-gps-card" role="button" tabindex="0" style="margin-top: 14px;">
                            <div class="arshith-loc-gps-icon-box" id="locGpsIconBox">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2"></polygon>
                                </svg>
                            </div>
                            <div class="arshith-loc-gps-details">
                                <div class="arshith-loc-gps-title" id="locGpsTitle">
                                    <span>Use Current Location</span>
                                </div>
                                <div class="arshith-loc-gps-sub" id="locGpsSub">
                                    Using GPS for instant & accurate address detection
                                </div>
                            </div>
                        </div>

                        <!-- Saved Addresses Row (if logged in) -->
                        <div id="locSavedSection" class="arshith-loc-saved-section" style="display: none; margin-top: 16px;">
                            <div class="arshith-loc-saved-title">Your Saved Addresses</div>
                            <div id="locSavedChips" class="arshith-loc-saved-chips"></div>
                        </div>

                        <!-- Standard Delivery Timeline Card -->
                        <div class="arshith-loc-timeline-card">
                            <div class="arshith-loc-timeline-title">Standard delivery timeline:</div>
                            
                            <div class="arshith-loc-dispatch-box">
                                <span class="arshith-loc-bullet-dot"></span>
                                <div class="arshith-loc-dispatch-text">
                                    <strong>Processing &amp; Dispatch: 24 to 48 hours</strong> (we pack freshly in <span class="arshith-loc-green-highlight">evident containers).</span>
                                </div>
                            </div>

                            <ul class="arshith-loc-timeline-list">
                                <li>
                                    <span class="arshith-loc-bullet-dot"></span>
                                    <span><strong>South India (Karnataka, AP, Telangana, TN, Kerala):</strong> 2 to 3 business days.</span>
                                </li>
                                <li>
                                    <span class="arshith-loc-bullet-dot"></span>
                                    <span><strong>Rest of India:</strong> 3 to 5 business days.</span>
                                </li>
                            </ul>

                            <p class="arshith-loc-remote-notice">
                                Deliveries to remote pin codes may take up to 6–7 business days. You will receive live courier tracking updates throughout.
                            </p>

                            <div class="arshith-loc-check-btn-wrap">
                                <button type="button" class="arshith-loc-check-chip-btn" id="locTimelineCheckBtn">
                                    Do you deliver to my location?
                                </button>
                            </div>

                            <div id="locTimelineFeedback" class="arshith-loc-timeline-feedback" style="display: none;">
                                <span class="loc-feedback-badge">✅ 100% Pan-India Serviceable</span>
                                <p>Yes, we deliver across all pin codes in India! Use GPS above or search your area / 6-digit PIN code to view your delivery estimate.</p>
                            </div>
                        </div>
                    </div>

                    <!-- STEP 2: Address Confirmation & Editing Screen -->
                    <div id="locStepConfirm" class="arshith-loc-confirm-panel" style="display: none;">
                        
                        <!-- Estimated Delivery Badge -->
                        <div class="arshith-loc-estimate-badge-box" id="locEstBadgeBox">
                            <div>
                                <div class="arshith-loc-est-tag" id="locEstTag">⚡ Delivery in 1–2 days</div>
                                <div class="arshith-loc-est-sub" id="locEstSub">Direct local dispatch from Bengaluru Hub</div>
                            </div>
                            <div id="locEstHubBadge" style="font-size: 11px; background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 6px; font-weight: 700;">
                                Arshith Fresh
                            </div>
                        </div>

                        <!-- Compact Timeline Recap inside Confirmation Screen -->
                        <div class="arshith-loc-confirm-timeline-info">
                            <div class="confirm-timeline-item">
                                <span class="confirm-dot"></span>
                                <span><strong>Processing &amp; Dispatch: 24 to 48 hrs</strong> freshly packed in tamper evident containers</span>
                            </div>
                            <div class="confirm-timeline-item">
                                <span class="confirm-dot"></span>
                                <span><strong>Live Tracking:</strong> Real-time courier updates provided via SMS &amp; WhatsApp</span>
                            </div>
                        </div>

                        <!-- Address Form Fields -->
                        <div class="arshith-loc-form-grid">
                            <div class="arshith-loc-field">
                                <label class="arshith-loc-label" for="locHouseInput">Flat / House No. / Building</label>
                                <input type="text" id="locHouseInput" class="arshith-loc-input" placeholder="e.g. Flat 304, Green Heights">
                            </div>
                            <div class="arshith-loc-field">
                                <label class="arshith-loc-label" for="locStreetInput">Street / Road / Lane</label>
                                <input type="text" id="locStreetInput" class="arshith-loc-input" placeholder="e.g. 17th Cross, 5th Main">
                            </div>
                            <div class="arshith-loc-field full">
                                <label class="arshith-loc-label" for="locLandmarkInput">Landmark (Optional)</label>
                                <input type="text" id="locLandmarkInput" class="arshith-loc-input" placeholder="e.g. Near BDA Complex / Opposite Metro">
                            </div>
                            <div class="arshith-loc-field">
                                <label class="arshith-loc-label" for="locAreaInput">Area / Locality <span class="req">*</span></label>
                                <input type="text" id="locAreaInput" class="arshith-loc-input" placeholder="e.g. HSR Layout Sector 4" required>
                            </div>
                            <div class="arshith-loc-field">
                                <label class="arshith-loc-label" for="locCityInput">City <span class="req">*</span></label>
                                <input type="text" id="locCityInput" class="arshith-loc-input" placeholder="e.g. Bengaluru" required>
                            </div>
                            <div class="arshith-loc-field">
                                <label class="arshith-loc-label" for="locStateInput">State <span class="req">*</span></label>
                                <input type="text" id="locStateInput" class="arshith-loc-input" placeholder="e.g. Karnataka" required>
                            </div>
                            <div class="arshith-loc-field">
                                <label class="arshith-loc-label" for="locPinInput">6-Digit PIN Code <span class="req">*</span></label>
                                <input type="text" id="locPinInput" class="arshith-loc-input" placeholder="e.g. 560102" maxlength="6" inputmode="numeric" required>
                                <div id="locPinErrorMsg" class="arshith-loc-error-msg" style="display: none;">
                                    Please enter a valid 6-digit Indian PIN code.
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="arshith-loc-actions">
                            <button type="button" class="arshith-loc-btn-secondary" id="locBackToSearchBtn">
                                ← Change Location
                            </button>
                            <button type="button" class="arshith-loc-btn-primary" id="locConfirmSaveBtn">
                                Confirm & Save Location
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;

        document.body.appendChild(backdrop);
        bindModalEvents();
    }

    /**
     * Binds all UI events inside the modal
     */
    function bindModalEvents() {
        const backdrop = document.getElementById('arshithLocationBackdrop');
        const closeBtn = document.getElementById('locCloseBtn');
        const searchInput = document.getElementById('locSearchInput');
        const clearBtn = document.getElementById('locClearSearchBtn');
        const useGpsBtn = document.getElementById('useCurrentLocBtn');
        const backBtn = document.getElementById('locBackToSearchBtn');
        const confirmBtn = document.getElementById('locConfirmSaveBtn');
        const pinInput = document.getElementById('locPinInput');

        // Close modal handlers
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && backdrop.classList.contains('active')) {
                closeModal();
            }
        });

        // Search input events
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                clearBtn.classList.add('visible');
            } else {
                clearBtn.classList.remove('visible');
            }

            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                handleLocationSearch(query);
            }, 280);
        });

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.classList.remove('visible');
            hideSuggestions();
            searchInput.focus();
        });

        // Use Current Location GPS handler
        useGpsBtn.addEventListener('click', handleUseCurrentLocation);
        useGpsBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleUseCurrentLocation();
            }
        });

        // Back to search
        backBtn.addEventListener('click', () => {
            showSearchStep();
        });

        // Confirm & Save
        confirmBtn.addEventListener('click', handleConfirmAndSave);

        // PIN code real-time estimate recalculation & validation
        pinInput.addEventListener('input', (e) => {
            // Numbers only
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
            const pin = e.target.value;
            const errEl = document.getElementById('locPinErrorMsg');

            if (pin.length === 6) {
                if (/^[1-9][0-9]{5}$/.test(pin)) {
                    pinInput.classList.remove('error');
                    if (errEl) errEl.style.display = 'none';
                    recalculateEstimateForPin(pin);
                } else {
                    pinInput.classList.add('error');
                    if (errEl) {
                        errEl.textContent = 'Invalid Indian PIN code (cannot start with 0).';
                        errEl.style.display = 'block';
                    }
                }
            } else {
                pinInput.classList.remove('error');
                if (errEl) errEl.style.display = 'none';
            }
        });

        // "Do you deliver to my location?" chip button handler
        const timelineCheckBtn = document.getElementById('locTimelineCheckBtn');
        const timelineFeedback = document.getElementById('locTimelineFeedback');
        if (timelineCheckBtn && timelineFeedback) {
            timelineCheckBtn.addEventListener('click', () => {
                timelineFeedback.style.display = 'block';
                if (searchInput) {
                    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    searchInput.focus();
                    searchInput.classList.add('pulse-focus');
                    setTimeout(() => searchInput.classList.remove('pulse-focus'), 1200);
                }
            });
        }
    }

    /**
     * Opens Location Modal
     */
    function openModal() {
        injectModalDOM();
        const backdrop = document.getElementById('arshithLocationBackdrop');
        if (!backdrop) return;

        // Reset views
        hideAlert();
        showSearchStep();
        renderSavedAddressChips();

        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            const searchInput = document.getElementById('locSearchInput');
            if (searchInput) searchInput.focus();
        }, 150);
    }

    /**
     * Closes Location Modal
     */
    function closeModal() {
        const backdrop = document.getElementById('arshithLocationBackdrop');
        if (!backdrop) return;

        backdrop.classList.remove('active');
        document.body.style.overflow = '';
        hideSuggestions();
    }

    /**
     * Switches to Search & GPS Step (Step 1)
     */
    function showSearchStep() {
        const stepSearch = document.getElementById('locStepSearch');
        const stepConfirm = document.getElementById('locStepConfirm');
        const modalTitle = document.getElementById('locModalTitle');

        if (stepSearch) stepSearch.style.display = 'block';
        if (stepConfirm) stepConfirm.style.display = 'none';
        if (modalTitle) modalTitle.textContent = 'Select Delivery Location';
    }

    /**
     * Switches to Confirmation & Review Step (Step 2)
     */
    function showConfirmStep(addrData) {
        const stepSearch = document.getElementById('locStepSearch');
        const stepConfirm = document.getElementById('locStepConfirm');
        const modalTitle = document.getElementById('locModalTitle');

        if (stepSearch) stepSearch.style.display = 'none';
        if (stepConfirm) stepConfirm.style.display = 'flex';
        if (modalTitle) modalTitle.textContent = 'Confirm Delivery Address';

        currentTempAddress = addrData;

        // Fill form fields
        document.getElementById('locHouseInput').value = addrData.house || '';
        document.getElementById('locStreetInput').value = addrData.street || '';
        document.getElementById('locLandmarkInput').value = addrData.landmark || '';
        document.getElementById('locAreaInput').value = addrData.area || '';
        document.getElementById('locCityInput').value = addrData.city || 'Bengaluru';
        document.getElementById('locStateInput').value = addrData.state || 'Karnataka';
        document.getElementById('locPinInput').value = addrData.pincode || '';

        // Update estimate badge
        updateEstimateBadge(addrData.estimate || {
            isServiceable: true,
            deliveryDays: addrData.deliveryDays || '1–2 days',
            estimateText: addrData.estimateText || '⚡ Delivery in 1–2 days',
            message: 'Direct local express dispatch available.'
        });
    }

    /**
     * Updates the delivery estimate badge inside Step 2
     */
    function updateEstimateBadge(est) {
        const tagEl = document.getElementById('locEstTag');
        const subEl = document.getElementById('locEstSub');
        const boxEl = document.getElementById('locEstBadgeBox');
        const confirmBtn = document.getElementById('locConfirmSaveBtn');

        if (!tagEl || !subEl || !boxEl) return;

        if (est.isServiceable) {
            boxEl.style.background = '#ecfdf5';
            boxEl.style.borderColor = '#6ee7b7';
            tagEl.style.color = '#065f46';
            tagEl.innerHTML = est.estimateText || '⚡ Delivery in 1–2 days';
            subEl.textContent = est.message || 'Direct express delivery available from ArshithFresh Hub.';
            if (confirmBtn) {
                confirmBtn.removeAttribute('disabled');
                confirmBtn.style.opacity = '1';
                confirmBtn.style.pointerEvents = 'auto';
            }
        } else {
            boxEl.style.background = '#fef2f2';
            boxEl.style.borderColor = '#fecaca';
            tagEl.style.color = '#991b1b';
            tagEl.innerHTML = '⚠️ Currently Not Serviceable';
            subEl.textContent = est.message || 'Delivery is currently not available for this location.';
            if (confirmBtn) {
                confirmBtn.setAttribute('disabled', 'true');
                confirmBtn.style.opacity = '0.6';
                confirmBtn.style.pointerEvents = 'none';
            }
        }
    }

    /**
     * Recalculate estimate when PIN is changed
     */
    async function recalculateEstimateForPin(pin) {
        const state = document.getElementById('locStateInput').value;
        const city = document.getElementById('locCityInput').value;

        try {
            const res = await fetch(`${getApiBase()}/api/location/estimate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pincode: pin, state, city })
            });
            const data = await res.json();
            if (data && data.success && data.estimate) {
                updateEstimateBadge(data.estimate);
                if (currentTempAddress) {
                    currentTempAddress.estimate = data.estimate;
                    currentTempAddress.pincode = pin;
                }
            }
        } catch (e) {
            console.error('[Location] Estimate recalculation failed:', e);
        }
    }

    /**
     * Handle "Use Current Location" GPS Flow
     */
    function handleUseCurrentLocation() {
        const gpsCard = document.getElementById('useCurrentLocBtn');
        const gpsTitle = document.getElementById('locGpsTitle');
        const gpsSub = document.getElementById('locGpsSub');

        hideAlert();

        if (!('geolocation' in navigator)) {
            showAlert('error', '⚠️ Geolocation is not supported by your browser. Please search or enter your address manually.');
            return;
        }

        // Set visual loading state
        gpsCard.classList.add('locating');
        gpsTitle.innerHTML = '<span class="arshith-loc-spinner"></span> Detecting your location...';
        gpsSub.textContent = 'Requesting browser GPS permission. Please click "Allow"...';

        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                // Success callback
                gpsCard.classList.remove('locating');
                gpsTitle.innerHTML = '<span>Use Current Location</span>';
                gpsSub.textContent = 'Using GPS for instant & accurate address detection';

                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                showAlert('info', `📍 Location detected (${lat.toFixed(4)}, ${lon.toFixed(4)}). Looking up address...`);

                try {
                    const res = await fetch(`${getApiBase()}/api/location/reverse?lat=${lat}&lon=${lon}`);
                    const data = await res.json();

                    hideAlert();

                    if (data && data.success && data.address) {
                        const addr = data.address;
                        showConfirmStep({
                            house: '',
                            street: addr.street || '',
                            landmark: '',
                            area: addr.area || addr.locality || '',
                            city: addr.city || 'Bengaluru',
                            state: addr.state || 'Karnataka',
                            pincode: addr.pincode || '',
                            estimate: data.estimate,
                            lat,
                            lon,
                            formattedAddress: addr.formattedAddress
                        });
                    } else {
                        // Reverse geocoding fallback
                        showConfirmStep({
                            house: '',
                            street: '',
                            landmark: '',
                            area: '',
                            city: 'Bengaluru',
                            state: 'Karnataka',
                            pincode: '',
                            lat,
                            lon
                        });
                        showAlert('warning', '📍 Coordinates detected! Please fill in your Area and PIN code to confirm delivery.');
                    }
                } catch (err) {
                    console.error('[Location] Reverse geocoding network error:', err);
                    showConfirmStep({
                        house: '',
                        street: '',
                        landmark: '',
                        area: '',
                        city: 'Bengaluru',
                        state: 'Karnataka',
                        pincode: '',
                        lat,
                        lon
                    });
                    showAlert('warning', '📍 Location detected! Please enter your Area and PIN code to confirm delivery.');
                }
            },
            (error) => {
                // Error callback
                gpsCard.classList.remove('locating');
                gpsTitle.innerHTML = '<span>Use Current Location</span>';
                gpsSub.textContent = 'Using GPS for instant & accurate address detection';

                console.warn('[Location] Geolocation error:', error);

                if (error.code === error.PERMISSION_DENIED) {
                    showAlert('warning', '📍 Location permission was denied in your browser. You can still search your area or enter your PIN code manually below.');
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    showAlert('warning', '📡 GPS position unavailable. Please search for your area, locality, or PIN code below.');
                } else if (error.code === error.TIMEOUT) {
                    showAlert('warning', '⏱️ Location request timed out. Please search for your area or PIN code manually below.');
                } else {
                    showAlert('warning', '⚠️ Could not retrieve location. Please use manual search below.');
                }
            },
            geoOptions
        );
    }

    /**
     * Handle Manual Address Search
     */
    async function handleLocationSearch(query) {
        const suggestionsBox = document.getElementById('locSuggestionsList');
        if (!suggestionsBox) return;

        if (!query || query.length < 2) {
            hideSuggestions();
            return;
        }

        try {
            suggestionsBox.style.display = 'flex';
            suggestionsBox.innerHTML = `
                <div style="padding: 14px; text-align: center; color: #64748b; font-size: 13px;">
                    <span class="arshith-loc-spinner" style="border-top-color: #0f7139; border-color: rgba(15,113,57,0.2);"></span> Searching locations...
                </div>
            `;

            const res = await fetch(`${getApiBase()}/api/location/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (data && data.success && Array.isArray(data.results) && data.results.length > 0) {
                suggestionsBox.innerHTML = data.results.map((item, idx) => {
                    const badgeText = item.deliveryDays ? `⚡ ${item.deliveryDays}` : '⚡ 2–4 days';
                    const icon = item.type === 'home' ? '🏠' : (item.type === 'pincode' ? '📮' : '📍');
                    return `
                        <div class="arshith-loc-suggestion-item" data-index="${idx}" role="button" tabindex="0">
                            <span class="arshith-loc-sugg-icon">${icon}</span>
                            <div class="arshith-loc-sugg-info">
                                <div class="arshith-loc-sugg-title">${escapeHtml(item.title)}</div>
                                <div class="arshith-loc-sugg-sub">${escapeHtml(item.subtitle)}</div>
                            </div>
                            <span class="arshith-loc-sugg-badge">${badgeText}</span>
                        </div>
                    `;
                }).join('');

                // Attach click listeners to suggestions
                const items = suggestionsBox.querySelectorAll('.arshith-loc-suggestion-item');
                items.forEach((itemEl, idx) => {
                    itemEl.addEventListener('click', () => {
                        const selected = data.results[idx];
                        hideSuggestions();
                        showConfirmStep({
                            house: selected.house || '',
                            street: selected.street || selected.area || '',
                            landmark: selected.landmark || '',
                            area: selected.area || selected.title || '',
                            city: selected.city || '',
                            state: selected.state || '',
                            pincode: selected.pincode || '',
                            lat: selected.lat,
                            lon: selected.lon,
                            estimateText: selected.deliveryEstimate || '⚡ Delivery in 2–3 days',
                            deliveryDays: selected.deliveryDays || '2–3 days'
                        });
                        // Recalculate exact estimate
                        if (selected.pincode) {
                            recalculateEstimateForPin(selected.pincode);
                        }
                    });
                });
            } else {
                suggestionsBox.innerHTML = `
                    <div style="padding: 14px; text-align: center; color: #64748b; font-size: 13px;">
                        No matching locations found for "${escapeHtml(query)}".
                        <div style="margin-top: 6px;">
                            <a href="javascript:void(0)" id="manualEntryFallbackLink" style="color: #0f7139; font-weight: 700;">Enter address manually &rarr;</a>
                        </div>
                    </div>
                `;

                const fallbackLink = document.getElementById('manualEntryFallbackLink');
                if (fallbackLink) {
                    fallbackLink.addEventListener('click', () => {
                        hideSuggestions();
                        showConfirmStep({
                            house: '',
                            street: '',
                            landmark: '',
                            area: query,
                            city: 'Bengaluru',
                            state: 'Karnataka',
                            pincode: /^\d{6}$/.test(query) ? query : ''
                        });
                    });
                }
            }
        } catch (e) {
            console.error('[Location] Search error:', e);
            suggestionsBox.innerHTML = `
                <div style="padding: 12px; text-align: center; color: #dc2626; font-size: 13px;">
                    Search service temporarily unavailable.
                    <a href="javascript:void(0)" id="manualEntryFallbackLink2" style="color: #0f7139; font-weight: 700; display: block; margin-top: 4px;">Enter address manually &rarr;</a>
                </div>
            `;
            const fallbackLink2 = document.getElementById('manualEntryFallbackLink2');
            if (fallbackLink2) {
                fallbackLink2.addEventListener('click', () => {
                    hideSuggestions();
                    showConfirmStep({
                        house: '',
                        street: '',
                        landmark: '',
                        area: '',
                        city: 'Bengaluru',
                        state: 'Karnataka',
                        pincode: ''
                    });
                });
            }
        }
    }

    function hideSuggestions() {
        const suggestionsBox = document.getElementById('locSuggestionsList');
        if (suggestionsBox) {
            suggestionsBox.style.display = 'none';
            suggestionsBox.innerHTML = '';
        }
    }

    /**
     * Show Alert Message Banner
     */
    function showAlert(type, message) {
        const alertBanner = document.getElementById('locAlertBanner');
        if (!alertBanner) return;

        alertBanner.className = `arshith-loc-alert ${type}`;
        alertBanner.innerHTML = message;
        alertBanner.style.display = 'flex';
    }

    function hideAlert() {
        const alertBanner = document.getElementById('locAlertBanner');
        if (alertBanner) {
            alertBanner.style.display = 'none';
            alertBanner.innerHTML = '';
        }
    }

    /**
     * Renders Saved Address Chips if logged in user has addresses
     */
    function renderSavedAddressChips() {
        const sec = document.getElementById('locSavedSection');
        const container = document.getElementById('locSavedChips');
        if (!sec || !container) return;

        try {
            const rawUser = localStorage.getItem('arshith_user');
            if (!rawUser) {
                sec.style.display = 'none';
                return;
            }

            const user = JSON.parse(rawUser);
            const chips = [];

            // Primary address from user profile
            if (user.city || user.postalCode || user.street) {
                chips.push({
                    label: 'Primary Address',
                    icon: '🏠',
                    street: user.street || '',
                    city: user.city || 'Bengaluru',
                    state: user.state || 'Karnataka',
                    pincode: user.postalCode || ''
                });
            }

            // Saved addresses array if present
            if (Array.isArray(user.addresses)) {
                user.addresses.forEach(a => {
                    chips.push({
                        label: a.title || a.type || 'Saved Address',
                        icon: (a.type && a.type.toLowerCase() === 'work') ? '🏢' : '📍',
                        house: a.house || '',
                        street: a.street || a.address || '',
                        landmark: a.landmark || '',
                        area: a.area || '',
                        city: a.city || 'Bengaluru',
                        state: a.state || 'Karnataka',
                        pincode: a.pincode || a.postalCode || ''
                    });
                });
            }

            if (chips.length > 0) {
                sec.style.display = 'block';
                container.innerHTML = chips.map((c, i) => `
                    <div class="arshith-loc-chip" data-chip-idx="${i}" role="button" tabindex="0">
                        <span>${c.icon}</span>
                        <span>${escapeHtml(c.label)}: ${escapeHtml(c.area || c.city || c.pincode)}</span>
                    </div>
                `).join('');

                container.querySelectorAll('.arshith-loc-chip').forEach((chipEl, idx) => {
                    chipEl.addEventListener('click', () => {
                        const c = chips[idx];
                        showConfirmStep({
                            house: c.house || '',
                            street: c.street || '',
                            landmark: c.landmark || '',
                            area: c.area || c.street || '',
                            city: c.city || 'Bengaluru',
                            state: c.state || 'Karnataka',
                            pincode: c.pincode || ''
                        });
                        if (c.pincode) recalculateEstimateForPin(c.pincode);
                    });
                });
            } else {
                sec.style.display = 'none';
            }
        } catch (e) {
            sec.style.display = 'none';
        }
    }

    /**
     * Handle Confirm and Save
     */
    async function handleConfirmAndSave() {
        const house = document.getElementById('locHouseInput').value.trim();
        const street = document.getElementById('locStreetInput').value.trim();
        const landmark = document.getElementById('locLandmarkInput').value.trim();
        const area = document.getElementById('locAreaInput').value.trim();
        const city = document.getElementById('locCityInput').value.trim();
        const state = document.getElementById('locStateInput').value.trim();
        const pin = document.getElementById('locPinInput').value.trim();
        const pinInput = document.getElementById('locPinInput');
        const errEl = document.getElementById('locPinErrorMsg');

        // Validation: 6-digit Indian PIN code
        if (!/^[1-9][0-9]{5}$/.test(pin)) {
            pinInput.classList.add('error');
            if (errEl) {
                errEl.textContent = 'Please enter a valid 6-digit Indian PIN code.';
                errEl.style.display = 'block';
            }
            pinInput.focus();
            return;
        }

        if (!area) {
            document.getElementById('locAreaInput').focus();
            if (typeof window.showToast === 'function') {
                window.showToast('Please enter an area or locality.', 'error');
            }
            return;
        }

        if (!city) {
            document.getElementById('locCityInput').focus();
            if (typeof window.showToast === 'function') {
                window.showToast('Please enter a city.', 'error');
            }
            return;
        }

        // Fetch definitive delivery estimate for this PIN code
        let estimateData = null;
        try {
            const res = await fetch(`${getApiBase()}/api/location/estimate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pincode: pin, state, city })
            });
            const data = await res.json();
            if (data && data.success && data.estimate) {
                estimateData = data.estimate;
            }
        } catch (e) {
            console.error('[Location] Estimate fetch failed:', e);
        }

        if (estimateData && !estimateData.isServiceable) {
            if (typeof window.showToast === 'function') {
                window.showToast('Delivery is currently unavailable for this PIN code.', 'error');
            }
            return;
        }

        const deliveryDays = estimateData ? estimateData.deliveryDays : '1–2 days';
        const headerSummary = estimateData ? estimateData.headerSummary : '⚡ Delivery in 1–2 days';
        const estimateText = estimateData ? estimateData.estimateText : '⚡ Delivery in 1–2 days';

        const shortDisplay = house ? `${house}, ${area}, ${city}` : `${area}, ${city}`;
        const formattedAddress = [
            house ? `House/Flat ${house}` : '',
            street,
            landmark ? `Near ${landmark}` : '',
            area,
            city,
            `${state} - ${pin}`
        ].filter(Boolean).join(', ');

        const confirmedLocation = {
            house,
            street,
            landmark,
            area,
            city,
            state,
            pincode: pin,
            deliveryDays,
            headerSummary,
            estimateText,
            shortDisplay,
            formattedAddress,
            isServiceable: true,
            lat: currentTempAddress ? currentTempAddress.lat : undefined,
            lon: currentTempAddress ? currentTempAddress.lon : undefined,
            confirmedAt: new Date().toISOString()
        };

        // Persist confirmed location
        saveLocation(confirmedLocation);

        // Update header UI
        updateHeaderUI(confirmedLocation);

        // Sync to checkout inputs if on checkout page
        syncWithCheckoutPage(confirmedLocation);

        // Close modal
        closeModal();

        // User feedback toast
        if (typeof window.showToast === 'function') {
            window.showToast(`Delivery location set to ${shortDisplay}! (${headerSummary})`, 'success');
        }
    }

    /**
     * Pre-fills checkout inputs if currently on checkout.html
     */
    function syncWithCheckoutPage(loc) {
        if (!loc) return;

        const addressInput = document.getElementById('addressInput');
        const apartmentInput = document.getElementById('apartmentInput');
        const cityInput = document.getElementById('cityInput');
        const stateSelect = document.getElementById('stateSelect');
        const pinCodeInput = document.getElementById('pinCodeInput');

        if (addressInput) {
            const streetParts = [loc.house, loc.street, loc.area].filter(Boolean);
            if (streetParts.length > 0) {
                addressInput.value = streetParts.join(', ');
            }
        }
        if (apartmentInput) {
            if (loc.house) {
                apartmentInput.value = loc.landmark ? `House/Flat ${loc.house}, Near ${loc.landmark}` : `House/Flat ${loc.house}`;
            } else if (loc.landmark) {
                apartmentInput.value = `Near ${loc.landmark}`;
            }
        }
        if (cityInput && loc.city) {
            cityInput.value = loc.city;
        }
        if (pinCodeInput && loc.pincode) {
            pinCodeInput.value = loc.pincode;
        }
        if (stateSelect && loc.state) {
            for (let i = 0; i < stateSelect.options.length; i++) {
                if (stateSelect.options[i].text.toLowerCase() === loc.state.toLowerCase()) {
                    stateSelect.selectedIndex = i;
                    break;
                }
            }
        }

        // If checkout recalculation function exists, trigger it
        if (typeof window.renderCheckoutPage === 'function') {
            window.renderCheckoutPage();
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Public API on window.ArshithLocation
     */
    window.ArshithLocation = {
        open: openModal,
        close: closeModal,
        getSaved: getSavedLocation,
        save: saveLocation,
        updateHeader: updateHeaderUI
    };

    // Auto-initialize when DOM is ready
    function init() {
        injectHeaderBadge();
        injectModalDOM();

        // Connect checkout page GPS button if present
        const checkoutLocateBtn = document.getElementById('locateAddressBtn');
        if (checkoutLocateBtn) {
            checkoutLocateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        }

        // Listen for storage changes across tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY) {
                updateHeaderUI(getSavedLocation());
            }
        });

        // Pre-fill checkout if on checkout page
        syncWithCheckoutPage(getSavedLocation());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
