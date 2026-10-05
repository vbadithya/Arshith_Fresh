
window.getApiHost = function() {
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
        const origin = window.location.origin;
        if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            return 'http://localhost:5000';
        }
        if (origin.startsWith('http://') || origin.startsWith('https://')) {
            return origin;
        }
    }
    return '';
};

/* JavaScript Behaviors for Arshith Fresh Replica */

// Global Toast Notification Helper
function showToast(message, type = 'info', duration = 3500) {
    if (!message) return;
    let toast = document.getElementById("arshithGlobalToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "arshithGlobalToast";
        toast.className = "arshith-toast";
        document.body.appendChild(toast);
    }

    // Set styling and icon based on type
    let iconHtml = '';
    let bg = '#0f172a';
    let borderColor = 'transparent';

    if (type === 'error' || message.toLowerCase().includes('already exist') || message.toLowerCase().includes('error') || message.toLowerCase().includes('failed') || message.toLowerCase().includes('invalid')) {
        bg = '#7f1d1d';
        borderColor = '#ef4444';
        iconHtml = '<i class="fa-solid fa-triangle-exclamation" style="margin-right:8px;color:#fca5a5;"></i>';
    } else if (type === 'success' || message.toLowerCase().includes('success') || message.toLowerCase().includes('created') || message.toLowerCase().includes('unlocked') || message.toLowerCase().includes('confirmed')) {
        bg = '#064e3b';
        borderColor = '#10b981';
        iconHtml = '<i class="fa-solid fa-circle-check" style="margin-right:8px;color:#6ee7b7;"></i>';
    }

    toast.style.background = bg;
    toast.style.border = `1.5px solid ${borderColor}`;
    toast.style.zIndex = '9999999';
    toast.innerHTML = `${iconHtml}<span>${message}</span>`;
    toast.classList.add("show");

    if (window._toastTimeout) {
        clearTimeout(window._toastTimeout);
    }

    window._toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}
window.showToast = showToast;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Drawer Navigation
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerCloseBtn = document.querySelector(".drawer-close-btn");
    const drawerOverlay = document.getElementById("drawerOverlay");

    function toggleDrawer(open) {
        if (open) {
            mobileDrawer.classList.add("open");
            drawerOverlay.classList.add("open");
            document.body.style.overflow = "hidden"; // Disable scroll behind
        } else {
            mobileDrawer.classList.remove("open");
            drawerOverlay.classList.remove("open");
            document.body.style.overflow = ""; // Restore scroll
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", () => toggleDrawer(true));
    }
    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener("click", () => toggleDrawer(false));
    }
    if (drawerOverlay) {
        drawerOverlay.addEventListener("click", () => toggleDrawer(false));
    }

    // Drawer submenu dropdown toggle
    const submenuToggle = document.querySelector(".submenu-toggle");
    if (submenuToggle) {
        submenuToggle.addEventListener("click", (e) => {
            e.preventDefault();
            const submenu = submenuToggle.nextElementSibling;
            if (submenu) {
                submenu.classList.toggle("show");
                submenuToggle.querySelector(".arrow-down").style.transform =
                    submenu.classList.contains("show") ? "rotate(180deg)" : "";
            }
        });
    }

    // Dynamic Main Website Category & Subcategory Synchronization from MongoDB /api/collections
    async function syncMainWebsiteCategories() {
        const apiHost = typeof getApiHost === 'function' ? getApiHost() : (window.location.origin.startsWith('http') ? window.location.origin : 'http://localhost:5000');
        try {
            const res = await fetch(`${apiHost}/api/collections`);
            if (!res.ok) return;
            const collections = await res.json();
            if (!Array.isArray(collections) || collections.length === 0) return;

            const pathname = window.location.pathname.toLowerCase();
            const inCategoriesDir = pathname.includes('/pages/categories/');
            const inPagesDir = pathname.includes('/pages/');

            let pagePrefix = 'pages/';
            if (inCategoriesDir) pagePrefix = '../';
            else if (inPagesDir) pagePrefix = '';

            // 1. Synchronize Dropdown Menus in Navigation Header
            const dropdownMenus = document.querySelectorAll('.dropdown-menu, .drawer-submenu');
            dropdownMenus.forEach(menu => {
                menu.innerHTML = collections.map(col => {
                    const slug = col.slug || col.title.toLowerCase().replace(/\s+/g, '-');
                    let link = `${pagePrefix}collections.html?category=${encodeURIComponent(slug)}`;
                    if (slug === 'pickles') link = `${pagePrefix}categories/pickles.html`;
                    else if (slug === 'oils-natural-extracts' || slug === 'oils') link = `${pagePrefix}categories/oils-natural-extracts.html`;
                    else if (slug === 'dry-fruits-nuts' || slug === 'dry-fruits') link = `${pagePrefix}categories/dry-fruits-nuts.html`;
                    else if (slug === 'seeds' || slug === 'dry-seeds') link = `${pagePrefix}categories/dry-seeds.html`;
                    else if (slug === 'ghee-honey' || slug === 'ghee-and-honey') link = `${pagePrefix}categories/ghee-and-honey.html`;
                    else if (slug === 'cooking-essentials') link = `${pagePrefix}categories/cooking-essentials.html`;
                    else if (slug === 'spices') link = `${pagePrefix}categories/spices.html`;
                    else if (slug === 'powders-masalas' || slug === 'spice-powders-podulu') link = `${pagePrefix}categories/spice-powders-podulu.html`;
                    
                    const subs = Array.isArray(col.subcategories) ? col.subcategories : [];
                    if (subs.length > 0) {
                        const subLinks = subs.map(s => `<li><a href="${pagePrefix}collections.html?category=${encodeURIComponent(slug)}&sub=${encodeURIComponent(s)}">${s}</a></li>`).join('');
                        return `
                            <li class="has-sub-item" style="position:relative;">
                                <a href="${link}" style="display:flex; justify-content:space-between; align-items:center;">
                                    <span>${col.title}</span>
                                    <span style="font-size:10px; margin-left:6px; opacity:0.7;">▸</span>
                                </a>
                                <ul class="nested-sub-menu">${subLinks}</ul>
                            </li>
                        `;
                    }
                    return `<li><a href="${link}">${col.title}</a></li>`;
                }).join('');
            });

            // 2. Update Circle Nav Row on collections & category pages if present
            const circleRow = document.querySelector('.category-circle-row');
            if (circleRow) {
                const urlParams = new URLSearchParams(window.location.search);
                const activeCat = urlParams.get('category') || urlParams.get('cat') || '';
                
                let circleHtml = `
                    <a href="${pagePrefix}collections.html?category=all" class="category-circle-item ${(!activeCat || activeCat === 'all') && !inCategoriesDir ? 'active' : ''}">
                        <div class="circle-img-wrap"><img src="https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/groceries_200x200_crop_center.jpg?v=1746965740" alt="All Products"></div>
                        <span class="circle-title">All Products</span>
                    </a>
                `;

                collections.forEach(col => {
                    const slug = col.slug || col.title.toLowerCase().replace(/\s+/g, '-');
                    let link = `${pagePrefix}collections.html?category=${encodeURIComponent(slug)}`;
                    if (slug === 'pickles') link = `${pagePrefix}categories/pickles.html`;
                    else if (slug === 'oils-natural-extracts' || slug === 'oils') link = `${pagePrefix}categories/oils-natural-extracts.html`;
                    else if (slug === 'dry-fruits-nuts' || slug === 'dry-fruits') link = `${pagePrefix}categories/dry-fruits-nuts.html`;
                    else if (slug === 'seeds' || slug === 'dry-seeds') link = `${pagePrefix}categories/dry-seeds.html`;
                    else if (slug === 'ghee-honey' || slug === 'ghee-and-honey') link = `${pagePrefix}categories/ghee-and-honey.html`;
                    else if (slug === 'cooking-essentials') link = `${pagePrefix}categories/cooking-essentials.html`;
                    else if (slug === 'spices') link = `${pagePrefix}categories/spices.html`;
                    else if (slug === 'powders-masalas' || slug === 'spice-powders-podulu') link = `${pagePrefix}categories/spice-powders-podulu.html`;

                    const isActive = (activeCat && (activeCat.toLowerCase() === slug || activeCat.toLowerCase() === col.title.toLowerCase())) || (pathname.includes(slug));
                    const img = col.image || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/groceries_200x200_crop_center.jpg?v=1746965740';

                    circleHtml += `
                        <a href="${link}" class="category-circle-item ${isActive ? 'active' : ''}">
                            <div class="circle-img-wrap"><img src="${img}" alt="${col.title}"></div>
                            <span class="circle-title">${col.title}</span>
                        </a>
                    `;
                });

                circleRow.innerHTML = circleHtml;

                const parentNav = circleRow.closest('.collections-top-nav-bar');
                if (parentNav) {
                    parentNav.style.position = 'relative';
                    if (!parentNav.querySelector('.slider-arrow.prev')) {
                        const prevBtn = document.createElement('button');
                        prevBtn.type = 'button';
                        prevBtn.className = 'slider-arrow category-arrow prev';
                        prevBtn.setAttribute('aria-label', 'Scroll left');
                        prevBtn.innerHTML = '&#8249;';
                        parentNav.insertBefore(prevBtn, circleRow);
                    }
                    if (!parentNav.querySelector('.slider-arrow.next')) {
                        const nextBtn = document.createElement('button');
                        nextBtn.type = 'button';
                        nextBtn.className = 'slider-arrow category-arrow next';
                        nextBtn.setAttribute('aria-label', 'Scroll right');
                        nextBtn.innerHTML = '&#8250;';
                        parentNav.appendChild(nextBtn);
                    }
                }
            }

            // Subcategory pills removed per user request
            const existingPills = document.getElementById('subcategoryPillsRow');
            if (existingPills) existingPills.remove();
        } catch (e) {
            console.error('Failed to sync main website categories:', e);
        }
    }

    syncMainWebsiteCategories();

    // 2. Instamart-Style Hero Banner Carousel
    const instamartTrack = document.getElementById("instamartTrack");
    const instamartPrevBtn = document.getElementById("instamartPrevBtn");
    const instamartNextBtn = document.getElementById("instamartNextBtn");
    const instamartPillCounter = document.getElementById("instamartPillCounter");

    if (instamartTrack) {
        const cards = instamartTrack.querySelectorAll(".instamart-banner-card");
        const totalCards = cards.length;
        let isHovered = false;

        function updateCounter() {
            if (!instamartPillCounter || totalCards === 0) return;
            const scrollLeft = instamartTrack.scrollLeft;
            const firstCard = cards[0];
            const cardWidth = firstCard ? (firstCard.offsetWidth + 18) : 340;
            const currentIndex = Math.min(totalCards, Math.max(1, Math.round(scrollLeft / cardWidth) + 1));
            instamartPillCounter.textContent = `${currentIndex} / ${totalCards}`;
        }

        instamartTrack.addEventListener("scroll", updateCounter, { passive: true });

        function scrollInstamart(direction) {
            const firstCard = cards[0];
            const cardWidth = firstCard ? (firstCard.offsetWidth + 18) : 340;
            const maxScroll = instamartTrack.scrollWidth - instamartTrack.clientWidth;
            
            if (direction > 0 && instamartTrack.scrollLeft >= maxScroll - 10) {
                instamartTrack.scrollTo({ left: 0, behavior: "smooth" });
            } else if (direction < 0 && instamartTrack.scrollLeft <= 10) {
                instamartTrack.scrollTo({ left: maxScroll, behavior: "smooth" });
            } else {
                instamartTrack.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
            }
        }

        if (instamartPrevBtn) {
            instamartPrevBtn.addEventListener("click", (e) => {
                e.preventDefault();
                scrollInstamart(-1);
            });
        }

        if (instamartNextBtn) {
            instamartNextBtn.addEventListener("click", (e) => {
                e.preventDefault();
                scrollInstamart(1);
            });
        }

        // Auto slide every 4.5 seconds when not hovered
        if (instamartTrack.parentElement) {
            instamartTrack.parentElement.addEventListener("mouseenter", () => isHovered = true);
            instamartTrack.parentElement.addEventListener("mouseleave", () => isHovered = false);
        }

        setInterval(() => {
            if (!isHovered && document.visibilityState === "visible") {
                scrollInstamart(1);
            }
        }, 4500);

        updateCounter();
    }

    // 3. Product Shelves Slider Buttons
    const sliders = document.querySelectorAll(".product-slider-wrapper");
    sliders.forEach(slider => {
        const grid = slider.querySelector(".products-grid");
        const prevArrow = slider.querySelector(".slider-arrow.prev");
        const nextArrow = slider.querySelector(".slider-arrow.next");

        if (grid && prevArrow && nextArrow) {
            const getScrollAmount = () => {
                // Scroll roughly by one card width
                const card = grid.querySelector(".product-card");
                return card ? card.offsetWidth + 24 : 300;
            };

            prevArrow.addEventListener("click", () => {
                grid.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
            });

            nextArrow.addEventListener("click", () => {
                grid.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
            });

            // Toggle arrow visibility depending on scroll position
            const toggleArrows = () => {
                const isScrollable = grid.scrollWidth > grid.clientWidth;
                if (!isScrollable) {
                    prevArrow.style.display = "none";
                    nextArrow.style.display = "none";
                    return;
                }
                prevArrow.style.display = grid.scrollLeft <= 10 ? "none" : "flex";
                nextArrow.style.display = (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10) ? "none" : "flex";
            };

            grid.addEventListener("scroll", toggleArrows);
            window.addEventListener("resize", toggleArrows);
            // Initial check
            setTimeout(toggleArrows, 500);
        }
    });

    // 4. FAQ Accordion Section
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        const toggle = question.querySelector("span");

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Close all items
            faqItems.forEach(i => {
                i.classList.remove("active");
                const span = i.querySelector(".faq-question span");
                if (span) span.textContent = "+";
            });

            // Open current if it was not active
            if (!isActive) {
                item.classList.add("active");
                if (toggle) toggle.textContent = "−";
            }
        });
    });

    // 5. Mobile Footer Menu Accordions
    const footerButtons = document.querySelectorAll(".footer-accordion-btn");
    footerButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Only trigger on mobile screen size
            if (window.innerWidth <= 767) {
                const linksList = btn.nextElementSibling;
                const arrow = btn.querySelector(".footer-arrow");
                if (linksList) {
                    linksList.classList.toggle("show");
                    if (linksList.classList.contains("show")) {
                        arrow.textContent = "-";
                    } else {
                        arrow.textContent = "+";
                    }
                }
            }
        });
    });

    // 6. Interactive add-to-cart feedback for static cards
    const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
    addToCartBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const onclickAttr = btn.getAttribute("onclick") || "";
            if (onclickAttr.includes("addToStoreCart")) {
                // Handled directly by inline onclick attribute - avoid double invocation
                return;
            }
            const card = btn.closest(".product-card, .af-product-card, .collection-product-card, .product-detail-info");
            if (card) {
                let info = parseAddToCartArgs(btn) || parseAddToCartArgs(card);
                let id = info ? info.id : (card.getAttribute("data-product-id") || String(Date.now()));
                let name = info ? info.name : "Arshith Fresh Product";
                let price = info ? info.price : 59;
                let image = info ? info.image : "";

                if (!info) {
                    const titleElem = card.querySelector(".product-title, .card__heading, h1, h3, h4");
                    if (titleElem) name = titleElem.textContent.trim();

                    const salePriceElem = card.querySelector(".sale-price, .price, .product-price");
                    if (salePriceElem) {
                        const priceText = salePriceElem.textContent;
                        price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || price;
                    }

                    const imgElem = card.querySelector("img");
                    if (imgElem) image = imgElem.src;
                }

                if (typeof addToStoreCart === "function") {
                    addToStoreCart(id, name, price, image, 1);
                }
            } else if (typeof updateCartCountBadge === "function") {
                updateCartCountBadge();
            }
        });
    });

    // 7. Interactive Filter Accordions (Expand/Collapse on click & Live Filtering)
    const filterMainTitles = document.querySelectorAll(".filter-main-title");
    filterMainTitles.forEach(title => {
        if (!title.querySelector(".filter-toggle-icon")) {
            const icon = document.createElement("span");
            icon.className = "filter-toggle-icon";
            icon.innerHTML = "▼";
            title.appendChild(icon);
        }
        title.addEventListener("click", () => {
            const pane = title.closest(".sidebar-filter-pane");
            if (pane) {
                pane.classList.toggle("is-expanded");
            }
        });
    });

    const filterHeaders = document.querySelectorAll(".filter-accordion-header");
    filterHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.closest(".filter-accordion-item");
            if (item) {
                item.classList.toggle("open");
            }
        });
    });

    // Make default first 2 filter items open by default
    const filterItems = document.querySelectorAll(".filter-accordion-item");
    if (filterItems.length > 0) {
        filterItems[0].classList.add("open");
        if (filterItems[1]) filterItems[1].classList.add("open");
    }

    // 8. Don't Miss Out newsletter popup closable
    const dontMissOutPopup = document.getElementById("dontMissOutPopup");
    const closePopupBtn = document.getElementById("closePopupBtn");
    if (dontMissOutPopup && closePopupBtn) {
        closePopupBtn.addEventListener("click", () => {
            dontMissOutPopup.classList.add("hidden");
        });
    }

    // 8. Collection Banner Sliders (Autoplay, Touch Swipe, Smooth Animation, Indicators)
    function initCollectionSliders() {
        const wrappers = document.querySelectorAll(".collection-banner-slider-wrapper");
        wrappers.forEach(wrapper => {
            const track = wrapper.querySelector(".collection-slider-track");
            if (!track) return;

            const slides = wrapper.querySelectorAll(".collection-slide");
            if (slides.length === 0) return;

            const prevBtn = wrapper.querySelector(".collection-slider-arrow.prev");
            const nextBtn = wrapper.querySelector(".collection-slider-arrow.next");

            // Create or locate dots container
            let dotsContainer = wrapper.querySelector(".collection-slider-dots");
            if (!dotsContainer && slides.length > 1) {
                dotsContainer = document.createElement("div");
                dotsContainer.className = "collection-slider-dots";
                wrapper.appendChild(dotsContainer);
            }

            if (dotsContainer) {
                dotsContainer.innerHTML = "";
                slides.forEach((_, i) => {
                    const dot = document.createElement("span");
                    dot.className = `dot ${i === 0 ? "active" : ""}`;
                    dot.setAttribute("data-slide", i);
                    dotsContainer.appendChild(dot);
                });
            }

            let currentIndex = 0;
            let slideTimer = null;

            function updateSlide(index) {
                currentIndex = (index + slides.length) % slides.length;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                if (dotsContainer) {
                    const dots = dotsContainer.querySelectorAll(".dot");
                    dots.forEach((dot, i) => {
                        dot.classList.toggle("active", i === currentIndex);
                    });
                }
            }

            function startTimer() {
                if (slides.length <= 1) return;
                stopTimer();
                slideTimer = setInterval(() => {
                    updateSlide(currentIndex + 1);
                }, 4500);
            }

            function stopTimer() {
                if (slideTimer) clearInterval(slideTimer);
            }

            if (prevBtn) {
                prevBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    updateSlide(currentIndex - 1);
                    startTimer();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    updateSlide(currentIndex + 1);
                    startTimer();
                });
            }

            if (dotsContainer) {
                dotsContainer.addEventListener("click", (e) => {
                    if (e.target.classList.contains("dot")) {
                        const targetIdx = parseInt(e.target.getAttribute("data-slide"));
                        if (!isNaN(targetIdx)) {
                            updateSlide(targetIdx);
                            startTimer();
                        }
                    }
                });
            }

            // Touch Swipe Support
            let startX = 0;
            wrapper.addEventListener("touchstart", (e) => {
                startX = e.changedTouches[0].clientX;
                stopTimer();
            }, { passive: true });

            wrapper.addEventListener("touchend", (e) => {
                const dist = e.changedTouches[0].clientX - startX;
                if (Math.abs(dist) > 35) {
                    if (dist < 0) {
                        updateSlide(currentIndex + 1);
                    } else {
                        updateSlide(currentIndex - 1);
                    }
                }
                startTimer();
            }, { passive: true });

            wrapper.addEventListener("mouseenter", stopTimer);
            wrapper.addEventListener("mouseleave", startTimer);

            updateSlide(0);
            startTimer();
        });
    }
    initCollectionSliders();

    const FALLBACK_STOREFRONT_PRODUCTS = [
  {
    "_id": "groundnut-oil-premium",
    "id": "groundnut-oil-premium",
    "handle": "groundnut-oil-premium",
    "name": "Groundnut Oil (Premium Quality)",
    "title": "Groundnut Oil (Premium Quality)",
    "category": "Oils",
    "price": 349,
    "originalPrice": 471,
    "unit": "1 L",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.42_PM_1_3752719d-4e83-4d00-a8be-0c4d13076c23.jpg?v=1757334051&width=533",
    "description": "100% Pure & authentic Groundnut Oil (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.42_PM_1_3752719d-4e83-4d00-a8be-0c4d13076c23.jpg?v=1757334051&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.42_PM_1_3752719d-4e83-4d00-a8be-0c4d13076c23.jpg?v=1757334051&width=533"
    ]
  },
  {
    "_id": "sunflower-oil-premium",
    "id": "sunflower-oil-premium",
    "handle": "sunflower-oil-premium",
    "name": "Sunflower Oil (Premium Quality)",
    "title": "Sunflower Oil (Premium Quality)",
    "category": "Oils",
    "price": 499,
    "originalPrice": 608,
    "unit": "1 L",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-28_at_4.14.16_PM_1_ee159cd3-c09a-443d-a28c-6c4b116ce904.jpg?v=1757334052&width=533",
    "description": "100% Pure & authentic Sunflower Oil (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-28_at_4.14.16_PM_1_ee159cd3-c09a-443d-a28c-6c4b116ce904.jpg?v=1757334052&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-28_at_4.14.16_PM_1_ee159cd3-c09a-443d-a28c-6c4b116ce904.jpg?v=1757334052&width=533"
    ]
  },
  {
    "_id": "sesame-oil-premium",
    "id": "sesame-oil-premium",
    "handle": "sesame-oil-premium",
    "name": "Sesame Oil (Premium Quality)",
    "title": "Sesame Oil (Premium Quality)",
    "category": "Oils",
    "price": 148,
    "originalPrice": 185,
    "unit": "500 ml",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533",
    "description": "100% Pure & authentic Sesame Oil (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533"
    ]
  },
  {
    "_id": "castor-oil-premium",
    "id": "castor-oil-premium",
    "handle": "castor-oil-premium",
    "name": "Castor Oil (Premium Quality)",
    "title": "Castor Oil (Premium Quality)",
    "category": "Oils",
    "price": 95,
    "originalPrice": 118,
    "unit": "250 ml",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.40_PM_1_73d71147-06da-4205-b360-66ad1642a18c.jpg?v=1757334049&width=533",
    "description": "100% Pure & authentic Castor Oil (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.40_PM_1_73d71147-06da-4205-b360-66ad1642a18c.jpg?v=1757334049&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.40_PM_1_73d71147-06da-4205-b360-66ad1642a18c.jpg?v=1757334049&width=533"
    ]
  },
  {
    "_id": "coconut-oil-premium",
    "id": "coconut-oil-premium",
    "handle": "coconut-oil-premium",
    "name": "Coconut Oil (Premium Quality)",
    "title": "Coconut Oil (Premium Quality)",
    "category": "Oils",
    "price": 165,
    "originalPrice": 214,
    "unit": "500 ml",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533",
    "description": "100% Pure & authentic Coconut Oil (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533"
    ]
  },
  {
    "_id": "mustard-oil-premium",
    "id": "mustard-oil-premium",
    "handle": "mustard-oil-premium",
    "name": "Mustard Oil (Premium Quality)",
    "title": "Mustard Oil (Premium Quality)",
    "category": "Oils",
    "price": 115,
    "originalPrice": 150,
    "unit": "500 ml",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533",
    "description": "100% Pure & authentic Mustard Oil (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533"
    ]
  },
  {
    "_id": "pure-cow-ghee-premium",
    "id": "pure-cow-ghee-premium",
    "handle": "pure-cow-ghee-premium",
    "name": "Pure Cow Ghee (Premium Quality)",
    "title": "Pure Cow Ghee (Premium Quality)",
    "category": "Ghee and Honey",
    "price": 240,
    "originalPrice": 310,
    "unit": "250 ml",
    "image": "/assets/images/products/cow_ghee_front.jpg",
    "hoverImage": "/assets/images/products/cow_ghee_back.jpg",
    "description": "100% Pure & authentic Pure Cow Ghee (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "/assets/images/products/cow_ghee_front.jpg",
      "/assets/images/products/cow_ghee_back.jpg"
    ],
    "imageUrls": [
      "/assets/images/products/cow_ghee_front.jpg",
      "/assets/images/products/cow_ghee_back.jpg"
    ]
  },
  {
    "_id": "pure-buffalo-ghee-premium",
    "id": "pure-buffalo-ghee-premium",
    "handle": "pure-buffalo-ghee-premium",
    "name": "Pure Buffalo Ghee (Premium Quality)",
    "title": "Pure Buffalo Ghee (Premium Quality)",
    "category": "Ghee and Honey",
    "price": 222,
    "originalPrice": 288,
    "unit": "250 ml",
    "image": "/assets/images/products/buffalo_ghee_front.jpg",
    "hoverImage": "/assets/images/products/buffalo_ghee_back.jpg",
    "description": "100% Pure & authentic Pure Buffalo Ghee (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "/assets/images/products/buffalo_ghee_front.jpg",
      "/assets/images/products/buffalo_ghee_back.jpg"
    ],
    "imageUrls": [
      "/assets/images/products/buffalo_ghee_front.jpg",
      "/assets/images/products/buffalo_ghee_back.jpg"
    ]
  },
  {
    "_id": "natural-honey-premium",
    "id": "natural-honey-premium",
    "handle": "natural-honey-premium",
    "name": "Pure Natural Honey (Raw Wild Honey) (Premium Quality)",
    "title": "Pure Natural Honey (Raw Wild Honey) (Premium Quality)",
    "category": "Ghee and Honey",
    "price": 130,
    "originalPrice": 150,
    "unit": "250 g",
    "image": "/assets/images/products/natural_honey_front.jpg",
    "hoverImage": "/assets/images/products/natural_honey_back.jpg",
    "description": "100% Pure & authentic Pure Natural Honey (Raw Wild Honey) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "/assets/images/products/natural_honey_front.jpg",
      "/assets/images/products/natural_honey_back.jpg"
    ],
    "imageUrls": [
      "/assets/images/products/natural_honey_front.jpg",
      "/assets/images/products/natural_honey_back.jpg"
    ]
  },
  {
    "_id": "cashew-nuts-premium",
    "id": "cashew-nuts-premium",
    "handle": "cashew-nuts-premium",
    "name": "Cashew Nuts (Kaju) (Premium Quality)",
    "title": "Cashew Nuts (Kaju) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 265,
    "originalPrice": 340,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b703-43bd-ae6f-6bb812afa6ba.jpg?v=1757334003&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.45.20_AM_2927d0dd-ed7b-43f7-8eb3-0fa0fd2e9a33.jpg?v=1757334004&width=533",
    "description": "100% Pure & authentic Cashew Nuts (Kaju) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b703-43bd-ae6f-6bb812afa6ba.jpg?v=1757334003&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.45.20_AM_2927d0dd-ed7b-43f7-8eb3-0fa0fd2e9a33.jpg?v=1757334004&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b703-43bd-ae6f-6bb812afa6ba.jpg?v=1757334003&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.45.20_AM_2927d0dd-ed7b-43f7-8eb3-0fa0fd2e9a33.jpg?v=1757334004&width=533"
    ]
  },
  {
    "_id": "almonds-premium",
    "id": "almonds-premium",
    "handle": "almonds-premium",
    "name": "Almonds (Badam) (Premium Quality)",
    "title": "Almonds (Badam) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 225,
    "originalPrice": 295,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.36_AM_e4a9990f-ccf1-4aa3-a944-45faa606db78.jpg?v=1757334003&width=533",
    "description": "100% Pure & authentic Almonds (Badam) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.36_AM_e4a9990f-ccf1-4aa3-a944-45faa606db78.jpg?v=1757334003&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.36_AM_e4a9990f-ccf1-4aa3-a944-45faa606db78.jpg?v=1757334003&width=533"
    ]
  },
  {
    "_id": "figsdry-anjeer-premium",
    "id": "figsdry-anjeer-premium",
    "handle": "figsdry-anjeer-premium",
    "name": "Figs (Dry Anjeer) (Premium Quality)",
    "title": "Figs (Dry Anjeer) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 375,
    "originalPrice": 480,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-16_at_6.03.06_PM_34ff0f49-adf5-47c3-979c-8e5ab7a6db71.jpg?v=1757334000&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.33_AM_2_-_Copy_7c457949-8471-48e0-a565-df11eec16963.jpg?v=1757334000&width=533",
    "description": "100% Pure & authentic Figs (Dry Anjeer) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-16_at_6.03.06_PM_34ff0f49-adf5-47c3-979c-8e5ab7a6db71.jpg?v=1757334000&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.33_AM_2_-_Copy_7c457949-8471-48e0-a565-df11eec16963.jpg?v=1757334000&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-16_at_6.03.06_PM_34ff0f49-adf5-47c3-979c-8e5ab7a6db71.jpg?v=1757334000&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.33_AM_2_-_Copy_7c457949-8471-48e0-a565-df11eec16963.jpg?v=1757334000&width=533"
    ]
  },
  {
    "_id": "walnuts-premium",
    "id": "walnuts-premium",
    "handle": "walnuts-premium",
    "name": "Walnuts (Akhrot) (Premium Quality)",
    "title": "Walnuts (Akhrot) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 320,
    "originalPrice": 420,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2_372210ff-499e-4854-b1ba-7ac50bb3a105.jpg?v=1757334002&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.34_AM_bd399ac2-3177-4f8d-b549-0988071161ae.jpg?v=1757334002&width=533",
    "description": "100% Pure & authentic Walnuts (Akhrot) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2_372210ff-499e-4854-b1ba-7ac50bb3a105.jpg?v=1757334002&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.34_AM_bd399ac2-3177-4f8d-b549-0988071161ae.jpg?v=1757334002&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2_372210ff-499e-4854-b1ba-7ac50bb3a105.jpg?v=1757334002&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.34_AM_bd399ac2-3177-4f8d-b549-0988071161ae.jpg?v=1757334002&width=533"
    ]
  },
  {
    "_id": "pistachio-with-shell-premium-quality",
    "id": "pistachio-with-shell-premium-quality",
    "handle": "pistachio-with-shell-premium-quality",
    "name": "Pistachio (With Shell) (Premium Quality)",
    "title": "Pistachio (With Shell) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 340,
    "originalPrice": 430,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.30_PM_6c318297-0c92-4757-979e-e2f0cfce82b1.jpg?v=1757333991&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.35_AM_2_-_Copy_6e558aaf-9cbf-4afa-bb29-1d03db66a34d.jpg?v=1757333991&width=533",
    "description": "100% Pure & authentic Pistachio (With Shell) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.30_PM_6c318297-0c92-4757-979e-e2f0cfce82b1.jpg?v=1757333991&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.35_AM_2_-_Copy_6e558aaf-9cbf-4afa-bb29-1d03db66a34d.jpg?v=1757333991&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.30_PM_6c318297-0c92-4757-979e-e2f0cfce82b1.jpg?v=1757333991&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.35_AM_2_-_Copy_6e558aaf-9cbf-4afa-bb29-1d03db66a34d.jpg?v=1757333991&width=533"
    ]
  },
  {
    "_id": "raisins-premium",
    "id": "raisins-premium",
    "handle": "raisins-premium",
    "name": "Raisins (Kishmish) (Premium Quality)",
    "title": "Raisins (Kishmish) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 140,
    "originalPrice": 185,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-23_at_11.08.13_AM_4544f222-c407-433a-b6a9-1bdaf1c17e70.jpg?v=1757334001&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-03_at_4.21.41_PM_51b21c24-d44d-4a17-9cb4-9e8ce025d2e1.jpg?v=1757334001&width=533",
    "description": "100% Pure & authentic Raisins (Kishmish) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-23_at_11.08.13_AM_4544f222-c407-433a-b6a9-1bdaf1c17e70.jpg?v=1757334001&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-03_at_4.21.41_PM_51b21c24-d44d-4a17-9cb4-9e8ce025d2e1.jpg?v=1757334001&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-23_at_11.08.13_AM_4544f222-c407-433a-b6a9-1bdaf1c17e70.jpg?v=1757334001&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-03_at_4.21.41_PM_51b21c24-d44d-4a17-9cb4-9e8ce025d2e1.jpg?v=1757334001&width=533"
    ]
  },
  {
    "_id": "dates-premium",
    "id": "dates-premium",
    "handle": "dates-premium",
    "name": "Dates (Khajoor) (Premium Quality)",
    "title": "Dates (Khajoor) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 180,
    "originalPrice": 230,
    "unit": "500 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_5.03.23_PM_21ec1f88-8a08-488f-a8ce-1967e45fef85.jpg?v=1757333990&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.44.26_AM_ee10a09d-9a22-4116-ac94-d36c3e989f6e.jpg?v=1757333990&width=533",
    "description": "100% Pure & authentic Dates (Khajoor) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_5.03.23_PM_21ec1f88-8a08-488f-a8ce-1967e45fef85.jpg?v=1757333990&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.44.26_AM_ee10a09d-9a22-4116-ac94-d36c3e989f6e.jpg?v=1757333990&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_5.03.23_PM_21ec1f88-8a08-488f-a8ce-1967e45fef85.jpg?v=1757333990&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.44.26_AM_ee10a09d-9a22-4116-ac94-d36c3e989f6e.jpg?v=1757333990&width=533"
    ]
  },
  {
    "_id": "chilli-powder",
    "id": "chilli-powder",
    "handle": "chilli-powder",
    "name": "Chilli Powder (Premium Quality)",
    "title": "Chilli Powder (Premium Quality)",
    "category": "Powders & Masalas",
    "price": 49,
    "originalPrice": 65,
    "unit": "100 g",
    "image": "assets/images/products/chilli-powder.jpg",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_1_aefb0a70-8bbf-4ec8-a727-8494ca7dbf25.jpg?v=1757333964&width=533",
    "description": "100% Pure & authentic Chilli Powder (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "assets/images/products/chilli-powder.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_1_aefb0a70-8bbf-4ec8-a727-8494ca7dbf25.jpg?v=1757333964&width=533"
    ],
    "imageUrls": [
      "assets/images/products/chilli-powder.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_1_aefb0a70-8bbf-4ec8-a727-8494ca7dbf25.jpg?v=1757333964&width=533"
    ]
  },
  {
    "_id": "chana-dal-spice-powder-pappula-podi-premium",
    "id": "chana-dal-spice-powder-pappula-podi-premium",
    "handle": "chana-dal-spice-powder-pappula-podi-premium",
    "name": "Chana Dal Spice Powder / Pappula Podi (Premium Quality)",
    "title": "Chana Dal Spice Powder / Pappula Podi (Premium Quality)",
    "category": "Spice Powders",
    "price": 89,
    "originalPrice": 115,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_2_717030b8-c8a8-40a4-bdf0-7e516dec3029.jpg?v=1757334045&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_c2bafc14-a54c-4d90-ad91-a96218301ccf.jpg?v=1757334045&width=533",
    "description": "100% Pure & authentic Chana Dal Spice Powder / Pappula Podi (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_2_717030b8-c8a8-40a4-bdf0-7e516dec3029.jpg?v=1757334045&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_c2bafc14-a54c-4d90-ad91-a96218301ccf.jpg?v=1757334045&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_2_717030b8-c8a8-40a4-bdf0-7e516dec3029.jpg?v=1757334045&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_c2bafc14-a54c-4d90-ad91-a96218301ccf.jpg?v=1757334045&width=533"
    ]
  },
  {
    "_id": "kobbari-karam-podi-premium",
    "id": "kobbari-karam-podi-premium",
    "handle": "kobbari-karam-podi-premium",
    "name": "Kobbari Karam Podi (Premium Quality)",
    "title": "Kobbari Karam Podi (Premium Quality)",
    "category": "Spice Powders",
    "price": 95,
    "originalPrice": 120,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.00_PM_33a6719d-7dd6-4772-add2-2a37e2461d57.jpg?v=1757334044&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.38_PM_1_c7c68b45-ca76-4b30-b6dc-d9cc22cbfe3a.jpg?v=1757334044&width=533",
    "description": "100% Pure & authentic Kobbari Karam Podi (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.00_PM_33a6719d-7dd6-4772-add2-2a37e2461d57.jpg?v=1757334044&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.38_PM_1_c7c68b45-ca76-4b30-b6dc-d9cc22cbfe3a.jpg?v=1757334044&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.00_PM_33a6719d-7dd6-4772-add2-2a37e2461d57.jpg?v=1757334044&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.38_PM_1_c7c68b45-ca76-4b30-b6dc-d9cc22cbfe3a.jpg?v=1757334044&width=533"
    ]
  },
  {
    "_id": "nalla-karam-podi-premium",
    "id": "nalla-karam-podi-premium",
    "handle": "nalla-karam-podi-premium",
    "name": "Nalla Karam Podi (Premium Quality)",
    "title": "Nalla Karam Podi (Premium Quality)",
    "category": "Spice Powders",
    "price": 98,
    "originalPrice": 125,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.02_PM_c823be1b-85bf-4371-8236-9e09b3af2ef5.jpg?v=1757334045&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_1_0fc408cf-b6bb-4f12-b4ef-41cfefa89e40.jpg?v=1757334045&width=533",
    "description": "100% Pure & authentic Nalla Karam Podi (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.02_PM_c823be1b-85bf-4371-8236-9e09b3af2ef5.jpg?v=1757334045&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_1_0fc408cf-b6bb-4f12-b4ef-41cfefa89e40.jpg?v=1757334045&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.02_PM_c823be1b-85bf-4371-8236-9e09b3af2ef5.jpg?v=1757334045&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_1_0fc408cf-b6bb-4f12-b4ef-41cfefa89e40.jpg?v=1757334045&width=533"
    ]
  },
  {
    "_id": "garlic-powder-velluli-karam-podi-premium",
    "id": "garlic-powder-velluli-karam-podi-premium",
    "handle": "garlic-powder-velluli-karam-podi-premium",
    "name": "Garlic Powder / Vellulli Karam Podi (Premium Quality)",
    "title": "Garlic Powder / Vellulli Karam Podi (Premium Quality)",
    "category": "Spice Powders",
    "price": 99,
    "originalPrice": 130,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_3_6262e177-7c59-4137-afc4-5d486daa9175.jpg?v=1757334046&width=533",
    "hoverImage": "/assets/images/products/garlic_powder_back.jpg",
    "description": "100% Pure & authentic Garlic Powder / Vellulli Karam Podi (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_3_6262e177-7c59-4137-afc4-5d486daa9175.jpg?v=1757334046&width=533",
      "/assets/images/products/garlic_powder_back.jpg"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_3_6262e177-7c59-4137-afc4-5d486daa9175.jpg?v=1757334046&width=533",
      "/assets/images/products/garlic_powder_back.jpg"
    ]
  },
  {
    "_id": "karivepaku-karam-podi-premium",
    "id": "karivepaku-karam-podi-premium",
    "handle": "karivepaku-karam-podi-premium",
    "name": "Karivepaku Karam Podi (Curry Leaves Karam) (Premium Quality)",
    "title": "Karivepaku Karam Podi (Curry Leaves Karam) (Premium Quality)",
    "category": "Spice Powders",
    "price": 95,
    "originalPrice": 120,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_1_445e71a6-1753-4790-b36c-6606bfbd7414.jpg?v=1757334043&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.44.36_AM_b473978a-44b3-4da2-a619-4863c0fc1e5b.jpg?v=1757334043&width=533",
    "description": "100% Pure & authentic Karivepaku Karam Podi (Curry Leaves Karam) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_1_445e71a6-1753-4790-b36c-6606bfbd7414.jpg?v=1757334043&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.44.36_AM_b473978a-44b3-4da2-a619-4863c0fc1e5b.jpg?v=1757334043&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_1_445e71a6-1753-4790-b36c-6606bfbd7414.jpg?v=1757334043&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.44.36_AM_b473978a-44b3-4da2-a619-4863c0fc1e5b.jpg?v=1757334043&width=533"
    ]
  },
  {
    "_id": "garam-masala-powder-premium",
    "id": "garam-masala-powder-premium",
    "handle": "garam-masala-powder-premium",
    "name": "Garam Masala Powder (Premium Quality)",
    "title": "Garam Masala Powder (Premium Quality)",
    "category": "Powders & Masalas",
    "price": 85,
    "originalPrice": 110,
    "unit": "100 g",
    "image": "/assets/images/products/garam_masala_front.jpg",
    "hoverImage": "/assets/images/products/garam_masala_back.jpg",
    "description": "100% Pure & authentic Garam Masala Powder (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "/assets/images/products/garam_masala_front.jpg",
      "/assets/images/products/garam_masala_back.jpg"
    ],
    "imageUrls": [
      "/assets/images/products/garam_masala_front.jpg",
      "/assets/images/products/garam_masala_back.jpg"
    ]
  },
  {
    "_id": "pepper-powder-premium",
    "id": "pepper-powder-premium",
    "handle": "pepper-powder-premium",
    "name": "Black Pepper Powder (Premium Quality)",
    "title": "Black Pepper Powder (Premium Quality)",
    "category": "Powders & Masalas",
    "price": 95,
    "originalPrice": 125,
    "unit": "100 g",
    "image": "/assets/images/products/pepper_powder_front.jpg",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.04.27_AM_fdc73816-1464-4430-93ba-4bde3c52f6ad.jpg?v=1757334023&width=533",
    "description": "100% Pure & authentic Black Pepper Powder (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "/assets/images/products/pepper_powder_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.04.27_AM_fdc73816-1464-4430-93ba-4bde3c52f6ad.jpg?v=1757334023&width=533"
    ],
    "imageUrls": [
      "/assets/images/products/pepper_powder_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.04.27_AM_fdc73816-1464-4430-93ba-4bde3c52f6ad.jpg?v=1757334023&width=533"
    ]
  },
  {
    "_id": "coriander-powder-premium",
    "id": "coriander-powder-premium",
    "handle": "coriander-powder-premium",
    "name": "Coriander Powder (Dhania) (Premium Quality)",
    "title": "Coriander Powder (Dhania) (Premium Quality)",
    "category": "Powders & Masalas",
    "price": 55,
    "originalPrice": 75,
    "unit": "100 g",
    "image": "/assets/images/products/coriander_powder_front.jpg",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.03.37_AM_ed07471b-5860-4bfe-b13e-b611c8a1ce87.jpg?v=1757334022&width=533",
    "description": "100% Pure & authentic Coriander Powder (Dhania) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "/assets/images/products/coriander_powder_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.03.37_AM_ed07471b-5860-4bfe-b13e-b611c8a1ce87.jpg?v=1757334022&width=533"
    ],
    "imageUrls": [
      "/assets/images/products/coriander_powder_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.03.37_AM_ed07471b-5860-4bfe-b13e-b611c8a1ce87.jpg?v=1757334022&width=533"
    ]
  },
  {
    "_id": "red-chillies-guntur-premium",
    "id": "red-chillies-guntur-premium",
    "handle": "red-chillies-guntur-premium",
    "name": "Red Chillies (Guntur) (Premium Quality)",
    "title": "Red Chillies (Guntur) (Premium Quality)",
    "category": "Spices",
    "price": 85,
    "originalPrice": 115,
    "unit": "250 g",
    "image": "/assets/images/products/guntur_chillies_front.jpg",
    "hoverImage": "/assets/images/products/guntur_chillies_back.jpg",
    "description": "100% Pure & authentic Red Chillies (Guntur) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "/assets/images/products/guntur_chillies_front.jpg",
      "/assets/images/products/guntur_chillies_back.jpg"
    ],
    "imageUrls": [
      "/assets/images/products/guntur_chillies_front.jpg",
      "/assets/images/products/guntur_chillies_back.jpg"
    ]
  },
  {
    "_id": "red-chillies-byadgi-premium",
    "id": "red-chillies-byadgi-premium",
    "handle": "red-chillies-byadgi-premium",
    "name": "Red Chillies (Byadagi) (Premium Quality)",
    "title": "Red Chillies (Byadagi) (Premium Quality)",
    "category": "Spices",
    "price": 95,
    "originalPrice": 125,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/Byadgi_65ac3367-c79c-48f3-a5e1-af2985ebbd33.png?v=1757333963",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.05.59_PM_1_3e1688f4-b68c-45fb-9217-3872fd18bf23.jpg?v=1757333963",
    "description": "100% Pure & authentic Red Chillies (Byadagi) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/Byadgi_65ac3367-c79c-48f3-a5e1-af2985ebbd33.png?v=1757333963",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.05.59_PM_1_3e1688f4-b68c-45fb-9217-3872fd18bf23.jpg?v=1757333963"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/Byadgi_65ac3367-c79c-48f3-a5e1-af2985ebbd33.png?v=1757333963",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.05.59_PM_1_3e1688f4-b68c-45fb-9217-3872fd18bf23.jpg?v=1757333963"
    ]
  },
  {
    "_id": "black-pepper-premium",
    "id": "black-pepper-premium",
    "handle": "black-pepper-premium",
    "name": "Black Pepper (Whole) (Premium Quality)",
    "title": "Black Pepper (Whole) (Premium Quality)",
    "category": "Spices",
    "price": 135,
    "originalPrice": 175,
    "unit": "100 g",
    "image": "/assets/images/products/black_pepper_front.jpg",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.11_PM_1_30a1bf5b-4da7-42a6-92d6-9f209d0d91c0.jpg?v=1757333996&width=533",
    "description": "100% Pure & authentic Black Pepper (Whole) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "/assets/images/products/black_pepper_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.11_PM_1_30a1bf5b-4da7-42a6-92d6-9f209d0d91c0.jpg?v=1757333996&width=533"
    ],
    "imageUrls": [
      "/assets/images/products/black_pepper_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.11_PM_1_30a1bf5b-4da7-42a6-92d6-9f209d0d91c0.jpg?v=1757333996&width=533"
    ]
  },
  {
    "_id": "cinnamon-kerala-style-premium",
    "id": "cinnamon-kerala-style-premium",
    "handle": "cinnamon-kerala-style-premium",
    "name": "Cinnamon (Premium Quality)",
    "title": "Cinnamon (Premium Quality)",
    "category": "Spices",
    "price": 54,
    "originalPrice": 78,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/cinnamon_bd2c52bb-d2df-4d09-baca-93aab2223e68.jpg?v=1757333965&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-12_at_11.48.48_AM.jpg?v=1757333965&width=533",
    "description": "100% Pure & authentic Cinnamon (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/cinnamon_bd2c52bb-d2df-4d09-baca-93aab2223e68.jpg?v=1757333965&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-12_at_11.48.48_AM.jpg?v=1757333965&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/cinnamon_bd2c52bb-d2df-4d09-baca-93aab2223e68.jpg?v=1757333965&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-12_at_11.48.48_AM.jpg?v=1757333965&width=533"
    ]
  },
  {
    "_id": "cloves-premium",
    "id": "cloves-premium",
    "handle": "cloves-premium",
    "name": "Cloves (Lavangalu) (Premium Quality)",
    "title": "Cloves (Lavangalu) (Premium Quality)",
    "category": "Spices",
    "price": 110,
    "originalPrice": 145,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.33.17_PM_e7455739-c811-4135-8760-da32b445f0f0.jpg?v=1757333998&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.09_PM_d713ec77-5974-4551-9346-b1e592b0a512.jpg?v=1757333998&width=533",
    "description": "100% Pure & authentic Cloves (Lavangalu) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.33.17_PM_e7455739-c811-4135-8760-da32b445f0f0.jpg?v=1757333998&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.09_PM_d713ec77-5974-4551-9346-b1e592b0a512.jpg?v=1757333998&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.33.17_PM_e7455739-c811-4135-8760-da32b445f0f0.jpg?v=1757333998&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.09_PM_d713ec77-5974-4551-9346-b1e592b0a512.jpg?v=1757333998&width=533"
    ]
  },
  {
    "_id": "cardamom-premium",
    "id": "cardamom-premium",
    "handle": "cardamom-premium",
    "name": "Cardamom (Elaichi) (Premium Quality)",
    "title": "Cardamom (Elaichi) (Premium Quality)",
    "category": "Spices",
    "price": 240,
    "originalPrice": 310,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.41.25_PM_dd385152-2aab-4061-9f20-60f6b9fec186.jpg?v=1757333997&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_c6567ba5-d81e-4691-a4be-331305e3f75c.jpg?v=1757333998&width=533",
    "description": "100% Pure & authentic Cardamom (Elaichi) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.41.25_PM_dd385152-2aab-4061-9f20-60f6b9fec186.jpg?v=1757333997&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_c6567ba5-d81e-4691-a4be-331305e3f75c.jpg?v=1757333998&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.41.25_PM_dd385152-2aab-4061-9f20-60f6b9fec186.jpg?v=1757333997&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_c6567ba5-d81e-4691-a4be-331305e3f75c.jpg?v=1757333998&width=533"
    ]
  },
  {
    "_id": "star-anise-premium",
    "id": "star-anise-premium",
    "handle": "star-anise-premium",
    "name": "Star Anise (Anasa Puvvu) (Premium Quality)",
    "title": "Star Anise (Anasa Puvvu) (Premium Quality)",
    "category": "Spices",
    "price": 95,
    "originalPrice": 125,
    "unit": "100 g",
    "image": "/assets/images/products/star_anise_front.jpg",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.12_PM_2_a7222bbd-81fe-4bd2-8e22-c0f5fb85fadd.jpg?v=1757334019&width=533",
    "description": "100% Pure & authentic Star Anise (Anasa Puvvu) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "/assets/images/products/star_anise_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.12_PM_2_a7222bbd-81fe-4bd2-8e22-c0f5fb85fadd.jpg?v=1757334019&width=533"
    ],
    "imageUrls": [
      "/assets/images/products/star_anise_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.12_PM_2_a7222bbd-81fe-4bd2-8e22-c0f5fb85fadd.jpg?v=1757334019&width=533"
    ]
  },
  {
    "_id": "flax-seeds-premium",
    "id": "flax-seeds-premium",
    "handle": "flax-seeds-premium",
    "name": "Flax Seeds (Premium Quality)",
    "title": "Flax Seeds (Premium Quality)",
    "category": "Seeds",
    "price": 65,
    "originalPrice": 85,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_2_ce2dcb8e-81dc-46c5-b343-1a14dff25208.jpg?v=1757334052&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.16_PM_2_4f6b641a-6fe0-4060-a49a-3fbd827f8271.jpg?v=1757334053&width=533",
    "description": "100% Pure & authentic Flax Seeds (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_2_ce2dcb8e-81dc-46c5-b343-1a14dff25208.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.16_PM_2_4f6b641a-6fe0-4060-a49a-3fbd827f8271.jpg?v=1757334053&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_2_ce2dcb8e-81dc-46c5-b343-1a14dff25208.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.16_PM_2_4f6b641a-6fe0-4060-a49a-3fbd827f8271.jpg?v=1757334053&width=533"
    ]
  },
  {
    "_id": "chia-seeds-premium",
    "id": "chia-seeds-premium",
    "handle": "chia-seeds-premium",
    "name": "Chia Seeds (Premium Quality)",
    "title": "Chia Seeds (Premium Quality)",
    "category": "Seeds",
    "price": 95,
    "originalPrice": 125,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.01_PM_6b2e5750-03f7-4a0a-b4e3-9ef639891875.jpg?v=1757333987&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.11_AM_88a83afd-35c7-4178-ad6f-170645b5294e.jpg?v=1757333987&width=533",
    "description": "100% Pure & authentic Chia Seeds (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.01_PM_6b2e5750-03f7-4a0a-b4e3-9ef639891875.jpg?v=1757333987&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.11_AM_88a83afd-35c7-4178-ad6f-170645b5294e.jpg?v=1757333987&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.01_PM_6b2e5750-03f7-4a0a-b4e3-9ef639891875.jpg?v=1757333987&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.11_AM_88a83afd-35c7-4178-ad6f-170645b5294e.jpg?v=1757333987&width=533"
    ]
  },
  {
    "_id": "pumpkin-seeds-premium",
    "id": "pumpkin-seeds-premium",
    "handle": "pumpkin-seeds-premium",
    "name": "Pumpkin Seeds (Premium Quality)",
    "title": "Pumpkin Seeds (Premium Quality)",
    "category": "Seeds",
    "price": 135,
    "originalPrice": 175,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_75dca399-7bd1-4c42-a209-50572b825bbe.jpg?v=1757334052&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.35_PM_19a86791-951c-43dc-a1d8-a901b4762faf.jpg?v=1757334053&width=533",
    "description": "100% Pure & authentic Pumpkin Seeds (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_75dca399-7bd1-4c42-a209-50572b825bbe.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.35_PM_19a86791-951c-43dc-a1d8-a901b4762faf.jpg?v=1757334053&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_75dca399-7bd1-4c42-a209-50572b825bbe.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.35_PM_19a86791-951c-43dc-a1d8-a901b4762faf.jpg?v=1757334053&width=533"
    ]
  },
  {
    "_id": "sunflower-seeds-premium",
    "id": "sunflower-seeds-premium",
    "handle": "sunflower-seeds-premium",
    "name": "Sunflower Seeds (Premium Quality)",
    "title": "Sunflower Seeds (Premium Quality)",
    "category": "Seeds",
    "price": 85,
    "originalPrice": 115,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.36_PM_65a6bce3-18ec-4f09-a579-a554b2d9e336.jpg?v=1757333989&width=533",
    "description": "100% Pure & authentic Sunflower Seeds (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.36_PM_65a6bce3-18ec-4f09-a579-a554b2d9e336.jpg?v=1757333989&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.36_PM_65a6bce3-18ec-4f09-a579-a554b2d9e336.jpg?v=1757333989&width=533"
    ]
  },
  {
    "_id": "watermelon-seeds-premium",
    "id": "watermelon-seeds-premium",
    "handle": "watermelon-seeds-premium",
    "name": "Watermelon Seeds (Premium Quality)",
    "title": "Watermelon Seeds (Premium Quality)",
    "category": "Seeds",
    "price": 90,
    "originalPrice": 120,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_97f038b4-8e5f-4d8c-92db-2f4ea8bd24c0.jpg?v=1757333989&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.19.19_PM_2cfd8d9f-66d1-4abb-bc5d-edf3a4b587e8.jpg?v=1757333989&width=533",
    "description": "100% Pure & authentic Watermelon Seeds (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_97f038b4-8e5f-4d8c-92db-2f4ea8bd24c0.jpg?v=1757333989&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.19.19_PM_2cfd8d9f-66d1-4abb-bc5d-edf3a4b587e8.jpg?v=1757333989&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_97f038b4-8e5f-4d8c-92db-2f4ea8bd24c0.jpg?v=1757333989&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.19.19_PM_2cfd8d9f-66d1-4abb-bc5d-edf3a4b587e8.jpg?v=1757333989&width=533"
    ]
  },
  {
    "_id": "sabja-seeds-premium",
    "id": "sabja-seeds-premium",
    "handle": "sabja-seeds-premium",
    "name": "Sabja Seeds (Basil Seeds) (Premium Quality)",
    "title": "Sabja Seeds (Basil Seeds) (Premium Quality)",
    "category": "Seeds",
    "price": 75,
    "originalPrice": 95,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_1_50ee6a3f-891c-482c-95cd-e8fb3bace709.jpg?v=1757333999&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.11_PM_1_e1ca0568-b1c3-4aac-87b5-07791bc44e34.jpg?v=1757334000&width=533",
    "description": "100% Pure & authentic Sabja Seeds (Basil Seeds) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_1_50ee6a3f-891c-482c-95cd-e8fb3bace709.jpg?v=1757333999&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.11_PM_1_e1ca0568-b1c3-4aac-87b5-07791bc44e34.jpg?v=1757334000&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_1_50ee6a3f-891c-482c-95cd-e8fb3bace709.jpg?v=1757333999&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.11_PM_1_e1ca0568-b1c3-4aac-87b5-07791bc44e34.jpg?v=1757334000&width=533"
    ]
  },
  {
    "_id": "sesame-seeds-premium",
    "id": "sesame-seeds-premium",
    "handle": "sesame-seeds-premium",
    "name": "Sesame Seeds (Til) (Premium Quality)",
    "title": "Sesame Seeds (Til) (Premium Quality)",
    "category": "Seeds",
    "price": 80,
    "originalPrice": 105,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.00_AM_-_Copy_ac6c63f6-9657-46dd-a729-82f10320c447.jpg?v=1757333988&width=533",
    "description": "100% Pure & authentic Sesame Seeds (Til) (Premium Quality) freshly packed by Arshith Fresh.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.00_AM_-_Copy_ac6c63f6-9657-46dd-a729-82f10320c447.jpg?v=1757333988&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.00_AM_-_Copy_ac6c63f6-9657-46dd-a729-82f10320c447.jpg?v=1757333988&width=533"
    ]
  }
];

    // Helper to render products instantly onto page elements synchronously
    function renderStorefrontProductsUI(apiProducts) {
        if (!apiProducts || apiProducts.length === 0) {
            if (typeof FALLBACK_STOREFRONT_PRODUCTS !== 'undefined' && Array.isArray(FALLBACK_STOREFRONT_PRODUCTS)) {
                apiProducts = FALLBACK_STOREFRONT_PRODUCTS;
            } else {
                return;
            }
        }

        const catalogPool = (Array.isArray(apiProducts) && apiProducts.length > 0) ? [...apiProducts] : [];
        if (typeof FALLBACK_STOREFRONT_PRODUCTS !== 'undefined' && Array.isArray(FALLBACK_STOREFRONT_PRODUCTS)) {
            FALLBACK_STOREFRONT_PRODUCTS.forEach(fbItem => {
                const fbKey = String(fbItem.id || fbItem._id || fbItem.handle || fbItem.name || '').toLowerCase();
                const exists = catalogPool.some(p => {
                    const pKey = String(p.id || p._id || p.handle || p.name || '').toLowerCase();
                    return pKey === fbKey || (pKey && fbKey && (pKey.includes(fbKey) || fbKey.includes(pKey)));
                });
                if (!exists) {
                    catalogPool.push(fbItem);
                }
            });
        }

        const path = window.location.pathname.toLowerCase();

        // Populate Homepage Carousel grids
        const favGrid = document.querySelector(".sec-favorites .products-grid");
        if (favGrid) {
            const favProducts = catalogPool.filter(p => p.isFeatured !== false).slice(0, 10);
            if (favProducts.length > 0) {
                favGrid.innerHTML = favProducts.map(p => createProductCardHTML(p)).join('');
            }
        }
        const wellnessGrid = document.querySelector(".sec-wellness .products-grid");
        if (wellnessGrid) {
            const wellnessProducts = catalogPool.slice(0, 10);
            if (wellnessProducts.length > 0) {
                wellnessGrid.innerHTML = wellnessProducts.map(p => createProductCardHTML(p)).join('');
            }
        }

        const colGrid = document.getElementById("collectionsProductGrid");
        if (!colGrid) return;

        function getProductNumericPrice(p) {
            if (!p) return 0;
            if (typeof p.salePrice === 'number' && !isNaN(p.salePrice)) return p.salePrice;
            if (typeof p.price === 'number' && !isNaN(p.price)) return p.price;
            if (typeof p.regularPrice === 'number' && !isNaN(p.regularPrice)) return p.regularPrice;
            const str = String(p.salePrice || p.price || p.regularPrice || '');
            const num = parseFloat(str.replace(/[^0-9.]/g, ''));
            return isNaN(num) ? 0 : num;
        }

        function sortCollectionsGridDOM(sortType) {
            const grid = document.getElementById("collectionsProductGrid");
            if (!grid) return;
            const cards = Array.from(grid.querySelectorAll(".product-card"));
            if (cards.length === 0) return;

            const val = (sortType || "").toLowerCase();
            const isLowToHigh = val.includes("low") || val.includes("asc") || val === "price-low";
            const isHighToLow = val.includes("high") || val.includes("desc") || val === "price-high";
            const isRating = val.includes("rating") || val.includes("rated");
            const isTitleAsc = val.includes("a-z") || val === "title-asc";
            const isTitleDesc = val.includes("z-a") || val === "title-desc";

            cards.sort((cardA, cardB) => {
                const getPrice = (card) => {
                    const btn = card.querySelector(".add-to-cart-btn, [onclick*='addToStoreCart']");
                    if (btn) {
                        const onclickAttr = btn.getAttribute("onclick") || "";
                        const match = onclickAttr.match(/addToStoreCart\s*\([^,]+,[^,]+,\s*([0-9.]+)/);
                        if (match) return parseFloat(match[1]);
                    }
                    const saleEl = card.querySelector(".sale-price, .price-box .sale-price");
                    if (saleEl) {
                        const v = parseFloat(saleEl.textContent.replace(/[^0-9.]/g, ''));
                        if (!isNaN(v) && v > 0) return v;
                    }
                    const txt = card.textContent;
                    const matchTxt = txt.match(/Rs\.?\s*([0-9,.]+)/i) || txt.match(/₹\s*([0-9,.]+)/);
                    return matchTxt ? parseFloat(matchTxt[1].replace(/,/g, '')) : 0;
                };

                const getRating = (card) => {
                    const rateEl = card.querySelector(".rating-text");
                    if (rateEl) {
                        const match = rateEl.textContent.match(/([0-9.]+)/);
                        if (match) return parseFloat(match[1]);
                    }
                    return 5.0;
                };

                const getTitle = (card) => {
                    const h = card.querySelector(".card__heading, .product-title, h3, a");
                    return h ? h.textContent.trim().toLowerCase() : "";
                };

                if (isLowToHigh) return getPrice(cardA) - getPrice(cardB);
                if (isHighToLow) return getPrice(cardB) - getPrice(cardA);
                if (isRating) return getRating(cardB) - getRating(cardA);
                if (isTitleAsc) return getTitle(cardA).localeCompare(getTitle(cardB));
                if (isTitleDesc) return getTitle(cardB).localeCompare(getTitle(cardA));
                return 0;
            });

            cards.forEach(card => grid.appendChild(card));
        }

        function sortProductsList(list, sortVal) {
            if (!Array.isArray(list) || !sortVal) return list;
            const arr = [...list];
            const val = (sortVal || "").toLowerCase();
            const isLowToHigh = val.includes("low") || val.includes("asc") || val === "price-low";
            const isHighToLow = val.includes("high") || val.includes("desc") || val === "price-high";
            const isRating = val.includes("rating") || val.includes("rated");
            const isTitleAsc = val.includes("a-z") || val === "title-asc";
            const isTitleDesc = val.includes("z-a") || val === "title-desc";

            if (isLowToHigh) {
                arr.sort((a, b) => getProductNumericPrice(a) - getProductNumericPrice(b));
            } else if (isHighToLow) {
                arr.sort((a, b) => getProductNumericPrice(b) - getProductNumericPrice(a));
            } else if (isRating) {
                arr.sort((a, b) => parseFloat(b.rating || b.ratingStars || 5.0) - parseFloat(a.rating || a.ratingStars || 5.0));
            } else if (isTitleAsc) {
                arr.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
            } else if (isTitleDesc) {
                arr.sort((a, b) => (b.title || b.name || "").localeCompare(a.title || a.name || ""));
            }
            return arr;
        }

        // 1. On All Products page (collections.html)
        if (path.includes("collections.html") || path.endsWith("/collections") || path.endsWith("/collections/")) {
            const urlParams = new URLSearchParams(window.location.search);
            const searchQ = (urlParams.get("search") || urlParams.get("q") || "").trim().toLowerCase();
            const categoryQ = (urlParams.get("category") || urlParams.get("cat") || "").trim().toLowerCase();

            let displayProducts = catalogPool;
            if (searchQ) {
                displayProducts = displayProducts.filter(p => {
                    const title = (p.title || p.name || "").toLowerCase();
                    const cat = (p.category || "").toLowerCase();
                    const sub = (p.subcategory || "").toLowerCase();
                    const desc = (p.description || "").toLowerCase();
                    const brand = (p.brand || "").toLowerCase();
                    return title.includes(searchQ) || cat.includes(searchQ) || sub.includes(searchQ) || desc.includes(searchQ) || brand.includes(searchQ);
                });
            } else if (categoryQ && categoryQ !== "all" && categoryQ !== "all products") {
                const cQ = categoryQ.toLowerCase().replace(/-/g, ' ').trim();
                displayProducts = displayProducts.filter(p => {
                    const cat = (p.category || "").toLowerCase();
                    const title = (p.title || p.name || "").toLowerCase();
                    if (cQ.includes("pickle")) return cat.includes("pickle") || title.includes("pickle");
                    if (cQ.includes("powder") || cQ.includes("masala") || cQ.includes("podi")) return cat.includes("powder") || cat.includes("masala") || title.includes("podi") || title.includes("karam");
                    if (cQ.includes("flour") || cQ.includes("rava")) return cat.includes("flour") || cat.includes("rava");
                    if (cQ.includes("seed")) return cat.includes("seed");
                    if (cQ.includes("dry") || cQ.includes("fruit") || cQ.includes("nut")) return cat.includes("dry fruit") || cat.includes("nuts");
                    if (cQ.includes("ghee") || cQ.includes("honey")) return cat.includes("ghee") || cat.includes("honey");
                    if (cQ.includes("oil")) return cat.includes("oil");
                    if (cQ.includes("spice")) return cat === "spices" || (cat.includes("spice") && !cat.includes("powder"));
                    if (cQ.includes("beverage")) return cat.includes("beverages");
                    if (cQ.includes("papad") || cQ.includes("snack")) return cat.includes("papads");
                    if (cQ.includes("household") || cQ.includes("care")) return cat.includes("household");
                    if (cQ.includes("cooking") || cQ.includes("essential")) return cat.includes("cooking");
                    return cat.includes(cQ) || title.includes(cQ);
                });
            }

            window.activeCollectionsProducts = displayProducts;

            const sortSelectEl = document.getElementById("sortSelect");
            const currentSortVal = sortSelectEl ? sortSelectEl.value : 'featured';
            const sortedDisplayProducts = sortProductsList(displayProducts, currentSortVal);

            if (sortedDisplayProducts.length > 0) {
                colGrid.innerHTML = sortedDisplayProducts.map(p => createProductCardHTML(p)).join('');
                const countElem = document.getElementById("collectionProductCount");
                if (countElem) {
                    const searchLabel = urlParams.get("search") || urlParams.get("q") || urlParams.get("category") || urlParams.get("cat");
                    countElem.textContent = searchLabel 
                        ? `${sortedDisplayProducts.length} product(s) found for "${searchLabel}"`
                        : `${sortedDisplayProducts.length} products`;
                }
            } else {
                colGrid.innerHTML = `
                    <div class="empty-collection-state" style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 16px; margin: 20px 0;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0f7139" stroke-width="1.5" style="margin-bottom: 12px;"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        <h3 style="font-family:'Playfair Display', serif; font-size:20px; color:#0f7139; margin:0 0 8px 0;">No matching products found</h3>
                        <p style="color:#64748b; font-size:14px; margin:0;">No products match your selection. Try searching another category like Pickles, Powders, Oils, or Dry Fruits.</p>
                    </div>
                `;
                const countElem = document.getElementById("collectionProductCount");
                if (countElem) {
                    countElem.textContent = "0 products";
                }
            }

            if (sortSelectEl && !sortSelectEl.dataset.hasSortListener) {
                sortSelectEl.dataset.hasSortListener = "true";
                sortSelectEl.addEventListener("change", (e) => {
                    const sortVal = e.target.value;
                    if (window.activeCollectionsProducts && window.activeCollectionsProducts.length > 0) {
                        const sorted = sortProductsList(window.activeCollectionsProducts, sortVal);
                        colGrid.innerHTML = sorted.map(p => createProductCardHTML(p)).join('');
                    } else {
                        sortCollectionsGridDOM(sortVal);
                    }
                });
            }
            return;
        }

        // 2. On Subcollection pages (pickles, oils, ghee, dry fruits, seeds, spices, powders, cooking essentials, etc.)
        let categoryProducts = [];
        if (catalogPool && catalogPool.length > 0) {
            if (path.includes("pickles")) {
                categoryProducts = catalogPool.filter(p => {
                    const cat = (p.category || "").toLowerCase();
                    const title = (p.title || p.name || "").toLowerCase();
                    return cat.includes("pickle") || cat.includes("pachadi") || title.includes("pickle") || title.includes("pachadi") || title.includes("avakai");
                });
            } else if (path.includes("oils-natural-extracts") || path.includes("oils")) {
                categoryProducts = catalogPool.filter(p => {
                    const cat = (p.category || "").toLowerCase();
                    const subcat = (p.subcategory || "").toLowerCase();
                    const title = (p.title || p.name || "").toLowerCase();
                    const handle = (p.handle || "").toLowerCase();
                    const isOil = cat.includes("oil") || cat.includes("extract") || subcat.includes("oil") || title.includes("oil") || handle.includes("oil");
                    const isNonOil = title.includes("seed") || title.includes("badam") || title.includes("kaju") || cat.includes("seed") || cat.includes("dry fruit");
                    return isOil && !isNonOil;
                });
            } else if (path.includes("ghee-and-honey") || path.includes("ghee")) {
                categoryProducts = catalogPool.filter(p => {
                    const cat = (p.category || "").toLowerCase();
                    const title = (p.title || p.name || "").toLowerCase();
                    return cat.includes("ghee") || cat.includes("honey") || title.includes("ghee") || title.includes("honey");
                });
            } else if (path.includes("dry-fruits-nuts") || path.includes("dry-fruits")) {
                categoryProducts = catalogPool.filter(p => {
                    const cat = (p.category || "").toLowerCase();
                    const title = (p.title || p.name || "").toLowerCase();
                    return cat.includes("dry fruit") || cat.includes("nuts") || title.includes("almond") || title.includes("cashew") || title.includes("fig") || title.includes("walnut") || title.includes("pista") || title.includes("raisin") || title.includes("date") || title.includes("badam") || title.includes("kaju") || title.includes("anjeer");
                });
            } else if (path.includes("dry-seeds") || path.includes("seeds")) {
                categoryProducts = catalogPool.filter(p => {
                    const cat = (p.category || "").toLowerCase();
                    const title = (p.title || p.name || "").toLowerCase();
                    return cat.includes("seed") || title.includes("seed") || title.includes("flax") || title.includes("chia") || title.includes("pumpkin") || title.includes("til") || title.includes("sabja");
                });
            } else if (path.includes("cooking-essentials") || path.includes("essentials")) {
                categoryProducts = catalogPool.filter(p => {
                    const cat = (p.category || "").toLowerCase();
                    const title = (p.title || p.name || "").toLowerCase();
                    return cat.includes("cooking") || cat.includes("essential") || title.includes("essential") || title.includes("salt");
                });
            } else if (path.includes("spice-powders") || path.includes("powders")) {
                categoryProducts = catalogPool.filter(p => {
                    const cat = (p.category || "").toLowerCase();
                    const title = (p.title || p.name || "").toLowerCase();
                    return cat.includes("powder") || cat.includes("masala") || title.includes("podi") || title.includes("karam") || title.includes("powder") || title.includes("masala");
                });
            } else if (path.includes("spices")) {
                categoryProducts = catalogPool.filter(p => {
                    const cat = (p.category || "").toLowerCase();
                    const title = (p.title || p.name || "").toLowerCase();
                    return cat === "spices" || ((cat.includes("spice") || title.includes("cardamom") || title.includes("cinnamon") || title.includes("clove") || title.includes("pepper")) && !cat.includes("powder") && !title.includes("podi") && !title.includes("karam"));
                });
            } else if (path.includes("flours") || path.includes("rava")) {
                categoryProducts = catalogPool.filter(p => {
                    const cat = (p.category || "").toLowerCase();
                    const title = (p.title || p.name || "").toLowerCase();
                    return cat.includes("flour") || cat.includes("rava") || title.includes("flour") || title.includes("rava") || title.includes("atta");
                });
            } else if (path.includes("beverages")) {
                categoryProducts = catalogPool.filter(p => (p.category || "").toLowerCase().includes("beverage"));
            } else if (path.includes("papads") || path.includes("snacks")) {
                categoryProducts = catalogPool.filter(p => (p.category || "").toLowerCase().includes("papad") || (p.category || "").toLowerCase().includes("snack"));
            } else if (path.includes("household") || path.includes("care")) {
                categoryProducts = catalogPool.filter(p => (p.category || "").toLowerCase().includes("household"));
            }
        }

        const urlParamsSub = new URLSearchParams(window.location.search);
        const subQ = (urlParamsSub.get("sub") || urlParamsSub.get("subcategory") || urlParamsSub.get("type") || "").trim().toLowerCase();

        if (subQ && subQ !== "all" && !subQ.startsWith("all ")) {
            categoryProducts = categoryProducts.filter(p => {
                const title = (p.title || p.name || "").toLowerCase();
                const cat = (p.category || "").toLowerCase();
                const subcat = (p.subcategory || "").toLowerCase();
                const desc = (p.description || "").toLowerCase();

                if (subQ.includes("&") || subQ.includes("and")) {
                    const parts = subQ.split(/&|and/).map(s => s.trim().replace(/oil|oils/g, '').trim()).filter(Boolean);
                    return parts.some(part => title.includes(part) || cat.includes(part) || subcat.includes(part) || desc.includes(part));
                }

                const cleanSub = subQ.replace(/oil|oils/g, '').trim();
                if (cleanSub && cleanSub.length >= 3) {
                    return title.includes(cleanSub) || cat.includes(cleanSub) || subcat.includes(cleanSub) || desc.includes(cleanSub);
                }
                return title.includes(subQ) || cat.includes(subQ) || subcat.includes(subQ) || desc.includes(subQ);
            });
        }

        window.activeCollectionsProducts = categoryProducts;

        const sortSelectSub = document.getElementById("sortSelect");
        const currentSortValSub = sortSelectSub ? sortSelectSub.value : 'featured';
        const sortedCategoryProducts = sortProductsList(categoryProducts, currentSortValSub);

        if (sortedCategoryProducts.length > 0) {
            colGrid.innerHTML = sortedCategoryProducts.map(p => createProductCardHTML(p)).join('');
            const countElem = document.getElementById("collectionProductCount");
            if (countElem) {
                countElem.textContent = `${sortedCategoryProducts.length} products`;
            }
        } else {
            colGrid.innerHTML = `
                <div class="empty-collection-state" style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 16px; margin: 20px 0;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0f7139" stroke-width="1.5" style="margin-bottom: 12px;"><path d="M20 7l-8-4-8 4m16 0l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    <h3 style="font-family:'Playfair Display', serif; font-size:20px; color:#0f7139; margin:0 0 8px 0;">No products in this collection yet</h3>
                    <p style="color:#64748b; font-size:14px; margin:0;">Products added by Admin will appear here automatically.</p>
                </div>
            `;
            const countElem = document.getElementById("collectionProductCount");
            if (countElem) {
                countElem.textContent = "0 products";
            }
        }

        if (sortSelectSub && !sortSelectSub.dataset.hasSortListener) {
            sortSelectSub.dataset.hasSortListener = "true";
            sortSelectSub.addEventListener("change", (e) => {
                const sortVal = e.target.value;
                if (window.activeCollectionsProducts && window.activeCollectionsProducts.length > 0) {
                    const sorted = sortProductsList(window.activeCollectionsProducts, sortVal);
                    colGrid.innerHTML = sorted.map(p => createProductCardHTML(p)).join('');
                } else {
                    sortCollectionsGridDOM(sortVal);
                }
            });
        }

        try { syncProductCardSteppers(); } catch(e) {}
    }

    // 9. Dynamic Live API & Collection Product Sync with Instant 0ms Local Cache Render
    async function syncStorefrontProducts() {
        try {
            // STEP 1: Render INSTANTLY from localStorage cache or fallback array before fetch starts
            let cached = null;
            try {
                const stored = localStorage.getItem('arshith_cached_products');
                if (stored) cached = JSON.parse(stored);
            } catch (e) {}

            const initialProducts = (Array.isArray(cached) && cached.length > 0) ? cached : FALLBACK_STOREFRONT_PRODUCTS;
            renderStorefrontProductsUI(initialProducts);

            // STEP 2: Fetch fresh data from API in background and update UI asynchronously
            let apiProducts = [];
            try {
                const apiHost = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:5000';
                const res = await fetch(`${apiHost}/api/products`);
                if (res && res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        apiProducts = data;
                        try {
                            localStorage.setItem('arshith_cached_products', JSON.stringify(apiProducts));
                        } catch (e) {}
                    }
                }
            } catch (err) {
                // API offline or empty
            }

            if (apiProducts && apiProducts.length > 0) {
                renderStorefrontProductsUI(apiProducts);
            }
        } catch (e) {
            console.error("Product sync error:", e);
        }
    }

    function normalizeCartProductKey(item) {
        if (!item) return '';
        const titleStr = String(item.title || item.name || '').trim();
        if (titleStr) {
            return titleStr.toLowerCase().replace(/[^a-z0-9]/g, '');
        }
        const idStr = String(item.id || item._id || item.product || '').trim();
        return idStr.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function sanitizeCartItemPrice(rawPrice) {
        let p = Number(rawPrice) || 0;
        if (p > 0 && p < 1) {
            p = Math.round(p * 100);
        }
        if (p <= 0) p = 59;
        return Math.round(p * 100) / 100;
    }

    // Helper to consolidate duplicate products in cart array into single entries with total combined quantity
    function consolidateCartItems(items) {
        if (!Array.isArray(items) || items.length === 0) return [];
        const map = new Map();
        items.forEach(item => {
            if (!item) return;
            const key = normalizeCartProductKey(item);
            if (!key) return;

            const qty = Math.max(1, Number(item.quantity || item.qty || 1));
            const price = sanitizeCartItemPrice(item.price);
            let title = String(item.title || item.name || "Arshith Fresh Product").trim().replace(/([a-zA-Z0-9])\(/g, '$1 (');

            if (map.has(key)) {
                const existing = map.get(key);
                const newQty = (Number(existing.quantity || existing.qty || 1)) + qty;
                existing.quantity = newQty;
                existing.qty = newQty;
                existing.price = Math.max(Number(existing.price || 0), price);
                if (existing.price > 0 && existing.price < 1) {
                    existing.price = sanitizeCartItemPrice(existing.price);
                }
                if (!existing.image && item.image) existing.image = item.image;
                if (title.includes(' (') && !existing.title.includes(' (')) {
                    existing.title = title;
                    existing.name = title;
                }
            } else {
                map.set(key, {
                    ...item,
                    id: item.id || item._id || item.product || key,
                    title: title,
                    name: title,
                    price: price,
                    quantity: qty,
                    qty: qty
                });
            }
        });
        return Array.from(map.values());
    }
    window.consolidateCartItems = consolidateCartItems;

    // Global Cart State
    let CART_ITEMS = [];
    try {
        const saved = localStorage.getItem("arshith_cart");
        if (saved) {
            CART_ITEMS = consolidateCartItems(JSON.parse(saved));
        }
    } catch (e) {}

    function saveCart() {
        try {
            CART_ITEMS = consolidateCartItems(CART_ITEMS);
            localStorage.setItem("arshith_cart", JSON.stringify(CART_ITEMS));
        } catch (e) {}
        updateCartCountBadge();
        try {
            syncProductCardSteppers();
        } catch (e) {}
    }

    function clearStoreCart() {
        CART_ITEMS.length = 0;
        window.CART_ITEMS = [];
        try {
            localStorage.setItem("arshith_cart", "[]");
            localStorage.removeItem("arshith_cart");
        } catch (e) {}
        updateCartCountBadge();
        if (typeof renderCartPage === "function") {
            try { renderCartPage(); } catch(e) {}
        }
        try {
            syncProductCardSteppers();
        } catch (e) {}
    }

    window.saveCart = saveCart;
    window.clearStoreCart = clearStoreCart;

    function parseAddToCartArgs(element) {
        if (!element) return null;
        if (element.dataset && element.dataset.productId) {
            return {
                id: element.dataset.productId,
                name: element.dataset.productName || element.dataset.productId,
                price: parseFloat(element.dataset.productPrice) || 0,
                image: element.dataset.productImage || ''
            };
        }

        const onclickStr = element.getAttribute("onclick") || "";
        if (!onclickStr.includes("addToStoreCart")) {
            const card = element.closest(".product-card, .af-product-card, .collection-product-card, .product-item, .card");
            if (card && card.dataset && card.dataset.productId) {
                return {
                    id: card.dataset.productId,
                    name: card.dataset.productName || card.dataset.productId,
                    price: parseFloat(card.dataset.productPrice) || 0,
                    image: card.dataset.productImage || ''
                };
            }
            return null;
        }

        try {
            const startIdx = onclickStr.indexOf("addToStoreCart(");
            if (startIdx === -1) return null;
            const inner = onclickStr.substring(startIdx + "addToStoreCart(".length).replace(/\)\s*;?\s*$/, '');
            
            const args = [];
            let current = '';
            let inQuote = false;
            let quoteChar = '';

            for (let i = 0; i < inner.length; i++) {
                const ch = inner[i];
                if ((ch === "'" || ch === '"') && (i === 0 || inner[i - 1] !== '\\')) {
                    if (!inQuote) {
                        inQuote = true;
                        quoteChar = ch;
                    } else if (ch === quoteChar) {
                        inQuote = false;
                        quoteChar = '';
                    } else {
                        current += ch;
                    }
                } else if (ch === ',' && !inQuote) {
                    args.push(current.trim());
                    current = '';
                } else {
                    current += ch;
                }
            }
            if (current.trim()) args.push(current.trim());

            if (args.length >= 1) {
                const cleanArg = (str) => str.replace(/^['"]|['"]$/g, '').trim();
                const id = cleanArg(args[0] || '');
                const name = cleanArg(args[1] || id);
                const price = parseFloat(cleanArg(args[2] || '0')) || 0;
                const image = cleanArg(args[3] || '');
                if (id) {
                    return { id, name, price, image };
                }
            }
        } catch (err) {
            console.error("Error parsing addToStoreCart args:", err);
        }
        return null;
    }

    function getCardProductKey(id, name) {
        const cleanName = String(name || '').trim().replace(/([a-zA-Z0-9])\(/g, '$1 (');
        return (cleanName || id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function syncProductCardSteppers() {
        if (typeof document === 'undefined') return;
        const cards = document.querySelectorAll(".product-card, .af-product-card, .collection-product-card, .collection-product-card-box, .product-item, .card");
        cards.forEach(card => {
            const addBtn = card.querySelector(".add-to-cart-btn, [onclick*='addToStoreCart']");
            let overlay = card.querySelector(".product-qty-overlay");

            if (addBtn) {
                addBtn.style.setProperty("display", "none", "important");
            }

            let info = parseAddToCartArgs(addBtn) || parseAddToCartArgs(overlay) || parseAddToCartArgs(card);
            if (!info && card.dataset && card.dataset.productId) {
                info = {
                    id: card.dataset.productId,
                    name: card.dataset.productName || card.dataset.productId,
                    price: parseFloat(card.dataset.productPrice) || 0,
                    image: card.dataset.productImage || ''
                };
            }
            if (!info || !info.id) {
                const linkEl = card.querySelector("a[href*='id=']");
                if (linkEl) {
                    const hrefStr = linkEl.getAttribute("href") || "";
                    const match = hrefStr.match(/[?&]id=([^&]+)/);
                    if (match) {
                        const idFromUrl = match[1];
                        const titleEl = card.querySelector(".card__heading, .product-title, .af-product-title, h3, h2");
                        const titleText = titleEl ? titleEl.textContent.trim() : idFromUrl;
                        const priceEl = card.querySelector(".sale-price, .price");
                        const priceVal = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 0;
                        const imgEl = card.querySelector("img.primary-img, img");
                        const imgUrl = imgEl ? imgEl.src : '';
                        info = { id: idFromUrl, name: titleText, price: priceVal, image: imgUrl };
                    }
                }
            }
            if (!info || !info.id) {
                const titleEl = card.querySelector(".card__heading, .product-title, .af-product-title, h3, h2");
                if (titleEl) {
                    const titleText = titleEl.textContent.trim();
                    if (titleText) {
                        const priceEl = card.querySelector(".sale-price, .price");
                        const priceVal = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 0;
                        const imgEl = card.querySelector("img.primary-img, img");
                        const imgUrl = imgEl ? imgEl.src : '';
                        info = {
                            id: titleText.toLowerCase().replace(/[^a-z0-9]/g, ''),
                            name: titleText,
                            price: priceVal,
                            image: imgUrl
                        };
                    }
                }
            }

            if (!info || !info.id) return;

            card.dataset.productId = info.id;
            card.dataset.productName = info.name;
            card.dataset.productPrice = info.price;
            if (info.image) card.dataset.productImage = info.image;

            if (addBtn && !addBtn.dataset.productId) {
                addBtn.dataset.productId = info.id;
                addBtn.dataset.productName = info.name;
                addBtn.dataset.productPrice = info.price;
                addBtn.dataset.productImage = info.image;
            }

            const searchKey = getCardProductKey(info.id, info.name);
            const idKey = String(info.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');

            const cartItem = (CART_ITEMS || []).find(item => {
                const itemKey = normalizeCartProductKey(item);
                const itemIdKey = String(item.id || item._id || item.product || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                return (itemKey && (itemKey === searchKey || itemKey === idKey)) || (itemIdKey && itemIdKey === idKey);
            });

            const qty = cartItem ? Number(cartItem.quantity || cartItem.qty || 0) : 0;
            const imgContainer = card.querySelector(".product-image-container, .product-card-img-wrap") || card;
            if (imgContainer) {
                imgContainer.style.setProperty("position", "relative", "important");
            }
            if (card) {
                card.style.setProperty("position", "relative", "important");
            }

            if (!overlay) {
                overlay = document.createElement("div");
                overlay.className = "product-qty-overlay";
                imgContainer.appendChild(overlay);
            } else if (overlay.parentElement !== imgContainer) {
                imgContainer.appendChild(overlay);
            }

            overlay.dataset.productId = info.id;
            overlay.dataset.productName = info.name;
            overlay.dataset.productPrice = info.price;
            overlay.dataset.productImage = info.image || '';
            
            const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
            overlay.style.setProperty("display", "inline-flex", "important");
            overlay.style.setProperty("position", "absolute", "important");
            overlay.style.setProperty("top", "auto", "important");
            overlay.style.setProperty("bottom", isMobile ? "6px" : "10px", "important");
            overlay.style.setProperty("right", isMobile ? "8px" : "12px", "important");
            overlay.style.setProperty("left", "auto", "important");
            overlay.style.setProperty("z-index", "35", "important");

            const newQtyStr = String(qty);
            if (overlay.dataset.renderedQty !== newQtyStr) {
                overlay.dataset.renderedQty = newQtyStr;
                if (qty > 0) {
                    overlay.classList.add("in-cart");
                    overlay.innerHTML = `
                        <button type="button" class="stepper-btn stepper-minus" aria-label="Decrease quantity">−</button>
                        <span class="stepper-qty">${qty}</span>
                        <button type="button" class="stepper-btn stepper-plus" aria-label="Increase quantity">+</button>
                    `;
                } else {
                    overlay.classList.remove("in-cart");
                    overlay.innerHTML = `
                        <button type="button" class="stepper-btn stepper-add-single" aria-label="Add to cart">+</button>
                    `;
                }
            }
        });
    }

    function changeCardItemQty(id, name, price, image, delta) {
        if (!id && !name) return;
        CART_ITEMS = consolidateCartItems(CART_ITEMS);
        const cleanName = String(name || id || '').trim().replace(/([a-zA-Z0-9])\(/g, '$1 (');
        const nameKey = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const idKey = String(id || name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const d = Number(delta) || 1;

        let existing = CART_ITEMS.find(item => {
            const itemTitleKey = normalizeCartProductKey(item);
            const itemIdKey = String(item.id || item._id || item.product || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            return (nameKey && itemTitleKey === nameKey) || (idKey && (itemTitleKey === idKey || itemIdKey === idKey));
        });

        if (existing) {
            let currentQty = Number(existing.quantity || existing.qty || 1);
            let newQty = currentQty + d;
            if (newQty <= 0) {
                const index = CART_ITEMS.indexOf(existing);
                if (index > -1) {
                    CART_ITEMS.splice(index, 1);
                }
                if (typeof showToast === "function") {
                    showToast(`Removed ${cleanName || existing.title || 'Item'} from cart`);
                }
            } else {
                existing.quantity = newQty;
                existing.qty = newQty;
            }
        } else if (d > 0) {
            CART_ITEMS.push({
                id: id || String(Date.now()),
                title: cleanName || "Arshith Fresh Product",
                name: cleanName || "Arshith Fresh Product",
                price: sanitizeCartItemPrice(price),
                image: image || "assets/images/placeholder.svg",
                quantity: d,
                qty: d
            });
        }
        saveCart();
    }

    window.syncProductCardSteppers = syncProductCardSteppers;
    window.changeCardItemQty = changeCardItemQty;

    if (typeof document !== 'undefined') {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.stepper-btn');
            if (!btn) return;

            const overlay = btn.closest('.product-qty-overlay');
            if (overlay) {
                e.preventDefault();
                e.stopPropagation();
                
                const card = overlay.closest('.product-card, .af-product-card, .collection-product-card, .collection-product-card-box, .product-item, .card');
                const addBtn = card ? card.querySelector(".add-to-cart-btn, [onclick*='addToStoreCart']") : null;
                
                let info = parseAddToCartArgs(overlay) || parseAddToCartArgs(addBtn) || parseAddToCartArgs(card);

                if (!info || !info.id || !info.name) {
                    if (card) {
                        const linkEl = card.querySelector("a[href*='id=']");
                        if (linkEl) {
                            const hrefStr = linkEl.getAttribute("href") || "";
                            const match = hrefStr.match(/[?&]id=([^&]+)/);
                            if (match) {
                                const idFromUrl = match[1];
                                const titleEl = card.querySelector(".card__heading, .product-title, .af-product-title, h3, h2");
                                const titleText = titleEl ? titleEl.textContent.trim() : idFromUrl;
                                const priceEl = card.querySelector(".sale-price, .price");
                                const priceVal = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 0;
                                const imgEl = card.querySelector("img.primary-img, img");
                                const imgUrl = imgEl ? imgEl.src : '';
                                info = { id: idFromUrl, name: titleText, price: priceVal, image: imgUrl };
                            }
                        }
                    }
                }

                if (!info || (!info.id && !info.name)) return;
                
                const id = info.id || info.name;
                const name = info.name || info.id;
                const price = Number(info.price) || 0;
                const image = info.image || '';
                
                overlay.dataset.productId = id;
                overlay.dataset.productName = name;
                overlay.dataset.productPrice = price;
                overlay.dataset.productImage = image;
                
                if (!overlay.classList.contains('in-cart') || btn.classList.contains('stepper-add-single')) {
                    addToStoreCart(id, name, price, image, 1);
                } else {
                    const delta = btn.classList.contains('stepper-minus') ? -1 : 1;
                    changeCardItemQty(id, name, price, image, delta);
                }
            }
        }, true);
    }

    function addToStoreCart(id, name, price, image, qty = 1) {
        if (!id && !name) return;
        CART_ITEMS = consolidateCartItems(CART_ITEMS);
        const cleanName = String(name || id || '').trim().replace(/([a-zA-Z0-9])\(/g, '$1 (');
        const nameKey = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const idKey = String(id || name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const addQty = Number(qty) || 1;
        
        const existing = CART_ITEMS.find(item => {
            const itemTitleKey = normalizeCartProductKey(item);
            const itemIdKey = String(item.id || item._id || item.product || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            return (nameKey && itemTitleKey === nameKey) || (idKey && (itemTitleKey === idKey || itemIdKey === idKey));
        });

        let finalQty = addQty;
        let sanitizedPrice = sanitizeCartItemPrice(price);

        if (existing) {
            existing.quantity = (Number(existing.quantity || existing.qty || 1)) + addQty;
            existing.qty = existing.quantity;
            existing.price = Math.max(Number(existing.price || 0), sanitizedPrice);
            finalQty = existing.quantity;
        } else {
            CART_ITEMS.push({
                id: id || String(Date.now()),
                title: cleanName || "Arshith Fresh Product",
                name: cleanName || "Arshith Fresh Product",
                price: sanitizedPrice,
                image: image || "assets/images/placeholder.svg",
                quantity: addQty,
                qty: addQty
            });
        }
        saveCart();
        if (typeof showToast === "function") {
            showToast(`Added ${cleanName} to cart! (Quantity: ${finalQty})`);
        } else {
            alert(`Added ${cleanName} to cart! (Quantity: ${finalQty})`);
        }
    }
    window.addToStoreCart = addToStoreCart;

    function updateCartQuantity(index, newQty) {
        const qtyNum = Number(newQty);
        if (isNaN(qtyNum) || qtyNum <= 0) {
            if (index >= 0 && index < CART_ITEMS.length) {
                CART_ITEMS.splice(index, 1);
            }
        } else {
            if (CART_ITEMS[index]) {
                CART_ITEMS[index].quantity = qtyNum;
                CART_ITEMS[index].qty = qtyNum;
            }
        }
        saveCart();
        if (typeof renderCartPage === 'function') {
            try { renderCartPage(); } catch (e) {}
        }
    }

    function removeFromCart(index) {
        CART_ITEMS.splice(index, 1);
        saveCart();
    }

    function ensureStickyCartBarElement() {
        const path = window.location.pathname.toLowerCase();
        if (
            path.endsWith('/cart.html') || path.endsWith('/cart') || 
            path.endsWith('/checkout.html') || path.endsWith('/checkout') ||
            path.includes('/auth/') || path.includes('login.html') || 
            path.includes('register.html') || path.includes('create-account.html') || 
            path.includes('forgot-password.html') || path.includes('reset-password.html') ||
            path.includes('/admin/')
        ) {
            const existing = document.getElementById("stickyCartBar");
            if (existing) {
                existing.style.setProperty("display", "none", "important");
            }
            return null;
        }

        let bar = document.getElementById("stickyCartBar");
        if (!bar) {
            bar = document.createElement("a");
            bar.id = "stickyCartBar";
            bar.className = "sticky-cart-bar";
            bar.setAttribute("aria-label", "Open cart");
            bar.innerHTML = `
                <div class="cart-bar-header" id="cartBarHeader">
                    Free Shipping on all orders above 1000/-
                </div>
                <div class="cart-bar-body">
                    <div class="cart-bar-left-group">
                        <span class="cart-bar-icon-box">🛒</span>
                        <span id="cartBarCount" class="cart-bar-count">0 items</span>
                        <span id="cartBarTotal" class="cart-bar-price">₹0</span>
                    </div>
                    <span class="cart-bar-link">Cart</span>
                </div>
            `;
            document.body.appendChild(bar);
        } else {
            const body = bar.querySelector('.cart-bar-body');
            if (body && !body.querySelector('.cart-bar-left-group')) {
                body.innerHTML = `
                    <div class="cart-bar-left-group">
                        <span class="cart-bar-icon-box">🛒</span>
                        <span id="cartBarCount" class="cart-bar-count">0 items</span>
                        <span id="cartBarTotal" class="cart-bar-price">₹0</span>
                    </div>
                    <span class="cart-bar-link">Cart</span>
                `;
            }
        }
        return bar;
    }

    function updateCartCountBadge() {
        let items = CART_ITEMS || [];
        try {
            const saved = localStorage.getItem("arshith_cart");
            if (saved) {
                items = JSON.parse(saved);
                CART_ITEMS = items;
                window.CART_ITEMS = items;
            }
        } catch (e) {}

        const totalCount = items.reduce((sum, item) => sum + Math.max(1, Number(item.quantity || item.qty || 1)), 0);
        const subtotal = items.reduce((sum, item) => sum + ((Number(item.price || 0)) * Math.max(1, Number(item.quantity || item.qty || 1))), 0);

        // Update all badge elements across pages
        const badges = document.querySelectorAll(".cart-count, .cart-badge-num, #checkoutTopCartCount, .cart-count-badge");
        badges.forEach(b => {
            b.textContent = totalCount;
        });

        // Always update any sticky cart bar count and price elements in the document
        const allBarCounts = document.querySelectorAll("#cartBarCount, .cart-bar-count");
        allBarCounts.forEach(el => {
            el.textContent = `${totalCount} item${totalCount !== 1 ? 's' : ''}`;
        });

        const allBarTotals = document.querySelectorAll("#cartBarTotal, .cart-bar-price");
        allBarTotals.forEach(el => {
            el.textContent = `₹${subtotal.toFixed(0)}`;
        });

        const barElement = ensureStickyCartBarElement();
        if (barElement) {
            const isModalActive = document.querySelector(
                '#arshithSignupModalOverlay.show, #arshithFestiveModalOverlay.show, .signup-modal-overlay.show, .festive-modal-overlay.show, .modal.show, .modal-overlay.show, [id*="Modal"][class*="show"], [id*="Overlay"][class*="show"]'
            );
            if (isModalActive || document.body.classList.contains('modal-open')) {
                barElement.style.setProperty("display", "none", "important");
                return;
            }

            const barHeader = document.getElementById("cartBarHeader") || barElement.querySelector('.cart-bar-header');
            if (barHeader) {
                if (subtotal >= 1000) {
                    barHeader.textContent = "🎉 You unlocked FREE Shipping!";
                } else if (subtotal > 0) {
                    barHeader.textContent = `FREE Shipping on all orders above ₹1,000 (Add ₹${Math.max(0, 1000 - subtotal).toFixed(0)} more)`;
                } else {
                    barHeader.textContent = "FREE Shipping on all orders above ₹1,000";
                }
            }

            const cartUrl = getStoreCartUrl();
            barElement.setAttribute("href", cartUrl);
            barElement.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = cartUrl;
            };

            if (totalCount > 0) {
                barElement.style.cssText = "display: flex !important; opacity: 1 !important; visibility: visible !important; pointer-events: auto !important;";
            } else {
                barElement.style.setProperty("display", "none", "important");
            }
        }
    }

    function getStoreCartUrl() {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            if (path.includes('/categories/') || path.includes('/policies/') || path.includes('/auth/')) {
                return '../cart.html';
            }
            return 'cart.html';
        }
        return 'pages/cart.html';
    }

    function initStickyCartBar() {
        updateCartCountBadge();
    }

    // Auto-update badges & sticky bar on page load, history navigation, and cross-tab storage changes
    document.addEventListener("DOMContentLoaded", () => {
        updateCartCountBadge();
        initStickyCartBar();
        try { syncProductCardSteppers(); } catch(e) {}
    });
    window.addEventListener("pageshow", () => {
        updateCartCountBadge();
        initStickyCartBar();
        try { syncProductCardSteppers(); } catch(e) {}
    });
    window.addEventListener("storage", () => {
        updateCartCountBadge();
        initStickyCartBar();
        try { syncProductCardSteppers(); } catch(e) {}
    });
    try { 
        updateCartCountBadge(); 
        initStickyCartBar();
        syncProductCardSteppers();
    } catch (e) {}

    window.CART_ITEMS = CART_ITEMS;
    window.addToStoreCart = addToStoreCart;
    window.updateCartQuantity = updateCartQuantity;
    window.removeFromCart = removeFromCart;
    window.saveCart = saveCart;
    window.updateCartCountBadge = updateCartCountBadge;
    window.initStickyCartBar = initStickyCartBar;
    window.extractProductImageData = extractProductImageData;

    function getNeutralPlaceholder(depth) {
        if (depth === 2) return "../../assets/images/placeholder.svg";
        if (depth === 1) return "../assets/images/placeholder.svg";
        return "assets/images/placeholder.svg";
    }

    function extractProductImageData(p, fallbackDepth) {
        const depth = typeof fallbackDepth === 'number' ? fallbackDepth : 0;
        const neutralPlaceholder = getNeutralPlaceholder(depth);
        if (!p || typeof p !== 'object') {
            return { primary: neutralPlaceholder, hover: '', all: [neutralPlaceholder], hasValid: false };
        }

        const candidates = [];
        const addCandidate = (val) => {
            if (!val) return;
            if (typeof val === 'string') {
                const trimmed = val.trim();
                if (trimmed && !trimmed.includes('placeholder.svg') && !candidates.includes(trimmed)) {
                    candidates.push(trimmed);
                }
            } else if (typeof val === 'object') {
                const url = (val.url || val.src || val.path || val.location || '').trim();
                if (url && !url.includes('placeholder.svg') && !candidates.includes(url)) {
                    candidates.push(url);
                }
            }
        };

        if (Array.isArray(p.images)) p.images.forEach(addCandidate);
        if (Array.isArray(p.imageUrls)) p.imageUrls.forEach(addCandidate);
        if (Array.isArray(p.photos)) p.photos.forEach(addCandidate);

        addCandidate(p.image);
        addCandidate(p.imageUrl);
        addCandidate(p.image_url);
        addCandidate(p.img);
        addCandidate(p.thumbnail);
        addCandidate(p.thumb);
        addCandidate(p.photo);
        addCandidate(p.src);

        // If candidates is empty or has no valid non-placeholder images, search catalog or keyword fallbacks
        if (candidates.length === 0) {
            const pId = String(p.id || p._id || p.handle || p.slug || '').toLowerCase();
            const pName = String(p.name || p.title || p.productName || '').toLowerCase();
            const pCategory = String(p.category || '').toLowerCase();

            let catalogMatch = null;
            const searchPool = (typeof window !== 'undefined' && Array.isArray(window.ALL_STOREFRONT_PRODUCTS) && window.ALL_STOREFRONT_PRODUCTS.length > 0)
                ? window.ALL_STOREFRONT_PRODUCTS
                : (typeof FALLBACK_STOREFRONT_PRODUCTS !== 'undefined' ? FALLBACK_STOREFRONT_PRODUCTS : []);

            if (Array.isArray(searchPool) && searchPool.length > 0) {
                catalogMatch = searchPool.find(item => {
                    const itemId = String(item.id || item._id || item.handle || item.slug || '').toLowerCase();
                    const itemAliases = Array.isArray(item.aliases) ? item.aliases.map(a => String(a).toLowerCase()) : [];
                    const itemName = String(item.name || item.title || '').toLowerCase();

                    if (pId && (itemId === pId || itemAliases.includes(pId))) return true;
                    if (pId && itemId && (itemId.includes(pId) || pId.includes(itemId))) return true;
                    if (pName && itemName && (itemName === pName || itemName.includes(pName) || pName.includes(itemName))) return true;
                    return false;
                });
            }

            if (catalogMatch) {
                addCandidate(catalogMatch.image);
                addCandidate(catalogMatch.imageUrl);
                if (Array.isArray(catalogMatch.images)) catalogMatch.images.forEach(addCandidate);
                if (catalogMatch.hoverImage && !p.hoverImage) p.hoverImage = catalogMatch.hoverImage;
            }

            // Keyword fallback map if still no candidates
            if (candidates.length === 0) {
                const combinedText = `${pId} ${pName} ${pCategory}`.toLowerCase();
                const KEYWORD_IMAGE_MAP = [
                    { keys: ['coriander seed', 'coriander-seed', 'coriander-premium'], url: 'assets/images/products/coriander_seeds.jpg' },
                    { keys: ['cumin seed', 'cumin-seed', 'cumin-premium'], url: 'assets/images/products/cumin_seeds.jpg' },
                    { keys: ['black pepper whole', 'black-pepper-premium'], url: 'assets/images/products/black_pepper.jpg' },
                    { keys: ['star anise', 'star-anise-premium'], url: 'assets/images/products/star_anise.jpg' },
                    { keys: ['chilli powder', 'chilli-powder'], url: 'assets/images/products/chilli-powder.jpg' },
                    { keys: ['monthly grocery 6', 'monthly-grocery-6-members'], url: 'assets/images/products/monthly_grocery_6_members.jpg' },
                    { keys: ['garlic powder', 'velluli karam'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_3_6262e177-7c59-4137-afc4-5d486daa9175.jpg?v=1757334046&width=533' },
                    { keys: ['chana dal spice', 'pappula podi'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_2_717030b8-c8a8-40a4-bdf0-7e516dec3029.jpg?v=1757334045&width=533' },
                    { keys: ['nalla karam'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.02_PM_c823be1b-85bf-4371-8236-9e09b3af2ef5.jpg?v=1757334045&width=533' },
                    { keys: ['kobbari karam'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.00_PM_33a6719d-7dd6-4772-add2-2a37e2461d57.jpg?v=1757334044&width=533' },
                    { keys: ['karivepaku karam'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_1_aefb0a70-8bbf-4ec8-a727-8494ca7dbf25.jpg?v=1757334044&width=533' },
                    { keys: ['garam masala'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.00_PM_1_f852ab1e-089c-4aa7-bdf2-5b927a7c735d.jpg?v=1757334044&width=533' },
                    { keys: ['flax seed', 'flax-seed'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_2_ce2dcb8e-81dc-46c5-b343-1a14dff25208.jpg?v=1757334053&width=533' },
                    { keys: ['chia seed', 'chia-seed'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.11_AM_88a83afd-35c7-4178-ad6f-170645b5294e.jpg?v=1757333987&width=533' },
                    { keys: ['pumpkin seed', 'pumpkin-seed'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_75dca399-7bd1-4c42-a209-50572b825bbe.jpg?v=1757334052&width=533' },
                    { keys: ['sunflower seed', 'sunflower-seed'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533' },
                    { keys: ['watermelon seed', 'watermelon-seed'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_97f038b4-8e5f-4d8c-92db-2f4ea8bd24c0.jpg?v=1757333989&width=533' },
                    { keys: ['sabja', 'basil seed'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_1_50ee6a3f-891c-482c-95cd-e8fb3bace709.jpg?v=1757333999&width=533' },
                    { keys: ['poppy', 'khasa'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_2.34.06_PM_a31b633d-23d9-4314-9b5b-8dcdd932dab6.jpg?v=1757334024&width=533' },
                    { keys: ['groundnut oil', 'groundnut-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533' },
                    { keys: ['sunflower oil', 'sunflower-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533' },
                    { keys: ['sesame oil', 'sesame-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533' },
                    { keys: ['castor oil', 'castor-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533' },
                    { keys: ['coconut oil', 'coconut-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533' },
                    { keys: ['mustard oil', 'mustard-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533' },
                    { keys: ['neem oil', 'neem-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533' },
                    { keys: ['ghee', 'buffalo ghee'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_4.34.52_PM.jpg?v=1757934372&width=533' },
                    { keys: ['cashew', 'kaju'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b7e9-4467-9bb3-93cfc319c5c2.jpg?v=1757334003&width=533' },
                    { keys: ['almond', 'badam'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533' },
                    { keys: ['fig', 'anjeer'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-16_at_6.03.06_PM_34ff0f49-adf5-47c3-979c-8e5ab7a6db71.jpg?v=1757334000&width=533' },
                    { keys: ['walnut', 'akhrot'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2_372210ff-499e-4854-b1ba-7ac50bb3a105.jpg?v=1757334002&width=533' },
                    { keys: ['pistachio', 'pista'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.30_PM_6c318297-0c92-4757-979e-e2f0cfce82b1.jpg?v=1757333991&width=533' },
                    { keys: ['raisin', 'kishmish'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-23_at_11.08.13_AM_4544f222-b6d5-41c1-9080-60b5e28a5cf5.jpg?v=1757334001&width=533' },
                    { keys: ['date', 'khajoor'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_5.03.23_PM_21ec1f88-8a08-488f-a8ce-1967e45fef85.jpg?v=1757333990&width=533' },
                    { keys: ['pickle', 'avakai'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-20_at_12.12.10_PM_1_7e869e3d-6430-4313-8bcd-0f07e53ad1ed.jpg?v=1757333951' }
                ];

                for (const mapItem of KEYWORD_IMAGE_MAP) {
                    if (mapItem.keys.some(k => combinedText.includes(k))) {
                        addCandidate(mapItem.url);
                        break;
                    }
                }
            }
        }

        const apiHost = typeof getApiHost === 'function' ? getApiHost() : (window.location.origin.startsWith('http') ? window.location.origin : 'http://localhost:5000');

        const resolvedUrls = candidates.map(url => {
            if (!url) return '';
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/')) {
                return url;
            }
            if (url.startsWith('//')) {
                return window.location.protocol + url;
            }
            const cleanPath = url.startsWith('/') ? url : '/' + url;
            return `${apiHost}${cleanPath}`;
        }).filter(Boolean);

        let hoverCandidate = '';
        if (p.hoverImage) {
            const hVal = typeof p.hoverImage === 'string' ? p.hoverImage.trim() : (p.hoverImage.url || p.hoverImage.src || '').trim();
            if (hVal && !hVal.includes('placeholder.svg')) {
                if (hVal.startsWith('http://') || hVal.startsWith('https://') || hVal.startsWith('data:image/')) {
                    hoverCandidate = hVal;
                } else if (hVal.startsWith('//')) {
                    hoverCandidate = window.location.protocol + hVal;
                } else {
                    const cleanH = hVal.startsWith('/') ? hVal : '/' + hVal;
                    hoverCandidate = `${apiHost}${cleanH}`;
                }
            }
        }

        const primary = resolvedUrls.length > 0 ? resolvedUrls[0] : neutralPlaceholder;
        let hover = '';
        if (resolvedUrls.length > 1 && resolvedUrls[1] !== primary) {
            hover = resolvedUrls[1];
        } else if (hoverCandidate && hoverCandidate !== primary) {
            hover = hoverCandidate;
        }

        const allFinal = [...resolvedUrls];
        if (hover && !allFinal.includes(hover)) {
            allFinal.push(hover);
        }

        return {
            primary,
            hover,
            all: allFinal.length > 0 ? allFinal : [neutralPlaceholder],
            hasValid: allFinal.length > 0
        };
    }

    function createProductCardHTML(p) {
        if (!p) return "";
        try {
            const path = window.location.pathname.toLowerCase();
            let depth = 0;
            if (path.includes("/pages/categories/") || path.includes("/pages/auth/") || path.includes("/pages/policies/")) {
                depth = 2;
            } else if (path.includes("/pages/")) {
                depth = 1;
            }

            const neutralPlaceholder = getNeutralPlaceholder(depth);
            const imgData = extractProductImageData(p, depth);
            const primaryImgUrl = imgData.primary;
            const secondImgUrl = imgData.hover;
            const hasSecondImage = Boolean(secondImgUrl);

            const rawName = p.name || p.title || p.productName || "Arshith Fresh Product";
            const name = rawName.replace(/"/g, '&quot;');
            const safeNameForJs = rawName.replace(/['"\\]/g, "\\$&");
            const safeImgForJs = primaryImgUrl.replace(/['"\\]/g, "\\$&");

            const price = Number(p.price || p.salePrice || p.currentPrice || 30);
            const originalPrice = Number(p.originalPrice || p.regularPrice || p.mrp || Math.round(price * 1.25));
            const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
            const reviewsCount = p.reviewsCount || p.numReviews || Math.floor(Math.random() * 20) + 25;
            const id = p.handle || p.slug || p.id || p._id || (rawName || '').toLowerCase().replace(/[^a-z0-9]/g, '-');

            let productUrl = "pages/product.html";
            if (depth === 2) productUrl = "../product.html";
            else if (depth === 1) productUrl = "product.html";
            if (id) productUrl += `?id=${encodeURIComponent(id)}`;

            const inStock = (p.countInStock === undefined || p.countInStock === null) ? true : (Number(p.countInStock) > 0);
            const isWishlisted = typeof isItemInWishlist === 'function' ? isItemInWishlist(id) : false;

            const searchKey = typeof getCardProductKey === 'function' ? getCardProductKey(id, rawName) : id;
            const idKey = String(id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const cartItem = (typeof CART_ITEMS !== 'undefined' && Array.isArray(CART_ITEMS)) ? CART_ITEMS.find(item => {
                const itemKey = typeof normalizeCartProductKey === 'function' ? normalizeCartProductKey(item) : '';
                const itemIdKey = String(item.id || item._id || item.product || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                return (itemKey && (itemKey === searchKey || itemKey === idKey)) || (itemIdKey && itemIdKey === idKey);
            }) : null;

            const qty = cartItem ? Number(cartItem.quantity || cartItem.qty || 0) : 0;
            const isInCart = qty > 0;

            const stepperHTML = inStock ? `
                <div class="product-qty-overlay ${isInCart ? 'in-cart' : ''}" 
                     data-product-id="${id}" 
                     data-product-name="${safeNameForJs}" 
                     data-product-price="${price}" 
                     data-product-image="${safeImgForJs}" 
                     data-rendered-qty="${qty}"
                     onclick="event.stopPropagation();">
                    ${isInCart ? `
                        <button type="button" class="stepper-btn stepper-minus" aria-label="Decrease quantity">−</button>
                        <span class="stepper-qty">${qty}</span>
                        <button type="button" class="stepper-btn stepper-plus" aria-label="Increase quantity">+</button>
                    ` : `
                        <button type="button" class="stepper-btn stepper-add-single" aria-label="Add to cart">+</button>
                    `}
                </div>
            ` : '';

            return `
                <div class="product-card ${inStock ? '' : 'product-card-out-of-stock'}" data-product-id="${id}" data-product-name="${safeNameForJs}" data-product-price="${price}">
                    <a href="${productUrl}" class="product-card-link" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; flex: 1 1 auto; cursor: pointer;">
                        <div class="product-image-container ${hasSecondImage ? 'has-second-img' : ''}" ontouchstart="if (this.classList.contains('has-second-img')) { this.classList.toggle('touch-active'); }">
                            ${discount > 0 ? `<span class="card-discount-tag">${discount}% Off</span>` : ''}
                            <button type="button" class="product-card-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.preventDefault(); event.stopPropagation(); toggleWishlistFromCard('${id}', '${safeNameForJs}', ${price}, '${safeImgForJs}', this)" title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}" aria-label="Wishlist">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="${isWishlisted ? '#ef4444' : 'none'}" stroke="${isWishlisted ? '#ef4444' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                            </button>
                            ${!inStock ? `<span class="card-out-of-stock-tag" style="position: absolute; top: 10px; right: 10px; background: #dc2626; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; z-index: 2; letter-spacing: 0.5px;">OUT OF STOCK</span>` : ''}
                            <img src="${primaryImgUrl}" alt="${name}" class="primary-img" style="${inStock ? '' : 'opacity: 0.7;'}" onerror="this.onerror=null; this.src='${neutralPlaceholder}';">
                            ${hasSecondImage ? `<img src="${secondImgUrl}" alt="${name} hover image" class="hover-img" onerror="this.onerror=null; this.style.display='none';">` : ''}
                            ${stepperHTML}
                        </div>
                        <div class="product-info">
                            <h3 class="card__heading" title="${name}">${name}</h3>
                            <div class="rating-box">
                                <span class="rating-stars">★★★★★</span>
                                <span class="rating-text">4.9 / 5.0 (${reviewsCount})</span>
                            </div>
                            <div class="price-box">
                                ${originalPrice > price ? `<span class="regular-price">Rs. ${originalPrice.toFixed(2)}</span>` : ''}
                                <span class="sale-price">From Rs. ${price.toFixed(2)}</span>
                            </div>
                        </div>
                    </a>
                    ${inStock ? `
                        <button class="add-to-cart-btn" style="display: none !important;" onclick="addToStoreCart('${id}', '${safeNameForJs}', ${price}, '${safeImgForJs}')">ADD TO CART</button>
                    ` : `
                        <button class="add-to-cart-btn disabled" disabled style="background: #f1f5f9; color: #94a3b8; border: 1px solid #cbd5e1; cursor: not-allowed; opacity: 0.85;">OUT OF STOCK</button>
                    `}
                </div>
            `;
        } catch (err) {
            console.error("Error creating product card HTML:", err);
            return "";
        }
    }

    // 3. Sync Storefront Homepage Collections from Database
    async function syncStorefrontCollections() {
        const slider = document.querySelector(".categories-grid, .categories-slider") || document.getElementById("categoriesSlider");
        if (!slider) return;

        function getCanonicalColImage(col) {
            if (col && col.image && typeof col.image === 'string' && col.image.startsWith('http')) return col.image;
            const t = (col ? (col.title || col.name || '') : '').toLowerCase();
            if (t.includes('pickle')) return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-20_at_12.12.10_PM_1_7e869e3d-6430-4313-8bcd-0f07e53ad1ed.jpg?v=1757333951';
            if (t.includes('oil')) return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=400';
            if (t.includes('dry fruit') || t.includes('nut') || t.includes('badam') || t.includes('kaju')) return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/seeds_dry_fruits_nuts_webp_200x200_crop_center.jpg?v=1746963459';
            if (t.includes('seed')) return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/dry_seeds_200x200_crop_center.jpg?v=1746963515';
            if (t.includes('ghee') || t.includes('honey')) return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/ghee_1_200x200_crop_center.jpg?v=1746964905';
            if (t.includes('cooking') || t.includes('essential')) return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/groceries_200x200_crop_center.jpg?v=1746965740';
            if (t.includes('flour') || t.includes('rava')) return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-29_at_6.10.09_PM.jpg?v=1757333959';
            if (t.includes('beverage') || t.includes('tea') || t.includes('coffee')) return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.42.12_AM_f7566d9e-a9e4-4ac2-b2ae-a3a41b1033db.jpg?v=1757333974';
            if (t.includes('papad') || t.includes('snack')) return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.47.09_AM_55bb1b27-9dda-427f-90cc-db75f714c870.jpg?v=1757333973';
            if (t.includes('powder') || t.includes('podi') || t.includes('masala')) return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-31_at_7.42.30_PM_1_92dd0928-e3ea-4b36-84ec-ea82c7efd33f.jpg?v=1758619712';
            if (t.includes('spice')) return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/spice_200x200_crop_center.png?v=1746963495';
            return 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/groceries_200x200_crop_center.jpg?v=1746965740';
        }

        try {
            const apiHost = typeof getApiHost === 'function' ? getApiHost() : (window.location.origin.startsWith('http') ? window.location.origin : 'http://localhost:5000');
            const res = await fetch(`${apiHost}/api/collections`);
            if (!res.ok) return;
            const collections = await res.json();
            if (!collections || collections.length === 0) return;

            collections.sort((a, b) => {
                const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : (String(a.title || '').toLowerCase().includes('household') ? 99 : 50);
                const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : (String(b.title || '').toLowerCase().includes('household') ? 99 : 50);
                return orderA - orderB;
            });

            const pathname = window.location.pathname.toLowerCase();
            const inCategoriesDir = pathname.includes('/pages/categories/');
            const inPagesDir = pathname.includes('/pages/');

            let pagePrefix = 'pages/';
            if (inCategoriesDir) pagePrefix = '../';
            else if (inPagesDir) pagePrefix = '';

            slider.innerHTML = collections.map(col => {
                const title = col.title || "Category";
                const img = getCanonicalColImage(col);
                const slug = col.slug || title.toLowerCase().replace(/\s+/g, '-');
                
                let link = `${pagePrefix}collections.html?category=${encodeURIComponent(slug)}`;
                if (slug === 'pickles') link = `${pagePrefix}categories/pickles.html`;
                else if (slug === 'oils-natural-extracts' || slug === 'oils') link = `${pagePrefix}categories/oils-natural-extracts.html`;
                else if (slug === 'dry-fruits-nuts' || slug === 'dry-fruits') link = `${pagePrefix}categories/dry-fruits-nuts.html`;
                else if (slug === 'seeds' || slug === 'dry-seeds') link = `${pagePrefix}categories/dry-seeds.html`;
                else if (slug === 'ghee-honey' || slug === 'ghee-and-honey') link = `${pagePrefix}categories/ghee-and-honey.html`;
                else if (slug === 'cooking-essentials') link = `${pagePrefix}categories/cooking-essentials.html`;
                else if (slug === 'spices') link = `${pagePrefix}categories/spices.html`;
                else if (slug === 'powders-masalas' || slug === 'spice-powders-podulu') link = `${pagePrefix}categories/spice-powders-podulu.html`;

                return `
                    <a href="${link}" class="category-card">
                        <div class="category-img-container">
                            <img src="${img}" alt="${title}" class="category-img" onerror="this.src='https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/groceries_200x200_crop_center.jpg?v=1746965740';">
                        </div>
                        <h3 class="category-name">${title}</h3>
                    </a>
                `;
            }).join('');
        } catch (e) {
            console.error('Failed to sync storefront collections slider:', e);
        }
    }

    // 4. Sync Single Product Detail View (if on product view page or ?id= is present)
    async function syncSingleProductView(overrideId = null) {
        const viewContainer = document.getElementById("productDetailView") || document.getElementById("singleProductContainer");
        if (!viewContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = overrideId || urlParams.get("id") || urlParams.get("handle") || urlParams.get("slug") || urlParams.get("product") || urlParams.get("productId");
        const apiHost = typeof getApiHost === 'function' ? getApiHost() : (window.location.origin.startsWith('http') ? window.location.origin : 'http://localhost:5000');

        // Reset current detail product state to avoid stale navigation state
        window.CURRENT_DETAIL_PRODUCT = null;

        function findInList(list, idOrSlug) {
            if (!Array.isArray(list) || list.length === 0 || !idOrSlug) return null;
            const target = String(idOrSlug).trim().toLowerCase();
            const targetKey = target.replace(/[^a-z0-9]/g, '');

            function getPId(p) {
                if (!p) return '';
                if (typeof p._id === 'string') return p._id.toLowerCase();
                if (p._id && p._id.$oid) return String(p._id.$oid).toLowerCase();
                if (p._id && typeof p._id.toString === 'function') return p._id.toString().toLowerCase();
                return String(p.id || p.handle || p.slug || '').toLowerCase();
            }

            // 1. Exact ID, _id, handle, slug, or alias match
            let found = list.find(p => {
                if (!p) return false;
                const pId = getPId(p);
                const pHandle = String(p.handle || '').toLowerCase();
                const pSlug = String(p.slug || '').toLowerCase();
                const pCustomId = String(p.id || '').toLowerCase();
                const aliases = Array.isArray(p.aliases) ? p.aliases.map(a => String(a).toLowerCase()) : [];
                return pId === target || pHandle === target || pSlug === target || pCustomId === target || aliases.includes(target);
            });
            if (found) return found;

            // 2. Exact normalized alphanumeric key match
            found = list.find(p => {
                if (!p) return false;
                const pId = getPId(p);
                const nameKey = String(p.name || p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                const handleKey = String(p.handle || p.slug || p.id || pId).toLowerCase().replace(/[^a-z0-9]/g, '');
                const aliasesKeys = (Array.isArray(p.aliases) ? p.aliases : []).map(a => String(a).toLowerCase().replace(/[^a-z0-9]/g, ''));
                return (nameKey && nameKey === targetKey) || 
                       (handleKey && handleKey === targetKey) || 
                       aliasesKeys.includes(targetKey);
            });
            if (found) return found;

            // 3. Flexible substring match (handles handles/slugs with/without -premium suffix)
            if (targetKey && targetKey.length >= 3) {
                found = list.find(p => {
                    if (!p) return false;
                    const pId = getPId(p);
                    const nameKey = String(p.name || p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                    const handleKey = String(p.handle || p.slug || p.id || pId).toLowerCase().replace(/[^a-z0-9]/g, '');
                    return (handleKey && (handleKey.includes(targetKey) || targetKey.includes(handleKey))) ||
                           (nameKey && (nameKey.includes(targetKey) || targetKey.includes(nameKey)));
                });
                if (found) return found;
            }

            return null;
        }

        if (productId) {
            // STEP 1: Fetch single product from API endpoint /api/products/:id
            try {
                const res = await fetch(`${apiHost}/api/products/${encodeURIComponent(productId)}`);
                if (res && res.ok) {
                    const p = await res.json();
                    if (p && (p._id || p.id || p.name)) {
                        renderSingleProductDetail(p, viewContainer);
                        return;
                    }
                }
            } catch (e) {}

            // STEP 2: Fetch all products from API and match strictly
            try {
                const allRes = await fetch(`${apiHost}/api/products`);
                if (allRes && allRes.ok) {
                    const list = await allRes.json();
                    if (Array.isArray(list) && list.length > 0) {
                        const apiMatch = findInList(list, productId);
                        if (apiMatch) {
                            renderSingleProductDetail(apiMatch, viewContainer);
                            return;
                        }
                    }
                }
            } catch (e) {}

            // STEP 3: Fallback match from FALLBACK_STOREFRONT_PRODUCTS pool
            let pool = Array.isArray(FALLBACK_STOREFRONT_PRODUCTS) ? [...FALLBACK_STOREFRONT_PRODUCTS] : [];
            try {
                const stored = localStorage.getItem('arshith_cached_products');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        parsed.forEach(item => {
                            if (item && !pool.some(p => (p._id && p._id === item._id) || (p.handle && p.handle === item.handle))) {
                                pool.push(item);
                            }
                        });
                    }
                }
            } catch(e) {}

            const matchedProduct = findInList(pool, productId);
            if (matchedProduct) {
                renderSingleProductDetail(matchedProduct, viewContainer);
                return;
            }
        }

        // Default fallback ONLY when no ?id= param is present in URL: default to Groundnut Oil
        if (!productId) {
            let pool = Array.isArray(FALLBACK_STOREFRONT_PRODUCTS) ? [...FALLBACK_STOREFRONT_PRODUCTS] : [];
            const defaultProd = pool.find(p => String(p.name || p.title || '').toLowerCase().includes('groundnut')) || pool[0];
            if (defaultProd) {
                renderSingleProductDetail(defaultProd, viewContainer);
                return;
            }
        }

        viewContainer.innerHTML = `<div style="text-align: center; padding: 60px 20px;"><h2>Product Not Found</h2><p style="color:#64748b; margin-top:8px;">The product you requested could not be found.</p><a href="../index.html" class="continue-shopping-btn" style="display:inline-block; margin-top:16px;">Back to Home</a></div>`;
    }

    function renderSingleProductDetail(p, viewContainer) {
        const name = p.name || p.title || "Arshith Fresh Product";
        const price = Number(p.price || 0);
        const originalPrice = Number(p.originalPrice || Math.round(price * 1.25));

        const path = window.location.pathname.toLowerCase();
        let depth = 0;
        if (path.includes("/pages/categories/") || path.includes("/pages/auth/") || path.includes("/pages/policies/")) {
            depth = 2;
        } else if (path.includes("/pages/")) {
            depth = 1;
        }

        const neutralPlaceholder = getNeutralPlaceholder(depth);
        const imgData = extractProductImageData(p, depth);
        const allImgs = imgData.all;
        const mainImage = imgData.primary;

        const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
        const discountAmount = (originalPrice - price).toFixed(2);
        const isInstock = (p.countInStock ?? 10) > 0;
        const category = p.category || 'Natural Food';
        const subcategory = p.subcategory || '';
        const unit = p.unit || '1 unit';
        const brand = p.brand || 'Arshith Fresh';
        const description = p.description || '100% pure, natural, and preservative-free authentic grocery freshly packed and delivered from Arshith Fresh.';
        const id = p._id || p.id || '';

        window.CURRENT_DETAIL_PRODUCT = p;
        const prodImage = mainImage;

        // Update page title
        document.title = `${name} | Arshith Fresh`;

        viewContainer.innerHTML = `
            <!-- Breadcrumbs -->
            <nav style="margin-bottom: 24px; font-size: 13.5px; color: #64748b; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <a href="../index.html" style="color: #0f7139; text-decoration: none;">Home</a>
                <span>/</span>
                <a href="collections.html?category=all" style="color: #0f7139; text-decoration: none;">Collections</a>
                <span>/</span>
                <span style="color: #0f7139; font-weight: 500;">${category}</span>
                <span>/</span>
                <span style="color: #1e293b; font-weight: 600;">${name}</span>
            </nav>

            <div class="product-detail-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; background: #ffffff; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0;">
                
                <!-- LEFT GALLERY -->
                <div class="product-gallery-side">
                    <div style="position: relative; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background: #fafbfc; text-align: center; padding: 24px;">
                        ${discount > 0 ? `<span class="card-discount-tag" style="position: absolute; top: 14px; left: 14px; background: #005d4a; color: #ffffff; padding: 5px 11px; border-radius: 6px; font-weight: 800; font-size: 12px; letter-spacing: 0.3px; z-index: 5; box-shadow: 0 2px 8px rgba(0,93,74,0.25);">${discount}% OFF</span>` : ''}
                        <img src="${mainImage}" alt="${name}" id="mainDetailProductImg" style="width: 100%; max-height: 440px; object-fit: contain; transition: transform 0.3s ease;" onerror="this.onerror=null; this.src='${neutralPlaceholder}';">
                    </div>

                    ${allImgs.length > 1 ? `
                    <div class="product-thumbnails-carousel" style="display: flex; gap: 10px; margin-top: 14px; overflow-x: auto; padding-bottom: 4px;">
                        ${allImgs.map((imgUrl, i) => `
                            <div class="detail-thumb-item ${i === 0 ? 'active' : ''}" onclick="switchDetailImage('${imgUrl.replace(/'/g, "\\'")}', this)" style="width: 72px; height: 72px; border-radius: 8px; border: 2px solid ${i === 0 ? '#0f7139' : '#e2e8f0'}; background: #fafbfc; padding: 4px; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
                                <img src="${imgUrl}" alt="${name} thumbnail ${i + 1}" style="max-height: 100%; max-width: 100%; object-fit: contain;" onerror="this.onerror=null; this.src='${neutralPlaceholder}';">
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>

                <!-- RIGHT PRODUCT DETAILS -->
                <div class="product-info-side">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <span style="background: #e8f5e9; color: #0f7139; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">${category}</span>
                        ${subcategory ? `<span style="background: #f1f5f9; color: #475569; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px;">${subcategory}</span>` : ''}
                    </div>

                    <h1 class="product-detail-heading">${name}</h1>

                    <!-- 5-Star Rating Beside Photo (Synced with Amazon Reviews Section) -->
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;">
                        <a href="#amazonReviewsSection" id="topRatingScoreLink" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none; cursor: pointer;" title="Jump to Customer Reviews">
                            <div id="topRatingStarsVisual" style="color: #f59e0b; font-size: 15px; letter-spacing: 1px;">★★★★★</div>
                            <strong id="topRatingScoreNum" style="font-size: 14px; color: #1e293b;">${(p.rating || 5.0).toFixed(1)}</strong>
                            <span id="topRatingCountText" style="font-size: 12.5px; color: #0284c7; text-decoration: underline;">(${p.numReviews || 0} customer ratings)</span>
                        </a>
                        <span style="color: #cbd5e1;">•</span>
                        <span style="color: #16a34a; font-size: 12px; font-weight: 600; background: #ecfdf5; padding: 2px 8px; border-radius: 12px;">✓ Verified Product</span>
                    </div>

                    <!-- Price Box -->
                    <div class="product-detail-price-box" style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 18px; flex-wrap: wrap;">
                        <span class="product-detail-sale-price" style="font-size: 24px; font-weight: 800; color: #1e293b; line-height: 1;">₹${price.toFixed(2)}</span>
                        ${(originalPrice > price) ? `<span class="product-detail-regular-price" style="font-size: 15px; color: #64748b; text-decoration: line-through; -webkit-text-decoration-line: line-through; font-weight: 500; line-height: 1;">₹${originalPrice.toFixed(2)}</span>` : ''}
                        ${(originalPrice > price) ? `<span class="product-detail-save-badge" style="font-size: 14px; font-weight: 700; color: #16a34a; line-height: 1;">Save ₹${(originalPrice - price).toFixed(2)}</span>` : ''}
                    </div>

                    <!-- Specs List -->
                    <div style="margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13.5px; align-items: stretch;">
                        <div style="background: #fff; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center; min-height: 54px; box-sizing: border-box;">
                            <strong style="color:#64748b; font-size:11.5px; display:block; text-transform:uppercase; margin-bottom: 2px;">UNIT / NET WEIGHT</strong>
                            <span style="font-weight:700; color:#1e293b; line-height: 1.2;">${unit}</span>
                        </div>
                        <div style="background: #fff; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center; min-height: 54px; box-sizing: border-box;">
                            <strong style="color:#64748b; font-size:11.5px; display:block; text-transform:uppercase; margin-bottom: 2px;">AVAILABILITY</strong>
                            <span style="font-weight:700; color:${isInstock ? '#16a34a' : '#dc2626'}; line-height: 1.2;">${isInstock ? `In Stock (${p.countInStock || 15} left)` : 'Out of Stock'}</span>
                        </div>
                    </div>

                    <!-- Quantity + Action Buttons (Visible ONLY if In Stock) -->
                    ${isInstock ? `
                    <div style="display: flex; gap: 14px; margin-bottom: 24px; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; border: 1.5px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #fff; height: 50px;">
                            <button type="button" class="detail-qty-btn" onclick="event.preventDefault(); event.stopPropagation(); changeDetailQty(-1, event);" aria-label="Decrease quantity" style="width: 40px; height: 100%; border: none; background: transparent; font-size: 20px; font-weight: 700; cursor: pointer; color: #475569; display: flex; align-items: center; justify-content: center; user-select: none; -webkit-tap-highlight-color: transparent;">−</button>
                            <input type="number" id="detailQtyInput" value="1" min="1" readonly style="width: 44px; text-align: center; border: none; font-size: 16px; font-weight: 700; color: #1e293b; outline: none; background: transparent; pointer-events: none;">
                            <button type="button" class="detail-qty-btn" onclick="event.preventDefault(); event.stopPropagation(); changeDetailQty(1, event);" aria-label="Increase quantity" style="width: 40px; height: 100%; border: none; background: transparent; font-size: 20px; font-weight: 700; cursor: pointer; color: #475569; display: flex; align-items: center; justify-content: center; user-select: none; -webkit-tap-highlight-color: transparent;">+</button>
                        </div>

                        <button type="button" onclick="handleDetailAddToCart(false)" style="flex: 1; min-width: 160px; height: 50px; background: #0f7139; color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s;">
                            🛒 ADD TO CART
                        </button>

                        <button type="button" onclick="handleDetailAddToCart(true)" style="flex: 1; min-width: 140px; height: 50px; background: #1e293b; color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; transition: background 0.2s;">
                            ⚡ BUY NOW
                        </button>
                    </div>
                    ` : `
                    <!-- Out of Stock Message (No Buy Options) -->
                    <div style="background: #fef2f2; border: 1.5px solid #fca5a5; border-radius: 12px; padding: 18px 22px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 26px; line-height: 1;">🚫</span>
                            <div>
                                <div style="color: #991b1b; font-weight: 800; font-size: 16px;">Currently Out of Stock</div>
                                <div style="font-size: 13px; color: #b91c1c; margin-top: 2px;">This product is temporarily sold out and not available for purchase.</div>
                            </div>
                        </div>
                        <a href="collections.html?category=all" style="background: #ffffff; color: #991b1b; border: 1.5px solid #f87171; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; display: inline-block; transition: all 0.2s;">
                            Browse Other Products →
                        </a>
                    </div>
                    `}

                    <!-- Description Card -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                        <h3 style="font-size: 15px; font-weight: 700; color: #0f7139; margin: 0 0 10px 0;">Product Description & Highlights</h3>
                        <div style="font-size: 14px; line-height: 1.7; color: #475569;">${description}</div>
                    </div>

                    <!-- Trust Icons -->
                    <div style="display: flex; gap: 20px; font-size: 12.5px; color: #64748b; flex-wrap: wrap;">
                        <span>🌿 <strong>100% Pure & Fresh</strong></span>
                        <span>🚚 <strong>Free Delivery Above ₹1000</strong></span>
                        <span>🔒 <strong>Secure Checkout</strong></span>
                    </div>
                </div>

            </div>
        `;

        // Initialize Amazon-Style Customer Reviews Section
        initAmazonProductReviews(p);

        // Load Related Products
        loadRelatedProducts(p);
    }

    window.changeDetailQty = function(delta, ev) {
        if (ev) {
            if (ev.preventDefault) ev.preventDefault();
            if (ev.stopPropagation) ev.stopPropagation();
        }
        const qInput = document.getElementById('detailQtyInput');
        if (!qInput) return;
        let current = parseInt(qInput.value, 10);
        if (isNaN(current) || current < 1) current = 1;
        current += Number(delta);
        if (current < 1) current = 1;
        qInput.value = current;
    };

    window.handleDetailAddToCart = function(isBuyNow = false) {
        if (!window.CURRENT_DETAIL_PRODUCT) return;
        const prod = window.CURRENT_DETAIL_PRODUCT;

        const isStockAvailable = (prod.countInStock === undefined || prod.countInStock === null) ? true : (Number(prod.countInStock) > 0);
        if (!isStockAvailable) {
            if (typeof showToast === 'function') {
                showToast('Sorry, this product is currently out of stock.');
            } else {
                alert('Sorry, this product is currently out of stock.');
            }
            return;
        }

        const qInput = document.getElementById('detailQtyInput');
        const qty = qInput ? (Number(qInput.value) || 1) : 1;
        const pImg = prod.image || (prod.images && prod.images[0] ? (prod.images[0].url || prod.images[0]) : '') || "https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/spice_200x200_crop_center.png?v=1746963495";
        addToStoreCart(
            prod._id || '',
            prod.name || prod.title || 'Arshith Fresh Product',
            Number(prod.price) || 0,
            pImg,
            qty
        );
        if (isBuyNow) {
            window.location.href = 'cart.html';
        }
    };

    async function loadRelatedProducts(currentProduct) {
        const relatedGrid = document.getElementById("relatedProductsGrid");
        if (!relatedGrid) return;

        let pool = Array.isArray(FALLBACK_STOREFRONT_PRODUCTS) ? [...FALLBACK_STOREFRONT_PRODUCTS] : [];

        try {
            const stored = localStorage.getItem('arshith_cached_products');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    parsed.forEach(item => {
                        if (item && !pool.some(p => (p._id && p._id === item._id) || (p.handle && p.handle === item.handle))) {
                            pool.push(item);
                        }
                    });
                }
            }
        } catch (e) {}

        try {
            const apiHost = typeof getApiHost === 'function' ? getApiHost() : (window.location.origin.startsWith('http') ? window.location.origin : 'http://localhost:5000');
            const res = await fetch(`${apiHost}/api/products`);
            if (res && res.ok) {
                const apiProds = await res.json();
                if (Array.isArray(apiProds) && apiProds.length > 0) {
                    apiProds.forEach(item => {
                        if (item && !pool.some(p => (p._id && p._id === item._id) || (p.handle && p.handle === item.handle))) {
                            pool.push(item);
                        }
                    });
                }
            }
        } catch (e) {}

        function isSameProduct(p1, p2) {
            if (!p1 || !p2) return false;
            const id1 = String(p1._id || p1.id || '').trim().toLowerCase();
            const id2 = String(p2._id || p2.id || '').trim().toLowerCase();
            if (id1 && id2 && id1 === id2) return true;

            const handle1 = String(p1.handle || p1.slug || '').trim().toLowerCase();
            const handle2 = String(p2.handle || p2.slug || '').trim().toLowerCase();
            if (handle1 && handle2 && handle1 === handle2) return true;

            const name1 = String(p1.name || p1.title || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            const name2 = String(p2.name || p2.title || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            if (name1 && name2 && name1 === name2) return true;

            return false;
        }

        const currCat = String(currentProduct ? (currentProduct.category || '') : '').toLowerCase();
        const currTitle = String(currentProduct ? (currentProduct.title || currentProduct.name || '') : '').toLowerCase();

        function isCategoryMatch(item) {
            if (!item) return false;
            const itemCat = String(item.category || '').toLowerCase();
            const itemTitle = String(item.title || item.name || '').toLowerCase();
            if (currCat && itemCat && (currCat === itemCat || itemCat.includes(currCat) || currCat.includes(itemCat))) return true;

            const catKeywords = ['pickle', 'oil', 'ghee', 'honey', 'seed', 'dry fruit', 'nut', 'kaju', 'badam', 'powder', 'masala', 'podi', 'flour', 'rava', 'spice'];
            for (const kw of catKeywords) {
                if ((currCat.includes(kw) || currTitle.includes(kw)) && (itemCat.includes(kw) || itemTitle.includes(kw))) {
                    return true;
                }
            }
            return false;
        }

        const otherProducts = pool.filter(item => !isSameProduct(item, currentProduct));

        const uniqueOthers = [];
        const seenKeys = new Set();
        otherProducts.forEach(item => {
            const key = String(item.handle || item.slug || item.name || item.title || item._id || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            if (key && !seenKeys.has(key)) {
                seenKeys.add(key);
                uniqueOthers.push(item);
            }
        });

        let related = uniqueOthers.filter(item => isCategoryMatch(item));

        if (related.length < 4) {
            const remainingNeeded = 4 - related.length;
            const extra = uniqueOthers.filter(item => !related.some(r => isSameProduct(r, item))).slice(0, remainingNeeded);
            related = related.concat(extra);
        }

        related = related.slice(0, 4);

        if (related.length > 0) {
            relatedGrid.innerHTML = related.map(item => createProductCardHTML(item)).join('');
            try {
                if (typeof syncProductCardSteppers === 'function') syncProductCardSteppers();
            } catch (e) {}
        }
    }

    function syncAuthHeader() {
        try {
            const user = JSON.parse(localStorage.getItem('arshith_user'));
            const loginBtn = document.querySelector('.action-btn.login-btn');
            if (!loginBtn) return;

            const path = window.location.pathname;
            const isSubpage = path.includes('/pages/');
            const isDeep = path.includes('/pages/auth/') || path.includes('/pages/categories/') || path.includes('/pages/policies/');

            if (user && user.name) {
                const profileUrl = isDeep ? '../profile.html' : (isSubpage ? 'profile.html' : 'pages/profile.html');
                loginBtn.href = profileUrl;
                loginBtn.title = `Account: ${user.name}`;
                loginBtn.style.color = '#0f7139';
                loginBtn.classList.add('user-logged-in');
            } else {
                const loginUrl = isDeep ? 'login.html' : (isSubpage ? 'auth/login.html' : 'pages/auth/login.html');
                loginBtn.href = loginUrl;
                loginBtn.title = 'Log In';
                loginBtn.style.color = '';
                loginBtn.classList.remove('user-logged-in');
            }
        } catch (e) {}
    }

    window.syncSingleProductView = syncSingleProductView;
    syncStorefrontCollections();
    syncStorefrontProducts();
    syncSingleProductView();
    syncAuthHeader();
    initLiveSearchAutocomplete();
});

window.addEventListener('popstate', () => {
    if (typeof window.syncSingleProductView === 'function') window.syncSingleProductView();
});
window.addEventListener('hashchange', () => {
    if (typeof window.syncSingleProductView === 'function') window.syncSingleProductView();
});
document.addEventListener('click', (e) => {
    if (e.target.closest('.product-card-wishlist-btn, .stepper-btn, .add-to-cart-btn, .product-qty-overlay, .stepper-qty, .detail-qty-btn')) {
        return;
    }

    const link = e.target.closest('a[href*="product.html"]');
    const card = e.target.closest('.product-card, .af-product-card, .collection-product-card, .collection-product-card-box, .product-item');

    let targetHref = '';
    if (link) {
        targetHref = link.getAttribute('href');
    } else if (card) {
        const cardLink = card.querySelector('a[href*="product.html"]');
        if (cardLink) {
            targetHref = cardLink.getAttribute('href');
        } else if (card.dataset && (card.dataset.productId || card.dataset.id)) {
            const pId = card.dataset.productId || card.dataset.id;
            const isSub = window.location.pathname.includes('/pages/');
            targetHref = `${isSub ? '' : 'pages/'}product.html?id=${encodeURIComponent(pId)}`;
        }
    }

    if (!targetHref || targetHref.startsWith('javascript:')) return;

    window.location.href = targetHref;
});

// Global Logout Function
window.handleLogout = function() {
    try {
        localStorage.removeItem('arshith_user');
        localStorage.removeItem('arshith_user_orders');
        sessionStorage.clear();
    } catch (e) {}

    if (typeof showToast === 'function') {
        showToast('Logged out successfully');
    }

    const path = window.location.pathname;
    const isSubpage = path.includes('/pages/');
    const isDeep = path.includes('/pages/auth/') || path.includes('/pages/categories/') || path.includes('/pages/policies/');
    const redirectUrl = isDeep ? '../../index.html' : (isSubpage ? '../index.html' : 'index.html');

    setTimeout(() => {
        try {
            localStorage.removeItem('arshith_user');
            sessionStorage.clear();
        } catch (e) {}
        window.location.href = redirectUrl;
    }, 150);
};

// Global Image Thumbnail Switcher for Product Detail
window.switchDetailImage = function(url, thumbElem) {
    const mainImg = document.getElementById('mainDetailProductImg');
    if (mainImg) {
        mainImg.style.opacity = '0.6';
        mainImg.src = url;
        setTimeout(() => { mainImg.style.opacity = '1'; }, 150);
    }
    document.querySelectorAll('.detail-thumb-item').forEach(el => {
        el.style.borderColor = '#e2e8f0';
        el.classList.remove('active');
    });
    if (thumbElem) {
        thumbElem.style.borderColor = '#0f7139';
        thumbElem.classList.add('active');
    }
};

// Auto Signup Lead Capture Popup Modal for Unauthenticated Visitors
function initAutoSignupPopup() {
    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('arshith_user'));
    } catch (e) {}

    if (currentUser && (currentUser._id || currentUser.email)) return;
    try {
        if (sessionStorage.getItem('arshith_signup_popup_dismissed') === 'true') return;
    } catch (e) {}

    const path = window.location.pathname.toLowerCase();
    if (path.includes('/auth/') || path.includes('login.html') || path.includes('register.html') || path.includes('checkout.html') || path.includes('/admin/') || path.includes('profile.html') || path.includes('/profile') || path.includes('/account')) {
        return;
    }

    const isSubpage = path.includes('/pages/');
    const isDeep = path.includes('/categories/') || path.includes('/policies/') || path.includes('/auth/');
    const logoUrl = isDeep ? '../../assets/images/Arshithlogo111.jpg' : (isSubpage ? '../assets/images/Arshithlogo111.jpg' : 'assets/images/Arshithlogo111.jpg');
    const loginUrl = isDeep ? '../auth/login.html' : (isSubpage ? 'auth/login.html' : 'pages/auth/login.html');

    setTimeout(() => {
        if (document.getElementById('arshithSignupModalOverlay')) return;

        const modalHTML = `
            <div id="arshithSignupModalOverlay" class="signup-modal-overlay">
                <div class="signup-modal-container">
                    <button type="button" class="signup-modal-close" onclick="closeSignupModal()">&times;</button>
                    
                    <div class="signup-modal-header">
                        <img src="${logoUrl}" alt="Arshith Fresh Logo" class="signup-modal-logo" onerror="this.onerror=null; this.src='assets/images/Arshithlogo111.jpg';">
                        <br>
                        <span class="signup-offer-badge">🎁 SPECIAL WELCOME OFFER</span>
                        <h2 class="signup-modal-title">Get 10% OFF Your First Order!</h2>
                        <p class="signup-modal-sub">Create your account today to unlock instant discount code <strong>ARSHITH10</strong>, track live orders, and enjoy faster checkout.</p>
                    </div>

                    <div id="modalSignupError" class="signup-modal-error" style="display:none;">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <div id="modalSignupErrorText"></div>
                    </div>

                    <form id="autoSignupModalForm" onsubmit="handleModalSignup(event)">
                        <div class="signup-form-group">
                            <input type="text" id="modalSignupName" placeholder="Full Name" required class="signup-modal-input">
                        </div>
                        <div class="signup-form-group">
                            <input type="email" id="modalSignupEmail" placeholder="Email Address" required class="signup-modal-input" oninput="clearSignupModalError()">
                        </div>
                        <div class="signup-form-group">
                            <input type="password" id="modalSignupPassword" placeholder="Create Password (min 6 characters)" minlength="6" required class="signup-modal-input">
                        </div>

                        <button type="submit" id="modalSignupBtn" class="signup-modal-submit-btn">
                            Claim 10% OFF & Create Account
                        </button>
                    </form>

                    <div class="signup-modal-footer">
                        <p>Already have an account? <a href="${loginUrl}" class="signup-login-link">Log In</a></p>
                        <button type="button" class="signup-skip-link" onclick="closeSignupModal()">No thanks, continue browsing</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        setTimeout(() => {
            const overlay = document.getElementById('arshithSignupModalOverlay');
            if (overlay) overlay.classList.add('show');
        }, 50);
    }, 150);
}

function clearSignupModalError() {
    const errBox = document.getElementById('modalSignupError');
    const emailInput = document.getElementById('modalSignupEmail');
    if (errBox) errBox.style.display = 'none';
    if (emailInput) {
        emailInput.style.borderColor = '';
        emailInput.style.boxShadow = '';
    }
}

function closeSignupModal() {
    const overlay = document.getElementById('arshithSignupModalOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 350);
    }
    try {
        sessionStorage.setItem('arshith_signup_popup_dismissed', 'true');
    } catch (e) {}
    
    // Smoothly reveal the Festive Offers popup modal dialog IMMEDIATELY after welcome popup closes
    setTimeout(() => {
        showFestiveOfferModal();
    }, 50);
}

let currentActiveBannerConfig = {
    title: 'Festive Offers Are Here!',
    subtitle: 'Celebrate More. Save More. Shop Your Favorites.',
    badgeText: 'Grand Festive Celebration',
    discountText: 'UP TO 40% OFF',
    couponCode: 'FESTIVE40',
    buttonText: 'SHOP NOW',
    buttonLink: 'pages/collections.html?category=all',
    image: 'assets/images/festive-dussehra-banner.jpg',
    isActive: true,
    showPopupModal: true,
    deal1Title: '20% OFF on Fresh Fruits',
    deal1Sub: 'Almonds, Cashews & Native Organic Fruits',
    deal1Badge: '20% OFF',
    deal1Link: 'pages/categories/dry-fruits-nuts.html',
    deal1Image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/seeds_dry_fruits_nuts_webp_200x200_crop_center.jpg?v=1746963459',
    deal2Title: '30% OFF on Vegetables',
    deal2Sub: 'Farm Vegetables & Pure Cooking Essentials',
    deal2Badge: '30% OFF',
    deal2Link: 'pages/categories/cooking-essentials.html',
    deal2Image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/groceries_200x200_crop_center.jpg?v=1746965740',
    deal3Title: '40% OFF on Combo Offers',
    deal3Sub: 'A2 Bilona Ghee + Wood-Pressed Oils Hamper',
    deal3Badge: '40% OFF',
    deal3Link: 'pages/collections.html?category=all',
    deal3Image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/ghee_1_200x200_crop_center.jpg?v=1746964905'
};

function getActiveBannerConfigSync() {
    return currentActiveBannerConfig;
}

async function fetchActiveBannerConfigAsync() {
    try {
        const res = await fetch('/api/banners/active');
        if (res.ok) {
            const data = await res.json();
            if (data && data.banner) {
                currentActiveBannerConfig = data.banner;
            }
        }
    } catch (e) {}
    return currentActiveBannerConfig;
}

function showFestiveOfferModal(force = false) {
    const path = window.location.pathname.toLowerCase();
    // CRITICAL: NEVER display festive popup on user profile, account, or admin pages
    if (path.includes('profile.html') || path.includes('/profile') || path.includes('/account') || path.includes('/admin/')) {
        return;
    }

    if (!force) {
        try {
            if (sessionStorage.getItem('arshith_festive_popup_dismissed') === 'true') return;
        } catch (e) {}
    }

    if (document.getElementById('arshithFestiveModalOverlay')) return;

    const banner = getActiveBannerConfigSync();
    if (!banner || banner.isActive === false || banner.showPopupModal === false) {
        return;
    }

    // Detect path depth for assets & links
    const isSubpage = path.includes('/pages/');
    const isDeep = path.includes('/categories/') || path.includes('/policies/') || path.includes('/auth/');
    const rootPath = isDeep ? '../../' : (isSubpage ? '../' : '');

    const resolveImg = (img, fallback) => {
        if (!img) return fallback || rootPath + 'assets/images/festive-dussehra-banner.jpg';
        let clean = img.replace('https://arshithfresh.com/cdn/shop/', 'https://cdn.shopify.com/s/files/1/0858/0772/6869/');
        if (clean.startsWith('http') || clean.startsWith('data:')) return clean;
        return rootPath + clean.replace(/^\/+/, '');
    };

    const resolveLink = (link) => {
        if (!link) return rootPath + 'pages/collections.html?category=all';
        if (link.startsWith('http')) return link;
        return rootPath + link.replace(/^\/+/, '');
    };

    const deal1Default = 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/seeds_dry_fruits_nuts_webp_200x200_crop_center.jpg?v=1746963459';
    const deal2Default = 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/groceries_200x200_crop_center.jpg?v=1746965740';
    const deal3Default = 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/ghee_1_200x200_crop_center.jpg?v=1746964905';

    const imgHamper = resolveImg(banner.image);
    const deal1ImgUrl = resolveImg(banner.deal1Image, deal1Default);
    const deal2ImgUrl = resolveImg(banner.deal2Image, deal2Default);
    const deal3ImgUrl = resolveImg(banner.deal3Image, deal3Default);

    const collectionsUrl = resolveLink(banner.buttonLink);
    const fruitsUrl = resolveLink(banner.deal1Link);
    const veggiesUrl = resolveLink(banner.deal2Link);
    const comboUrl = resolveLink(banner.deal3Link);
    const couponCode = (banner.couponCode || 'FESTIVE40').toUpperCase();

    const modalHTML = `
        <div id="arshithFestiveModalOverlay" class="festive-modal-overlay">
            <div class="festive-modal-container">
                <button type="button" class="festive-modal-close" onclick="closeFestiveOfferModal()" title="Close Festive Offer">&times;</button>
                
                <div class="festive-promo-card festive-modal-card">
                    <!-- Subtle Festive Mandala & Sparkle Backgrounds -->
                    <div class="festive-mandala-watermark"></div>
                    <div class="festive-sparkle sparkle-1">✦</div>
                    <div class="festive-sparkle sparkle-2">✨</div>
                    <div class="festive-sparkle sparkle-3">✦</div>
                    <div class="festive-sparkle sparkle-4">✨</div>
                    <div class="festive-sparkle sparkle-5">✦</div>

                    <!-- Hanging Traditional Festive Lanterns with Animated Flames -->
                    <div class="festive-lanterns-wrapper">
                        <div class="festive-lantern lantern-1">
                            <div class="lantern-rope"></div>
                            <div class="lantern-body"><div class="lantern-flame"></div></div>
                        </div>
                        <div class="festive-lantern lantern-2">
                            <div class="lantern-rope"></div>
                            <div class="lantern-body"><div class="lantern-flame"></div></div>
                        </div>
                        <div class="festive-lantern lantern-3">
                            <div class="lantern-rope"></div>
                            <div class="lantern-body"><div class="lantern-flame"></div></div>
                        </div>
                    </div>

                    <!-- Left Main Content Column -->
                    <div class="festive-main-content">
                        <div class="festive-header-block">
                            <div class="festive-pill-tag">
                                <span class="tag-icon">✨</span>
                                <span>${banner.badgeText || 'Grand Festive Celebration'}</span>
                            </div>

                            <h2 class="festive-headline">${banner.title || 'Festive Offers Are Here!'}</h2>
                            <p class="festive-subtitle">${banner.subtitle || 'Celebrate More. Save More. Shop Your Favorites.'}</p>

                            <div class="festive-hero-offer-row">
                                <div class="festive-discount-pill">
                                    <span>${banner.discountText || 'UP TO 40% OFF'}</span>
                                </div>
                                <div class="festive-code-box" id="festiveCodeBoxModal" onclick="copyFestiveCode('${couponCode}')" title="Click to copy coupon code" style="cursor:pointer;">
                                    <span>Use Code:</span>
                                    <strong id="festiveCodeText">${couponCode}</strong>
                                    <span id="festiveCopyBadge" class="festive-copy-hint"><i class="fa-regular fa-copy"></i> Copy</span>
                                </div>
                                <a href="${collectionsUrl}" class="festive-shop-btn" onclick="closeFestiveOfferModal()">
                                    <span>${banner.buttonText || 'SHOP NOW'}</span>
                                    <svg viewBox="0 0 24 24">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <!-- 3 Specific Festive Category Discount Cards -->
                        <div class="festive-deals-grid">
                            <!-- Card 1 -->
                            <a href="${fruitsUrl}" class="festive-deal-card" onclick="closeFestiveOfferModal()">
                                <span class="deal-card-badge">${banner.deal1Badge || '20% OFF'}</span>
                                <div class="deal-card-icon-wrap">
                                    <img src="${deal1ImgUrl}" alt="${banner.deal1Title || 'Fresh Fruits'}" class="deal-card-img" onerror="this.onerror=null; this.src='${deal1Default}';">
                                </div>
                                <div class="deal-card-info">
                                    <h4 class="deal-title">${banner.deal1Title || '20% OFF on Fresh Fruits'}</h4>
                                    <p class="deal-sub">${banner.deal1Sub || 'Almonds, Cashews & Native Organic Fruits'}</p>
                                    <span class="deal-link-text">Shop Deal ➔</span>
                                </div>
                            </a>

                            <!-- Card 2 -->
                            <a href="${veggiesUrl}" class="festive-deal-card" onclick="closeFestiveOfferModal()">
                                <span class="deal-card-badge badge-green">${banner.deal2Badge || '30% OFF'}</span>
                                <div class="deal-card-icon-wrap">
                                    <img src="${deal2ImgUrl}" alt="${banner.deal2Title || 'Vegetables'}" class="deal-card-img" onerror="this.onerror=null; this.src='${deal2Default}';">
                                </div>
                                <div class="deal-card-info">
                                    <h4 class="deal-title">${banner.deal2Title || '30% OFF on Vegetables'}</h4>
                                    <p class="deal-sub">${banner.deal2Sub || 'Farm Vegetables & Pure Cooking Essentials'}</p>
                                    <span class="deal-link-text">Shop Deal ➔</span>
                                </div>
                            </a>

                            <!-- Card 3 -->
                            <a href="${comboUrl}" class="festive-deal-card" onclick="closeFestiveOfferModal()">
                                <span class="deal-card-badge badge-gold">${banner.deal3Badge || '40% OFF'}</span>
                                <div class="deal-card-icon-wrap">
                                    <img src="${deal3ImgUrl}" alt="${banner.deal3Title || 'Combo Offers'}" class="deal-card-img" onerror="this.onerror=null; this.src='${deal3Default}';">
                                </div>
                                <div class="deal-card-info">
                                    <h4 class="deal-title">${banner.deal3Title || '40% OFF on Combo Offers'}</h4>
                                    <p class="deal-sub">${banner.deal3Sub || 'A2 Bilona Ghee + Wood-Pressed Oils Hamper'}</p>
                                    <span class="deal-link-text">Shop Deal ➔</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    <!-- Right Festive Hamper Visual Showcase -->
                    <div class="festive-visual-showcase">
                        <div class="festive-card-frame">
                            <div class="festive-img-wrap">
                                <img src="${imgHamper}" alt="${banner.title || 'Royal Festive Organic Hamper'}" class="festive-hamper-img" onerror="this.onerror=null;this.src='${rootPath}assets/images/Arshithlogo111.jpg';">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="festive-modal-footer">
                    <button type="button" class="festive-skip-link" onclick="closeFestiveOfferModal()">No thanks, continue browsing</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setTimeout(() => {
        const overlay = document.getElementById('arshithFestiveModalOverlay');
        if (overlay) overlay.classList.add('show');
    }, 50);
}

function closeFestiveOfferModal() {
    const overlay = document.getElementById('arshithFestiveModalOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 380);
    }
    try {
        sessionStorage.setItem('arshith_festive_popup_dismissed', 'true');
    } catch (e) {}
    setTimeout(() => {
        if (typeof updateCartCountBadge === 'function') updateCartCountBadge();
    }, 400);
}

function copyFestiveCode(customCode = null) {
    const code = customCode || (currentActiveBannerConfig && currentActiveBannerConfig.couponCode) || 'FESTIVE40';
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).catch(() => {});
    }
    const badge = document.getElementById('festiveCopyBadge');
    if (badge) {
        badge.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        badge.style.background = '#10b981';
        badge.style.color = '#ffffff';
        setTimeout(() => {
            if (badge) {
                badge.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
                badge.style.background = '';
                badge.style.color = '';
            }
        }, 2200);
    }
    if (typeof showToast === 'function') {
        showToast(`Coupon code ${code} copied to clipboard!`, 'success');
    }
}

async function initFestiveBannerDisplay() {
    const path = window.location.pathname.toLowerCase();
    // STRICT CHECK: User profile, account, or admin pages must NEVER display the festive popup
    if (path.includes('profile.html') || path.includes('/profile') || path.includes('/account') || path.includes('/admin/')) {
        return;
    }

    let banner = null;
    try {
        if (typeof fetchActiveBannerConfigAsync === 'function') {
            banner = await fetchActiveBannerConfigAsync();
        }
    } catch (e) {}

    // Dynamically update static festive section if on index.html
    const festiveSection = document.getElementById('festiveOffers');
    if (festiveSection) {
        if (!banner || banner.isActive === false) {
            festiveSection.style.display = 'none';
        } else {
            festiveSection.style.display = 'block';
            festiveSection.classList.add('festive-visible');

            const headline = festiveSection.querySelector('.festive-headline');
            if (headline && banner.title) headline.textContent = banner.title;
            const subtitle = festiveSection.querySelector('.festive-subtitle');
            if (subtitle && banner.subtitle) subtitle.textContent = banner.subtitle;
            const pillTag = festiveSection.querySelector('.festive-pill-tag span:last-child');
            if (pillTag && banner.badgeText) pillTag.textContent = banner.badgeText;
            const discountPill = festiveSection.querySelector('.festive-discount-pill span');
            if (discountPill && banner.discountText) discountPill.textContent = banner.discountText;
            const codeBox = festiveSection.querySelector('.festive-code-box strong');
            if (codeBox && banner.couponCode) codeBox.textContent = banner.couponCode;
            const hamperImg = festiveSection.querySelector('.festive-hamper-img');
            if (hamperImg && banner.image) {
                hamperImg.src = banner.image.startsWith('http') || banner.image.startsWith('data:') ? banner.image : banner.image;
            }
        }
    }

    if (!banner || banner.isActive === false || banner.showPopupModal === false) return;

    let isSignupDismissed = false;
    try {
    isSignupDismissed = sessionStorage.getItem('arshith_signup_popup_dismissed') === 'true';
    } catch(e) {}

    let isFestiveDismissed = false;
    try {
        isFestiveDismissed = sessionStorage.getItem('arshith_festive_popup_dismissed') === 'true';
    } catch(e) {}

    if (isFestiveDismissed) return;

    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('arshith_user'));
    } catch(e) {}

    const isLoggedIn = !!(currentUser && (currentUser._id || currentUser.email));

    // If user is already logged in or previously dismissed signup, pop up festive offers immediately
    if (isLoggedIn || isSignupDismissed) {
        setTimeout(() => {
            showFestiveOfferModal();
        }, 100);
    }
}

window.showFestiveOfferModal = showFestiveOfferModal;
window.closeFestiveOfferModal = closeFestiveOfferModal;
window.copyFestiveCode = copyFestiveCode;

document.addEventListener('DOMContentLoaded', () => {
    initFestiveBannerDisplay();
});


async function handleModalSignup(e) {
    e.preventDefault();
    const btn = document.getElementById('modalSignupBtn');
    const name = document.getElementById('modalSignupName').value.trim();
    const email = document.getElementById('modalSignupEmail').value.trim();
    const password = document.getElementById('modalSignupPassword').value;
    const errorBox = document.getElementById('modalSignupError');
    const errorText = document.getElementById('modalSignupErrorText');
    const emailInput = document.getElementById('modalSignupEmail');

    if (errorBox) errorBox.style.display = 'none';
    if (emailInput) {
        emailInput.style.borderColor = '';
        emailInput.style.boxShadow = '';
    }

    if (!name || !email || !password) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';

    try {
        const res = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        localStorage.setItem('arshith_user', JSON.stringify(data));
        try {
            sessionStorage.setItem('arshith_signup_popup_dismissed', 'true');
        } catch (e) {}

        showToast('🎉 Account created! Discount code ARSHITH10 unlocked.', 'success');
        if (typeof syncAuthHeader === 'function') syncAuthHeader();
        closeSignupModal();

    } catch (err) {
        const rawMsg = err.message || 'Registration error';
        const isExisting = rawMsg.toLowerCase().includes('already exist');

        const path = window.location.pathname;
        const isSubpage = path.includes('/pages/');
        const isDeep = path.includes('/categories/') || path.includes('/policies/');
        const loginUrl = isDeep ? '../auth/login.html' : (isSubpage ? 'auth/login.html' : 'pages/auth/login.html');

        if (errorBox && errorText) {
            if (isExisting) {
                errorText.innerHTML = `An account with <strong>${escapeHtml(email)}</strong> already exists.<br><a href="${loginUrl}" style="display:inline-block;margin-top:4px;color:#0f7139;font-weight:700;text-decoration:underline;">Click here to Log In &rarr;</a>`;
            } else {
                errorText.innerHTML = escapeHtml(rawMsg);
            }
            errorBox.style.display = 'flex';
        }

        if (emailInput) {
            emailInput.style.borderColor = '#ef4444';
            emailInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
            emailInput.focus();
        }

        showToast(isExisting ? 'Account already exists! Please log in instead.' : rawMsg, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Claim 10% OFF & Create Account';
    }
}

window.clearSignupModalError = clearSignupModalError;
window.closeSignupModal = closeSignupModal;
window.handleModalSignup = handleModalSignup;
window.initAutoSignupPopup = initAutoSignupPopup;

document.addEventListener("DOMContentLoaded", () => {
    initAutoSignupPopup();
    initLiveSearchAutocomplete();
});

/* ==========================================================================
   LIVE SEARCH BAR WITH AUTO-COMPLETE WORDS & PRODUCTS DROPDOWN
   ========================================================================== */
function initLiveSearchAutocomplete() {
    const searchInputs = document.querySelectorAll('.search-form input[name="q"], .search-form input[type="text"], .search-bar-container input, #searchQueryInput');
    if (searchInputs.length === 0) return;

    function getPathPrefix() {
        const loc = window.location.pathname;
        if (loc.includes('/pages/auth/') || loc.includes('/pages/categories/') || loc.includes('/pages/policies/')) {
            return '../../';
        } else if (loc.includes('/pages/')) {
            return '../';
        }
        return '';
    }

    function getRecentSearches() {
        try {
            const data = localStorage.getItem('arshith_recent_searches');
            return data ? JSON.parse(data) : ['spices', 'oils', 'dry fruits', 'ghee'];
        } catch (e) {
            return ['spices', 'oils', 'dry fruits', 'ghee'];
        }
    }

    function saveRecentSearch(q) {
        if (!q || q.trim().length === 0) return;
        const query = q.trim();
        let list = getRecentSearches();
        list = list.filter(item => item.toLowerCase() !== query.toLowerCase());
        list.unshift(query);
        if (list.length > 6) list = list.slice(0, 6);
        try {
            localStorage.setItem('arshith_recent_searches', JSON.stringify(list));
        } catch (e) {}
    }

    window.removeRecentSearchItem = function(event, itemText) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        let list = getRecentSearches();
        list = list.filter(item => item.toLowerCase() !== itemText.toLowerCase());
        try {
            localStorage.setItem('arshith_recent_searches', JSON.stringify(list));
        } catch (e) {}
        
        document.querySelectorAll('.search-bar-container, .search-form').forEach(container => {
            const input = container.querySelector('input');
            const dropdown = container.querySelector('.search-suggestions-dropdown');
            if (input && dropdown && dropdown.classList.contains('active')) {
                renderSuggestions(input.value.trim(), dropdown);
            }
        });
    };

    window.clearAllRecentSearches = function(event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        try {
            localStorage.setItem('arshith_recent_searches', JSON.stringify([]));
        } catch (e) {}

        document.querySelectorAll('.search-bar-container, .search-form').forEach(container => {
            const input = container.querySelector('input');
            const dropdown = container.querySelector('.search-suggestions-dropdown');
            if (input && dropdown && dropdown.classList.contains('active')) {
                renderSuggestions(input.value.trim(), dropdown);
            }
        });
    };

    let allSearchProducts = [];
    let isFetchingProducts = false;

    const STARTER_SEARCH_CATALOG = [
        { _id: 's1', title: 'Granular Buffalo Ghee (Traditional Bilona)', category: 'Ghee and Honey', price: 699, image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_4.34.52_PM.jpg?v=1757934372&width=533' },
        { _id: 's2', title: 'Cold Pressed Sunflower Oil (Premium Quality)', category: 'Oils', price: 499, image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533' },
        { _id: 's3', title: 'Groundnut Oil (Cold Pressed)', category: 'Oils', price: 349, image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533' },
        { _id: 's4', title: 'Flax Seeds (Organic & Premium)', category: 'Dry Seeds', price: 29, image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334051&width=533' },
        { _id: 's5', title: 'Chia Seeds (High Fiber)', category: 'Dry Seeds', price: 49, image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334051&width=533' },
        { _id: 's6', title: 'Raw Wild Forest Honey', category: 'Ghee and Honey', price: 399, image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/4_6d56df69-1c9f-4f05-b1a7-ca631fc7b9aa.png?v=1757334051&width=533' },
        { _id: 's7', title: 'Cashews (W240 Grade Premium)', category: 'Dry Fruits', price: 899, image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533' },
        { _id: 's8', title: 'California Almonds (Badam)', category: 'Dry Fruits', price: 799, image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533' }
    ];

    async function loadSearchProducts() {
        if (allSearchProducts.length > 0) return;
        if (isFetchingProducts) return;
        isFetchingProducts = true;
        try {
            let res = await fetch('/api/products');
            if (!res.ok) res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                const fetched = Array.isArray(data) ? data : (data.data || []);
                if (fetched.length > 0) {
                    allSearchProducts = fetched;
                } else {
                    allSearchProducts = [];
                }
            } else {
                allSearchProducts = [];
            }
        } catch (e) {
            allSearchProducts = [];
        } finally {
            isFetchingProducts = false;
        }
    }

    searchInputs.forEach(input => {
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('spellcheck', 'false');

        const form = input.closest('form');
        const container = input.closest('.search-bar-container') || (form ? form.parentElement : input.parentElement);
        if (!container) return;

        container.style.position = 'relative';

        if (form && !form.querySelector('.search-clear-btn')) {
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'search-clear-btn';
            clearBtn.innerHTML = '&times;';
            clearBtn.style.display = 'none';
            clearBtn.title = 'Clear search text';
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                input.value = '';
                clearBtn.style.display = 'none';
                input.focus();
                renderSuggestions('', dropdown);
            });
            form.appendChild(clearBtn);
        }

        let dropdown = container.querySelector('.search-suggestions-dropdown');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'search-suggestions-dropdown';
            container.appendChild(dropdown);
        }

        const updateClearBtnState = () => {
            const clearBtn = form ? form.querySelector('.search-clear-btn') : null;
            if (clearBtn) {
                clearBtn.style.display = input.value.trim().length > 0 ? 'flex' : 'none';
            }
        };

        input.addEventListener('focus', () => {
            loadSearchProducts();
            updateClearBtnState();
            renderSuggestions(input.value.trim(), dropdown);
        });

        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            updateClearBtnState();
            loadSearchProducts().then(() => {
                renderSuggestions(query, dropdown);
            });
        });

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const q = input.value.trim();
                if (!q) return;
                saveRecentSearch(q);
                const prefix = getPathPrefix();
                window.location.href = `${prefix}pages/collections.html?search=${encodeURIComponent(q)}`;
            });
        }
    });

    function renderSuggestions(query, dropdown) {
        const qLower = query.toLowerCase();
        const prefix = getPathPrefix();
        const recents = getRecentSearches();

        let html = '';

        // 1. Saved Info (Recent Searches) Section with Cross Mark
        if (recents.length > 0) {
            const filteredRecents = query.length > 0 ? recents.filter(r => r.toLowerCase().includes(qLower)) : recents;
            if (filteredRecents.length > 0) {
                html += `
                    <div class="search-suggestion-header" style="display: flex; align-items: center; justify-content: space-between;">
                        <span>Saved info</span>
                        <button type="button" class="clear-all-searches-btn" onclick="clearAllRecentSearches(event)">Clear all</button>
                    </div>
                `;
                filteredRecents.forEach(item => {
                    html += `
                        <div class="search-saved-info-row" onclick="goToAllProducts('${escapeHtml(item)}')">
                            <div class="saved-info-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <span>${highlightMatch(item, query)}</span>
                            </div>
                            <button type="button" class="delete-saved-item-btn" title="Delete saved item" onclick="removeRecentSearchItem(event, '${escapeHtml(item).replace(/'/g, "\\'")}')">&times;</button>
                        </div>
                    `;
                });
            }
        }

        // 2. Typing Search Suggestions (Categories & Products)
        if (query.length > 0) {
            const matchingProducts = allSearchProducts.filter(p => {
                const title = (p.title || p.name || '').toLowerCase();
                const cat = (p.category || '').toLowerCase();
                const sub = (p.subcategory || '').toLowerCase();
                const desc = (p.description || '').toLowerCase();
                const brand = (p.brand || '').toLowerCase();
                return title.includes(qLower) || cat.includes(qLower) || sub.includes(qLower) || desc.includes(qLower) || brand.includes(qLower);
            }).slice(0, 5);

            const categories = [...new Set(allSearchProducts.map(p => p.category).filter(Boolean))];
            const matchingCats = categories.filter(c => c.toLowerCase().includes(qLower)).slice(0, 3);

            if (matchingCats.length > 0) {
                html += `<div class="search-suggestion-header">Suggested Categories</div>`;
                matchingCats.forEach(cat => {
                    html += `
                        <div class="search-suggestion-word" onclick="goToCategory('${escapeHtml(cat)}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f7139" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <span>${highlightMatch(cat, query)}</span>
                        </div>
                    `;
                });
            }

            if (matchingProducts.length > 0) {
                html += `<div class="search-suggestion-header">Matching Products</div>`;
                matchingProducts.forEach(p => {
                    const prodTitle = p.title || p.name || 'Product';
                    const imgData = extractProductImageData(p, 0);
                    const img = imgData.primary;
                    const price = p.price ? `₹${p.price}` : '';
                    const catName = p.category || 'General';
                    const detailUrl = `${prefix}pages/product.html?id=${encodeURIComponent(p._id || p.id || '')}`;

                    html += `
                        <a href="${detailUrl}" class="search-suggestion-item">
                            <img src="${img}" class="search-suggestion-thumb" alt="${escapeHtml(prodTitle)}" onerror="this.onerror=null; this.src='assets/images/placeholder.svg';">
                            <div class="search-suggestion-info">
                                <div class="search-suggestion-title">${highlightMatch(prodTitle, query)}</div>
                                <div class="search-suggestion-meta">
                                    <span>${escapeHtml(catName)}</span>
                                    ${price ? `<span class="search-suggestion-price">${price}</span>` : ''}
                                </div>
                            </div>
                        </a>
                    `;
                });
            }

            if (matchingProducts.length === 0 && matchingCats.length === 0 && recents.length === 0) {
                html += `
                    <div class="search-suggestion-header">Suggestions</div>
                    <div style="padding: 14px; text-align: center; color: #64748b; font-size: 13px;">
                        No products found for "<strong>${escapeHtml(query)}</strong>"
                    </div>
                `;
            }

            html += `
                <div class="search-suggestion-footer" onclick="goToAllProducts('${escapeHtml(query)}')">
                    See all results for "${escapeHtml(query)}" →
                </div>
            `;
        }

        if (html.trim().length === 0) {
            dropdown.classList.remove('active');
            return;
        }

        dropdown.innerHTML = html;
        dropdown.classList.add('active');
    }

    function highlightMatch(text, query) {
        if (!text || !query) return escapeHtml(text);
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return escapeHtml(text);
        const match = text.substring(idx, idx + query.length);
        const before = text.substring(0, idx);
        const after = text.substring(idx + query.length);
        return `${escapeHtml(before)}<strong style="color:#0f7139; background: #eef7f2; padding: 0 2px; border-radius: 2px;">${escapeHtml(match)}</strong>${escapeHtml(after)}`;
    }

    function escapeHtml(str) {
        return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    window.goToCategory = function(catName) {
        saveRecentSearch(catName);
        const prefix = getPathPrefix();
        window.location.href = `${prefix}pages/collections.html?search=${encodeURIComponent(catName)}`;
    };

    window.goToAllProducts = function(q) {
        if (q) saveRecentSearch(q);
        const prefix = getPathPrefix();
        window.location.href = `${prefix}pages/collections.html?search=${encodeURIComponent(q || '')}`;
    };

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar-container') && !e.target.closest('.search-form')) {
            document.querySelectorAll('.search-suggestions-dropdown').forEach(d => d.classList.remove('active'));
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.search-suggestions-dropdown').forEach(d => d.classList.remove('active'));
        }
    });
}

/* ==========================================================================
   GLOBAL UTILITIES (available to all modules outside DOMContentLoaded)
   ========================================================================== */
function escapeHtml(str) {
    return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
window.escapeHtml = escapeHtml;

/* ==========================================================================
   AMAZON-STYLE PRODUCT REVIEW & RATING CLIENT MODULE
   ========================================================================== */
let amazonReviewState = {
    productId: '',
    productName: '',
    reviews: [],
    stats: null,
    currentFilterRating: '',
    currentSort: 'recent',
    currentVerifiedOnly: false,
    selectedFormRating: 5,
    uploadedImages: [],
    editingReviewId: null,
    isLoading: false,
    isCollapsed: false,
    isFeedExpanded: false
};

const ratingLabelsMap = {
    5: '⭐⭐⭐⭐⭐ 5 Stars — Excellent / Highly Recommended!',
    4: '⭐⭐⭐⭐ 4 Stars — Very Good / High Quality',
    3: '⭐⭐⭐ 3 Stars — Good / Average Quality',
    2: '⭐⭐ 2 Stars — Below Average / Disappointed',
    1: '⭐ 1 Star — Poor / Not Recommended'
};

window.initAmazonProductReviews = function(product) {
    if (!product) return;
    const container = document.getElementById('amazonReviewsSection');
    if (!container) return;

    amazonReviewState.productId = product._id || product.id;
    amazonReviewState.productName = product.name || 'Product';
    amazonReviewState.currentFilterRating = '';
    amazonReviewState.currentSort = 'recent';
    amazonReviewState.currentVerifiedOnly = false;
    amazonReviewState.selectedFormRating = 5;
    amazonReviewState.uploadedImages = [];
    amazonReviewState.editingReviewId = null;
    amazonReviewState.isCollapsed = false;
    amazonReviewState.isFeedExpanded = false;

    fetchAndRenderAmazonReviews();
};

async function fetchAndRenderAmazonReviews() {
    const container = document.getElementById('amazonReviewsSection');
    if (!container) return;

    amazonReviewState.isLoading = true;

    try {
        let url = `/api/reviews/product/${encodeURIComponent(amazonReviewState.productId)}?sort=${amazonReviewState.currentSort}`;
        if (amazonReviewState.currentFilterRating) {
            url += `&rating=${amazonReviewState.currentFilterRating}`;
        }
        if (amazonReviewState.currentVerifiedOnly) {
            url += `&verifiedOnly=true`;
        }

        // Always fetch fresh — no browser caching so updated reviews always load
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();

        let fetchedReviews = (data && data.success && Array.isArray(data.reviews)) ? data.reviews : [];

        // Supplement with local review from Order History ONLY if backend doesn't already have it
        // (Backend is source of truth — only add local if backend returned no review for this user)
        try {
            const localRatings = JSON.parse(localStorage.getItem('arshith_product_ratings') || '{}');
            const currentUser = JSON.parse(localStorage.getItem('arshith_user') || 'null');
            const userEmail = currentUser && currentUser.email ? currentUser.email.toLowerCase() : null;

            // Check if backend already returned a review for the current user
            const backendAlreadyHasUserReview = userEmail &&
                fetchedReviews.some(r => r.customerEmail && r.customerEmail.toLowerCase() === userEmail);

            if (!backendAlreadyHasUserReview) {
                // Backend doesn't have it yet — check localStorage for a recently submitted review
                const pidKey = `pid_${amazonReviewState.productId}`;
                const userRatingForThis = localRatings[pidKey] ||
                    Object.values(localRatings).find(v => v && v.productId && v.productId === amazonReviewState.productId) ||
                    (amazonReviewState.productName && Object.values(localRatings).find(v => v && v.productName && v.productName.toLowerCase() === amazonReviewState.productName.toLowerCase()));

                if (userRatingForThis && userRatingForThis.comment) {
                    fetchedReviews.unshift({
                        _id: 'local_' + (userRatingForThis.date || Date.now()),
                        productId: amazonReviewState.productId,
                        productName: amazonReviewState.productName,
                        rating: userRatingForThis.rating || 5,
                        title: userRatingForThis.title || 'Customer Review',
                        comment: userRatingForThis.comment,
                        customerName: userRatingForThis.name || (currentUser ? currentUser.name : 'Verified Customer'),
                        customerEmail: userRatingForThis.email || userEmail || '',
                        verifiedPurchase: true,
                        helpfulCount: 0,
                        createdAt: userRatingForThis.date || new Date().toISOString()
                    });
                }
            }
        } catch (e) {}

        // Apply in-memory filter & sort if needed
        if (amazonReviewState.currentFilterRating) {
            fetchedReviews = fetchedReviews.filter(r => String(r.rating) === String(amazonReviewState.currentFilterRating));
        }
        if (amazonReviewState.currentVerifiedOnly) {
            fetchedReviews = fetchedReviews.filter(r => r.verifiedPurchase === true);
        }

        if (amazonReviewState.currentSort === 'rating_desc') {
            fetchedReviews.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (amazonReviewState.currentSort === 'rating_asc') {
            fetchedReviews.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        } else if (amazonReviewState.currentSort === 'helpful') {
            fetchedReviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
        } else {
            fetchedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        amazonReviewState.reviews = fetchedReviews;

        // Compute aggregate stats from REAL backend data
        let totalRev = 0, avgScore = 0, dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, distCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        const hasBackendStats = data && data.totalReviews !== undefined;

        if (hasBackendStats && data.totalReviews > 0) {
            // Real stats from backend
            totalRev = data.totalReviews;
            avgScore = data.averageRating || 0;
            dist = data.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            distCounts = data.distributionCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        } else if (fetchedReviews.length > 0) {
            totalRev = fetchedReviews.length;
            const totalScore = fetchedReviews.reduce((s, r) => s + (r.rating || 5), 0);
            avgScore = Math.round((totalScore / totalRev) * 10) / 10;
            fetchedReviews.forEach(r => {
                const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
                distCounts[star] = (distCounts[star] || 0) + 1;
            });
            dist = {
                5: Math.round((distCounts[5] / totalRev) * 100),
                4: Math.round((distCounts[4] / totalRev) * 100),
                3: Math.round((distCounts[3] / totalRev) * 100),
                2: Math.round((distCounts[2] / totalRev) * 100),
                1: Math.round((distCounts[1] / totalRev) * 100),
            };
        }

        amazonReviewState.stats = {
            averageRating: avgScore,
            totalReviews: totalRev,
            distributionCounts: distCounts,
            ratingDistribution: dist
        };

        // Update top product rating numbers beside photo
        updateTopProductRatingDisplay(avgScore, totalRev);


    } catch (err) {
        console.warn('Could not fetch reviews from backend, using local defaults:', err);
    } finally {
        amazonReviewState.isLoading = false;
        renderAmazonReviewsUI(container);
    }
}

function updateTopProductRatingDisplay(avg, totalCount) {
    const starsEl = document.getElementById('topRatingStarsVisual');
    const numEl = document.getElementById('topRatingScoreNum');
    const countEl = document.getElementById('topRatingCountText');

    if (starsEl) {
        const rounded = Math.round(avg);
        starsEl.innerHTML = '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
    }
    if (numEl) numEl.textContent = avg.toFixed(1);
    if (countEl) countEl.textContent = `(${totalCount.toLocaleString()} customer ratings)`;
}

function renderAmazonReviewsUI(container) {
    const stats = amazonReviewState.stats || {
        averageRating: 0,
        totalReviews: 0,
        distributionCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    const avg = stats.averageRating || 0;
    const total = stats.totalReviews || 0;
    const dist = stats.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const distCounts = stats.distributionCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    const roundedStars = Math.round(avg);
    const starString = '★'.repeat(roundedStars) + '☆'.repeat(5 - roundedStars);

    // Collect all customer images across reviews for the top gallery strip
    const allCustomerImages = [];
    amazonReviewState.reviews.forEach(r => {
        if (Array.isArray(r.images)) {
            r.images.forEach(img => {
                if (img && !allCustomerImages.includes(img)) allCustomerImages.push(img);
            });
        }
    });

    // Fallback product image if no photo gallery in reviews
    if (allCustomerImages.length === 0) {
        const prod = window.currentProductData || {};
        const pImg = prod.image || (prod.images && prod.images[0] ? (typeof prod.images[0] === 'string' ? prod.images[0] : prod.images[0].url) : '');
        if (pImg) allCustomerImages.push(pImg);
    }

    // Get Logged In User
    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('arshith_user'));
    } catch (e) {}

    const isCollapsed = amazonReviewState.isCollapsed === true;
    const allReviewsList = amazonReviewState.reviews || [];
    const isFeedExpanded = amazonReviewState.isFeedExpanded === true;
    const displayedReviews = isFeedExpanded ? allReviewsList : allReviewsList.slice(0, 3);

    container.innerHTML = `
        <!-- Collapsible Dropdown Accordion Header for Reviews Section Only -->
        <div id="reviewsDropdownHeaderBtn" class="reviews-dropdown-header" onclick="toggleAmazonReviewsDropdown()" style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1.5px solid ${isCollapsed ? '#cbd5e1' : '#0f7139'}; padding: 16px 24px; border-radius: 14px; margin-bottom: 24px; cursor: pointer; user-select: none; box-shadow: 0 4px 16px rgba(15,113,57,0.06); transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                <span style="font-size: 22px;">⭐</span>
                <h3 style="font-size: 19px; font-weight: 800; color: #0f7139; margin: 0;">Customer Reviews & Ratings</h3>
                <span style="background: #e8f5e9; color: #0f7139; font-size: 13px; font-weight: 800; padding: 4px 14px; border-radius: 20px; border: 1px solid #a7f3d0;">
                    ${avg.toFixed(1)} ★ (${total.toLocaleString()} ratings)
                </span>
                ${amazonReviewState.currentFilterRating ? `<span style="background: #0f7139; color: #ffffff; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 12px;">Filtered: ${amazonReviewState.currentFilterRating} Stars</span>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #0f7139;">
                <span id="reviewsDropdownToggleText">${isCollapsed ? 'Expand Reviews' : 'Collapse Reviews'}</span>
                <span id="reviewsDropdownChevron" style="display: inline-block; transition: transform 0.25s ease; font-size: 14px; transform: rotate(${isCollapsed ? '180deg' : '0deg'});">▲</span>
            </div>
        </div>

        <!-- Collapsible Container Body -->
        <div id="reviewsDropdownBody" style="display: ${isCollapsed ? 'none' : 'block'}; transition: all 0.3s ease;">
            
            <div class="amazon-reviews-grid" style="display: grid; grid-template-columns: 340px 1fr; gap: 48px; align-items: start;">
                
                <!-- LEFT COLUMN: RATING BREAKDOWN & SUMMARY -->
                <div class="reviews-summary-panel" style="background: #ffffff; padding: 0;">
                    <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Customer reviews</h3>
                    
                    <div class="overall-score-box" style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                        <div class="overall-stars-row" style="color: #de7921; font-size: 20px; letter-spacing: 1px;">${starString}</div>
                        <span class="overall-score-num" style="font-size: 18px; font-weight: 700; color: #0f172a;">${avg.toFixed(1)} out of 5</span>
                    </div>
                    <span class="total-ratings-label" style="font-size: 13.5px; color: #565959; margin-bottom: 18px; display: block;">${total.toLocaleString()} global ratings</span>

                    <!-- 5 to 1 Star Progress Breakdown Bars -->
                    <div class="distribution-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;">
                        ${[5, 4, 3, 2, 1].map(starNum => {
                            const pct = dist[starNum] || 0;
                            const count = distCounts[starNum] || 0;
                            const isSelected = amazonReviewState.currentFilterRating === String(starNum);
                            return `
                                <div class="distribution-row ${isSelected ? 'active-filter-row' : ''}" 
                                     onclick="setAmazonReviewFilter('${isSelected ? '' : starNum}')" 
                                     title="Filter by ${starNum} star reviews (${count} review${count === 1 ? '' : 's'})"
                                     style="display: flex; align-items: center; gap: 12px; font-size: 13.5px; cursor: pointer; padding: 3px 0; border-radius: 4px;">
                                    <span class="dist-star-label" style="width: 48px; color: #007185; font-weight: 500; white-space: nowrap; text-decoration: underline;">${starNum} star</span>
                                    <div class="dist-bar-track" style="flex: 1; height: 20px; background: #f0f2f2; border: 1px solid #d5d9d9; border-radius: 4px; overflow: hidden; position: relative; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
                                        <div class="dist-bar-fill" style="height: 100%; background: #de7921; border-radius: 3px; width: ${pct}%;"></div>
                                    </div>
                                    <span class="dist-pct-label" style="width: 36px; text-align: right; font-weight: 500; color: #007185; font-size: 13px;">${pct}%</span>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- Verified Purchase Policy Notice -->
                    <div class="write-review-prompt-box" style="border-top: 1px solid #e7e7e7; padding-top: 18px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="font-size: 16px;">🛡️</span>
                            <strong style="font-size: 14px; color: #0f172a;">Verified Reviews Only</strong>
                        </div>
                        <p style="margin: 0; font-size: 12.5px; line-height: 1.5; color: #565959;">
                            To guarantee 100% authentic ratings, only customers who purchased this product can leave reviews from their <a href="../profile.html" style="color: #007185; font-weight: 600; text-decoration: none;">Order History</a>.
                        </p>
                    </div>
                </div>

                <!-- RIGHT COLUMN: REVIEWS FEED -->
                <div class="reviews-feed-panel" style="display: flex; flex-direction: column; gap: 24px;">

                    <!-- Feed Header: Title + Star Rating Dropdown + Sort Dropdown -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e7e7e7; padding-bottom: 12px; flex-wrap: wrap; gap: 12px;">
                        <h3 style="font-size: 19px; font-weight: 700; color: #0f172a; margin: 0;">Top Customer Reviews</h3>
                        
                        <!-- Dropdown Select Controls (Rating Filter Dropdown + Sort Dropdown) -->
                        <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <label style="font-size: 13px; color: #565959; font-weight: 600;">Filter Rating:</label>
                                <select onchange="setAmazonReviewFilter(this.value)" style="padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; color: #0f172a; background: #ffffff; cursor: pointer; outline: none; font-weight: 600;">
                                    <option value="" ${amazonReviewState.currentFilterRating === '' ? 'selected' : ''}>All Star Ratings</option>
                                    <option value="5" ${amazonReviewState.currentFilterRating === '5' ? 'selected' : ''}>⭐⭐⭐⭐⭐ 5 Stars</option>
                                    <option value="4" ${amazonReviewState.currentFilterRating === '4' ? 'selected' : ''}>⭐⭐⭐⭐ 4 Stars</option>
                                    <option value="3" ${amazonReviewState.currentFilterRating === '3' ? 'selected' : ''}>⭐⭐⭐ 3 Stars</option>
                                    <option value="2" ${amazonReviewState.currentFilterRating === '2' ? 'selected' : ''}>⭐⭐ 2 Stars</option>
                                    <option value="1" ${amazonReviewState.currentFilterRating === '1' ? 'selected' : ''}>⭐ 1 Star</option>
                                </select>
                            </div>

                            <div style="display: flex; align-items: center; gap: 6px;">
                                <label style="font-size: 13px; color: #565959; font-weight: 600;">Sort by:</label>
                                <select onchange="handleAmazonReviewSort(this.value)" style="padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; color: #0f172a; background: #ffffff; cursor: pointer; outline: none; font-weight: 600;">
                                    <option value="recent" ${amazonReviewState.currentSort === 'recent' ? 'selected' : ''}>Most recent</option>
                                    <option value="rating_desc" ${amazonReviewState.currentSort === 'rating_desc' ? 'selected' : ''}>Highest rating</option>
                                    <option value="rating_asc" ${amazonReviewState.currentSort === 'rating_asc' ? 'selected' : ''}>Lowest rating</option>
                                    <option value="helpful" ${amazonReviewState.currentSort === 'helpful' ? 'selected' : ''}>Most helpful</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Reviews Feed List (Matching User's Amazon Screenshot) -->
                    <div class="reviews-list-container" style="display: flex; flex-direction: column; gap: 26px;">
                        ${displayedReviews.length === 0 ? `
                            <div style="text-align: center; padding: 40px 20px; background: #fafafa; border: 1px dashed #d5d9d9; border-radius: 8px; color: #565959;">
                                <p style="font-size: 15px; font-weight: 600; color: #0f1111; margin: 0 0 6px 0;">No customer reviews match this filter</p>
                                <p style="font-size: 13.5px; margin: 0; color: #565959;">Try selecting "All Star Ratings" to view all customer reviews for this product.</p>
                            </div>
                        ` : displayedReviews.map(r => {
                            const stars = '★'.repeat(r.rating || 5) + '☆'.repeat(5 - (r.rating || 5));
                            const dateFormatted = new Date(r.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            });

                            return `
                                <div class="review-item-card" id="review_card_${r._id}" style="border-bottom: 1px solid #e7e7e7; padding-bottom: 22px;">
                                    
                                    <!-- Author Row (Grey avatar icon + Customer Name) -->
                                    <div class="review-author-row" style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                                        <div style="width: 32px; height: 32px; border-radius: 50%; background: #d5d9d9; display: flex; align-items: center; justify-content: center; color: #ffffff;">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                        </div>
                                        <span class="author-name-text" style="font-weight: 500; font-size: 13.5px; color: #0f1111;">${escapeHtml(r.customerName || 'Amazon Customer')}</span>
                                    </div>

                                    <!-- Star Rating & Title Headline (Exact Amazon Format) -->
                                    <div class="review-rating-headline-row" style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                                        <span class="review-card-stars" style="color: #de7921; font-size: 15px; letter-spacing: 1px;">${stars}</span>
                                        <strong class="review-card-title" style="font-weight: 700; font-size: 14px; color: #0f1111;">${escapeHtml(r.title || 'VALUE FOR MONEY')}</strong>
                                    </div>

                                    <!-- Date & Verified Purchase Badge -->
                                    <div class="review-date-verified-row" style="font-size: 13px; color: #565959; margin-bottom: 10px;">
                                        <span>Reviewed in India on ${dateFormatted}</span>
                                        ${r.verifiedPurchase ? `
                                            <div style="margin-top: 3px;">
                                                <span style="color: #c45500; font-weight: 700; font-size: 12px;">Verified Purchase</span>
                                            </div>
                                        ` : ''}
                                    </div>

                                    <!-- Review Comment Body Text -->
                                    <p class="review-card-comment" style="font-size: 14px; line-height: 1.55; color: #0f1111; margin: 0 0 12px 0;">${escapeHtml(r.comment)}</p>

                                    <!-- Product Tag Badge (Matching User's Screenshot) -->
                                    ${r.productName ? `
                                        <div style="margin-bottom: 12px; display: inline-flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 5px 12px; border-radius: 8px; font-size: 12.5px; color: #007185; font-weight: 600;">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                                            <span>${escapeHtml(r.productName)}</span>
                                        </div>
                                    ` : ''}

                                    <!-- Optional Photo Gallery Thumbnails -->
                                    ${r.images && r.images.length > 0 ? `
                                        <div class="review-images-gallery" style="display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;">
                                            ${r.images.map(img => `
                                                <img src="${img}" class="review-img-thumb" onclick="openAmazonReviewLightbox('${img.replace(/'/g, "\\'")}')" alt="Customer review photo" style="width: 88px; height: 88px; border-radius: 6px; object-fit: cover; border: 1px solid #d5d9d9; cursor: pointer;">
                                            `).join('')}
                                        </div>
                                    ` : ''}

                                    <!-- Helpful count text -->
                                    <div style="font-size: 13px; color: #565959; margin-bottom: 10px;">
                                        ${(r.helpfulCount && r.helpfulCount > 0) ? `${r.helpfulCount} ${r.helpfulCount === 1 ? 'person' : 'people'} found this helpful` : 'One person found this helpful'}
                                    </div>

                                    <!-- Helpful button + Report link -->
                                    <div class="review-actions-footer" style="display: flex; align-items: center; gap: 16px;">
                                        <button type="button" class="helpful-vote-btn" onclick="toggleAmazonHelpfulVote('${r._id}')" style="background: #ffffff; border: 1px solid #d5d9d9; border-radius: 8px; padding: 5px 22px; font-size: 13px; font-weight: 500; color: #0f1111; cursor: pointer; box-shadow: 0 2px 5px rgba(213,217,217,.5); transition: background 0.15s;">
                                            Helpful
                                        </button>
                                        <span style="color: #d5d9d9;">|</span>
                                        <a href="javascript:void(0)" onclick="if(typeof showToast==='function') showToast('Thank you for reporting. Our moderation team will review it.'); else alert('Thank you for reporting.');" style="font-size: 13px; color: #565959; text-decoration: none;">Report</a>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- Expand/Collapse Dropdown Button for Reviews List -->
                    ${allReviewsList.length > 3 ? `
                        <div style="margin-top: 18px; text-align: center;">
                            <button type="button" onclick="toggleAmazonReviewsFeedExpand()" style="width: 100%; max-width: 440px; padding: 12px 24px; background: #f0fdf4; border: 1.5px solid #a7f3d0; border-radius: 12px; color: #0f7139; font-weight: 700; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 2px 8px rgba(15,113,57,0.08); transition: all 0.2s ease;">
                                <span>${isFeedExpanded ? '▲ Collapse Reviews List' : `▼ View All ${allReviewsList.length} Customer Reviews (Dropdown)`}</span>
                            </button>
                        </div>
                    ` : ''}

                </div>

            </div>
        </div>

        <!-- Review Photo Lightbox Modal -->
        <div id="amazonReviewLightbox" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(4px); z-index: 99999; align-items: center; justify-content: center; padding: 20px;" onclick="closeAmazonReviewLightbox()">
            <div style="position: relative; max-width: 90vw; max-height: 90vh;">
                <img id="amazonLightboxImg" src="" style="max-width: 100%; max-height: 85vh; border-radius: 8px; object-fit: contain;">
                <button type="button" style="position: absolute; top: -14px; right: -14px; width: 36px; height: 36px; border-radius: 50%; background: #ffffff; border: none; font-size: 20px; font-weight: bold; cursor: pointer; color: #0f172a;">&times;</button>
            </div>
        </div>
    `;
}

// Interaction Handlers
window.toggleAmazonReviewForm = function(forceOpen) {
    const card = document.getElementById('amazonWriteReviewCard');
    if (!card) return;

    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('arshith_user'));
    } catch (e) {}

    if (forceOpen === true && !currentUser) {
        if (typeof showToast === 'function') {
            showToast('Please log in to write a product review.');
        } else {
            alert('Please log in to write a product review.');
        }
        setTimeout(() => {
            window.location.href = 'auth/login.html';
        }, 600);
        return;
    }

    if (forceOpen === true) {
        card.style.display = 'block';
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (forceOpen === false) {
        card.style.display = 'none';
        amazonReviewState.editingReviewId = null;
        amazonReviewState.uploadedImages = [];
        const form = document.getElementById('amazonReviewForm');
        if (form) form.reset();
    } else {
        const isOpen = card.style.display === 'block';
        card.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

window.setInteractiveFormRating = function(star) {
    amazonReviewState.selectedFormRating = Number(star);
    updateInteractiveStarsVisual(amazonReviewState.selectedFormRating);
};

window.previewInteractiveStars = function(star) {
    updateInteractiveStarsVisual(Number(star));
};

window.restoreInteractiveStars = function() {
    updateInteractiveStarsVisual(amazonReviewState.selectedFormRating);
};

function updateInteractiveStarsVisual(starCount) {
    const btns = document.querySelectorAll('.star-pick-btn');
    btns.forEach(btn => {
        const s = Number(btn.getAttribute('data-star'));
        if (s <= starCount) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const labelEl = document.getElementById('starFeedbackText');
    if (labelEl) {
        labelEl.textContent = ratingLabelsMap[starCount] || `${starCount} Stars`;
    }
}

window.handleReviewImageUpload = async function(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    function compressReviewImg(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let w = img.width, h = img.height;
                    const max = 800;
                    if (w > max || h > max) {
                        if (w > h) { h = Math.round((h * max) / w); w = max; }
                        else { w = Math.round((w * max) / h); h = max; }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = () => resolve(null);
                img.src = e.target.result;
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
        });
    }

    for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressReviewImg(file);
        if (compressed) {
            amazonReviewState.uploadedImages.push(compressed);
        }
    }
    renderReviewImagePreviews();
};

function renderReviewImagePreviews() {
    const previewBox = document.getElementById('reviewImagesPreviewBox');
    if (!previewBox) return;

    previewBox.innerHTML = amazonReviewState.uploadedImages.map((img, idx) => `
        <div style="position: relative; display: inline-block;">
            <img src="${img}" style="width: 60px; height: 60px; border-radius: 6px; object-fit: cover; border: 1px solid #cbd5e1;">
            <button type="button" onclick="removeReviewImage(${idx})" style="position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border-radius: 50%; background: #dc2626; color: #fff; border: none; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>
    `).join('');
}

window.removeReviewImage = function(index) {
    amazonReviewState.uploadedImages.splice(index, 1);
    renderReviewImagePreviews();
};

window.handleAmazonReviewFormSubmit = async function(event) {
    event.preventDefault();
    const btn = document.getElementById('submitAmazonReviewBtn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Submitting...';
    }

    const rating = amazonReviewState.selectedFormRating || 5;
    const name = document.getElementById('reviewAuthorInput').value.trim();
    const email = document.getElementById('reviewEmailInput').value.trim();
    const title = document.getElementById('reviewTitleInput').value.trim();
    const comment = document.getElementById('reviewCommentInput').value.trim();

    if (!rating || !name || !email || !title || !comment) {
        alert('Please fill out all required fields.');
        if (btn) { btn.disabled = false; btn.textContent = 'Submit Review ✨'; }
        return;
    }

    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('arshith_user'));
    } catch (e) {}

    const payload = {
        productId: amazonReviewState.productId,
        productName: amazonReviewState.productName,
        rating,
        title,
        comment,
        customerName: name,
        customerEmail: email,
        userId: currentUser ? currentUser._id : null,
        images: amazonReviewState.uploadedImages
    };

    try {
        let res, data;
        if (amazonReviewState.editingReviewId) {
            // Update existing review
            res = await fetch(`/api/reviews/${amazonReviewState.editingReviewId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            data = await res.json();
        } else {
            // Create new review
            res = await fetch(`/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            data = await res.json();
        }

        if (data && data.success) {
            if (typeof showToast === 'function') {
                showToast(data.message || '🎉 Review submitted successfully!');
            } else {
                alert(data.message || '🎉 Review submitted successfully!');
            }

            toggleAmazonReviewForm(false);
            fetchAndRenderAmazonReviews();
        } else {
            alert(data.message || 'Failed to submit review');
        }
    } catch (err) {
        alert('Error: ' + err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Submit Review ✨';
        }
    }
};

window.toggleAmazonReviewsDropdown = function() {
    amazonReviewState.isCollapsed = !amazonReviewState.isCollapsed;
    const container = document.getElementById('amazonReviewsSection');
    if (container) {
        renderAmazonReviewsUI(container);
    }
};

window.toggleAmazonReviewsFeedExpand = function() {
    amazonReviewState.isFeedExpanded = !amazonReviewState.isFeedExpanded;
    const container = document.getElementById('amazonReviewsSection');
    if (container) {
        renderAmazonReviewsUI(container);
    }
};

window.setAmazonReviewFilter = function(starVal) {
    amazonReviewState.currentFilterRating = starVal;
    fetchAndRenderAmazonReviews();
};

window.toggleAmazonVerifiedFilter = function() {
    amazonReviewState.currentVerifiedOnly = !amazonReviewState.currentVerifiedOnly;
    fetchAndRenderAmazonReviews();
};

window.handleAmazonReviewSort = function(sortVal) {
    amazonReviewState.currentSort = sortVal;
    fetchAndRenderAmazonReviews();
};

window.toggleAmazonHelpfulVote = async function(reviewId) {
    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('arshith_user'));
    } catch (e) {}

    const voterId = currentUser ? currentUser.email : (localStorage.getItem('arshith_voter_id') || 'guest_' + Math.random().toString(36).substring(2, 9));
    localStorage.setItem('arshith_voter_id', voterId);

    try {
        const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userIdentifier: voterId })
        });
        const data = await res.json();
        if (data && data.success) {
            fetchAndRenderAmazonReviews();
        }
    } catch (err) {
        console.error('Error voting helpful:', err);
    }
};

window.editAmazonOwnReview = function(reviewId) {
    const rev = amazonReviewState.reviews.find(r => String(r._id) === String(reviewId));
    if (!rev) return;

    amazonReviewState.editingReviewId = reviewId;
    amazonReviewState.selectedFormRating = rev.rating || 5;
    amazonReviewState.uploadedImages = rev.images || [];

    toggleAmazonReviewForm(true);

    const titleInput = document.getElementById('reviewTitleInput');
    const commentInput = document.getElementById('reviewCommentInput');
    const nameInput = document.getElementById('reviewAuthorInput');
    const emailInput = document.getElementById('reviewEmailInput');

    if (titleInput) titleInput.value = rev.title || '';
    if (commentInput) commentInput.value = rev.comment || '';
    if (nameInput) nameInput.value = rev.customerName || '';
    if (emailInput) emailInput.value = rev.customerEmail || '';

    updateInteractiveStarsVisual(rev.rating || 5);
    renderReviewImagePreviews();
};

window.deleteAmazonOwnReview = async function(reviewId) {
    if (!confirm('Are you sure you want to delete your review?')) return;

    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('arshith_user'));
    } catch (e) {}

    try {
        const res = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerEmail: currentUser ? currentUser.email : '' })
        });
        const data = await res.json();
        if (data && data.success) {
            if (typeof showToast === 'function') showToast('Review deleted successfully');
            fetchAndRenderAmazonReviews();
        } else {
            alert(data.message || 'Failed to delete review');
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
};

window.openAmazonReviewLightbox = function(imgUrl) {
    const lightbox = document.getElementById('amazonReviewLightbox');
    const img = document.getElementById('amazonLightboxImg');
    if (lightbox && img) {
        img.src = imgUrl;
        lightbox.style.display = 'flex';
    }
};

window.closeAmazonReviewLightbox = function() {
    const lightbox = document.getElementById('amazonReviewLightbox');
    if (lightbox) lightbox.style.display = 'none';
};

// ============================================================
// 🌟 DYNAMIC HOMEPAGE PRODUCT LISTINGS (ADMIN PORTAL IS SINGLE SOURCE OF TRUTH)
// Synchronizes every section grid on index.html with live /api/products from Admin Portal
// ============================================================
async function syncHomepageProductsWithAdminDatabase() {
    const favoriteGrid = document.querySelector('.sec-favorites .products-grid');
    const oilsGrid = document.querySelector('.sec-oils .products-grid');
    const dryfruitsGrid = document.querySelector('.sec-dryfruits .products-grid');
    const powdersGrid = document.querySelector('.sec-powders .products-grid');
    const wellnessGrid = document.querySelector('.sec-wellness .products-grid');

    if (!favoriteGrid && !oilsGrid && !dryfruitsGrid && !powdersGrid && !wellnessGrid) {
        return;
    }

    try {
        const prodRes = await fetch('/api/products');
        if (!prodRes.ok) return;
        const products = await prodRes.json();
        if (!Array.isArray(products) || products.length === 0) return;

        // Active products from Admin Portal
        const activeProducts = products.filter(p => (p.countInStock === undefined || Number(p.countInStock) >= 0) && p.status !== 'archived');

        const buildCardHtml = (p) => {
            if (typeof createProductCardHTML === 'function') {
                return createProductCardHTML(p);
            }
            const imgData = extractProductImageData(p, 0);
            const pId = p._id || p.id || '';
            const name = escapeHtml(p.name || p.title || 'Product');
            const price = Number(p.price) || 0;
            const origPrice = Number(p.originalPrice) || 0;
            const imgPrimary = imgData.primary;
            const imgHover = imgData.hover || imgPrimary;

            let discountTagHtml = '';
            if (origPrice > price) {
                const pct = Math.round(((origPrice - price) / origPrice) * 100);
                if (pct > 0) discountTagHtml = `<span class="card-discount-tag">${pct}% Off</span>`;
            } else if (p.isFeatured) {
                discountTagHtml = `<span class="card-discount-tag" style="background:#005d4a;">Featured</span>`;
            }

            const ratingNum = Number(p.rating || 4.9).toFixed(1);
            const numReviews = Number(p.numReviews || 0);
            const starsFilled = Math.round(p.rating || 5);
            const starsStr = '★'.repeat(starsFilled) + '☆'.repeat(5 - starsFilled);

            const ratingText = numReviews > 0 ? `${ratingNum} / 5.0 (${numReviews})` : '4.9 / 5.0 (25+)';

            return `
                <div class="product-card" data-db-id="${pId}">
                    <a href="pages/product.html?id=${encodeURIComponent(pId)}" class="product-card-link">
                        <div class="product-image-container ${imgHover !== imgPrimary ? 'has-second-img' : ''}">
                            <img src="${imgPrimary}" alt="${name}" class="primary-img" onerror="this.onerror=null; this.src='assets/images/placeholder.svg';">
                            ${imgHover !== imgPrimary ? `<img src="${imgHover}" alt="${name} Hover" class="hover-img" onerror="this.onerror=null; this.style.display='none';">` : ''}
                            ${discountTagHtml}
                        </div>
                        <div class="product-info">
                            <h3 class="card__heading">${name}</h3>
                            <div class="rating-box">
                                <span class="rating-stars">${starsStr}</span>
                                <span class="rating-text">${ratingText}</span>
                            </div>
                            <div class="price-box">
                                <span class="sale-price">Rs. ${price.toFixed(2)}</span>
                                ${origPrice > price ? `<span class="regular-price">Rs. ${origPrice.toFixed(2)}</span>` : ''}
                            </div>
                        </div>
                    </a>
                    <button class="add-to-cart-btn" onclick="addToStoreCart('${pId}', '${name.replace(/'/g, "\\'")}', ${price}, '${imgPrimary}')">ADD TO CART</button>
                </div>
            `;
        };

        // 1. Favorites Section
        if (favoriteGrid) {
            const favProducts = activeProducts.filter(p => p.isFeatured).concat(activeProducts.filter(p => !p.isFeatured));
            favoriteGrid.innerHTML = favProducts.slice(0, 10).map(buildCardHtml).join('');
        }

        // 2. Oils Section
        if (oilsGrid) {
            const oilProducts = activeProducts.filter(p => {
                const cat = (p.category || '').toLowerCase();
                const nm = (p.name || '').toLowerCase();
                return cat.includes('oil') || nm.includes('oil') || cat.includes('ghee') || nm.includes('ghee');
            });
            const items = oilProducts.length > 0 ? oilProducts : activeProducts.slice(0, 8);
            oilsGrid.innerHTML = items.map(buildCardHtml).join('');
        }

        // 3. Dry Fruits Section
        if (dryfruitsGrid) {
            const dfProducts = activeProducts.filter(p => {
                const cat = (p.category || '').toLowerCase();
                const nm = (p.name || '').toLowerCase();
                return cat.includes('dry') || cat.includes('fruit') || nm.includes('almond') || nm.includes('cashew') || nm.includes('kaju') || nm.includes('badam') || nm.includes('fig') || nm.includes('anjeer') || nm.includes('walnut') || nm.includes('akhrot') || nm.includes('raisin') || nm.includes('kismis') || nm.includes('pista');
            });
            const items = dfProducts.length > 0 ? dfProducts : activeProducts.slice(0, 8);
            dryfruitsGrid.innerHTML = items.map(buildCardHtml).join('');
        }

        // 4. Spice Powders Section
        if (powdersGrid) {
            const pwProducts = activeProducts.filter(p => {
                const cat = (p.category || '').toLowerCase();
                const nm = (p.name || '').toLowerCase();
                return cat.includes('powder') || cat.includes('spice') || nm.includes('podi') || nm.includes('karam') || nm.includes('powder');
            });
            const items = pwProducts.length > 0 ? pwProducts : activeProducts.slice(0, 8);
            powdersGrid.innerHTML = items.map(buildCardHtml).join('');
        }

        // 5. Wellness & Seeds Section
        if (wellnessGrid) {
            const wlProducts = activeProducts.filter(p => {
                const cat = (p.category || '').toLowerCase();
                const nm = (p.name || '').toLowerCase();
                return cat.includes('seed') || nm.includes('seed') || cat.includes('spice') || nm.includes('spice') || cat.includes('essential') || cat.includes('cooking');
            });
            const items = wlProducts.length > 0 ? wlProducts : activeProducts.slice(0, 8);
            wellnessGrid.innerHTML = items.map(buildCardHtml).join('');
        }

    } catch (err) {
        console.error('[Homepage Sync Error]', err);
    }
}

// ============================================================
// 🌟 REAL REVIEWS & RATINGS SYNC (HOMEPAGE & STOREFRONT)
// Replaces hardcoded/fake review numbers with 100% real MongoDB data
// ============================================================
async function syncHomepageRealRatingsAndReviews() {
    // 1. Fetch Real Products from Backend
    try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
            const products = await prodRes.json();
            if (Array.isArray(products) && products.length > 0) {
                // Map products by name and slug for fast lookup
                const prodMap = {};
                products.forEach(p => {
                    if (p.name) prodMap[p.name.toLowerCase().trim()] = p;
                    if (p.title) prodMap[p.title.toLowerCase().trim()] = p;
                });

                // Update all product cards on the current page
                const cards = document.querySelectorAll('.product-card');
                cards.forEach(card => {
                    const headingEl = card.querySelector('.card__heading');
                    const ratingBox = card.querySelector('.rating-box');
                    if (!headingEl || !ratingBox) return;

                    const title = headingEl.textContent.trim().toLowerCase();
                    const matched = prodMap[title] || Object.values(prodMap).find(p => title.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(title));

                    if (matched) {
                        const count = Number(matched.numReviews || 0);
                        const rate = Number(matched.rating || 5.0).toFixed(1);
                        const starsFilled = Math.round(matched.rating || 5);
                        const starsStr = '★'.repeat(starsFilled) + '☆'.repeat(5 - starsFilled);

                        const starsEl = ratingBox.querySelector('.rating-stars');
                        const textEl = ratingBox.querySelector('.rating-text');

                        if (starsEl) starsEl.textContent = starsStr;
                        if (textEl) {
                            textEl.textContent = count > 0 ? `${rate} / 5.0 (${count})` : 'No reviews yet';
                        }
                    } else {
                        // Product without DB match -> show clean no reviews yet
                        const textEl = ratingBox.querySelector('.rating-text');
                        if (textEl) textEl.textContent = 'No reviews yet';
                    }
                });
            }
        }
    } catch (err) {
        console.debug('[Reviews Sync] Products fetch error:', err);
    }

    // 2. Fetch Real Reviews for Homepage Showcase
    const reviewsGrid = document.getElementById('homepageRealReviewsGrid');
    if (!reviewsGrid) return;

    try {
        const revRes = await fetch('/api/reviews/latest?limit=8');
        if (!revRes.ok) throw new Error('API ' + revRes.status);
        const revData = await revRes.json();
        const reviews = revData.reviews || [];

        if (reviews.length === 0) {
            reviewsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px; color: #64748b;">
                    <div style="font-size: 32px; margin-bottom: 8px;">🌿</div>
                    <h4 style="margin: 0 0 6px 0; color: #1e293b; font-size: 16px;">Be the First to Leave a Review!</h4>
                    <p style="margin: 0 0 16px 0; font-size: 13.5px;">Order our farm-fresh products and share your authentic feedback with our community.</p>
                    <a href="pages/collections.html?category=all" style="display: inline-block; background: #0f7139; color: #fff; padding: 8px 20px; border-radius: 20px; text-decoration: none; font-weight: 600; font-size: 13px;">Shop Our Products &rarr;</a>
                </div>
            `;
            return;
        }

        reviewsGrid.innerHTML = reviews.map(r => {
            const stars = '★'.repeat(r.rating || 5) + '☆'.repeat(5 - (r.rating || 5));
            const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : 'Recent';

            const prodName = r.productName || (r.productId && r.productId.name) || 'Arshith Fresh Product';
            const prodImg = (r.productId && r.productId.image) || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=120';
            const customerInitial = (r.customerName || 'C').charAt(0).toUpperCase();

            return `
                <div class="homepage-real-review-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: transform 0.2s ease, box-shadow 0.2s ease;">
                    <!-- Top Author Row -->
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
                        <div style="width: 38px; height: 38px; border-radius: 50%; background: #e8f5e9; color: #0f7139; font-weight: 700; font-size: 15px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            ${customerInitial}
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                                <strong style="font-size: 13.5px; color: #1e293b;">${escapeHtml(r.customerName || 'Customer')}</strong>
                                ${r.verifiedPurchase ? '<span style="background: #dcfce7; color: #15803d; font-size: 10.5px; font-weight: 700; padding: 1px 6px; border-radius: 10px;">✓ Verified</span>' : ''}
                            </div>
                            <span style="font-size: 11.5px; color: #94a3b8;">${dateStr}</span>
                        </div>
                    </div>

                    <!-- Star Rating & Title -->
                    <div style="margin-bottom: 10px;">
                        <div style="color: #de7921; font-size: 14px; letter-spacing: 1px; margin-bottom: 2px;">${stars}</div>
                        <strong style="font-size: 14px; color: #0f172a;">${escapeHtml(r.title || 'Customer Review')}</strong>
                    </div>

                    <!-- Review Comment Body -->
                    <p style="font-size: 13px; line-height: 1.5; color: #334155; margin: 0 0 16px 0; flex: 1; word-break: break-word;">
                        "${escapeHtml(r.comment)}"
                    </p>

                    <!-- Product Tag Footer -->
                    <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 8px;">
                        <img src="${prodImg}" alt="${escapeHtml(prodName)}" style="width: 28px; height: 28px; border-radius: 4px; object-fit: cover; border: 1px solid #e2e8f0;">
                        <span style="font-size: 11.5px; font-weight: 600; color: #0284c7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${escapeHtml(prodName)}
                        </span>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.debug('[Reviews Sync] Latest reviews fetch error:', err);
    }
}

// Automatically trigger on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        syncHomepageRealRatingsAndReviews();
        updateWishlistBadgeCount();
    });
} else {
    syncHomepageRealRatingsAndReviews();
    updateWishlistBadgeCount();
}

/* ====================================================
   INTERACTIVE STOREFRONT WISHLIST MODULE
   ==================================================== */

function getStoredWishlist() {
    try {
        return JSON.parse(localStorage.getItem('arshith_wishlist')) || [];
    } catch (e) {
        return [];
    }
}

function saveStoredWishlist(items) {
    try {
        localStorage.setItem('arshith_wishlist', JSON.stringify(items));
    } catch (e) {}
    updateWishlistBadgeCount();
}

function updateWishlistBadgeCount() {
    const items = getStoredWishlist();
    const count = items.length;
    const countBadges = document.querySelectorAll('.wishlist-count, #headerWishlistCount');
    countBadges.forEach(badge => {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

function isItemInWishlist(id) {
    if (!id) return false;
    const wishlist = getStoredWishlist();
    return wishlist.some(item => String(item.id || item._id) === String(id));
}

function toggleWishlistFromCard(id, name, price, image, btnElement) {
    const isSaved = isItemInWishlist(id);
    let wishlist = getStoredWishlist();

    if (isSaved) {
        wishlist = wishlist.filter(item => String(item.id || item._id) !== String(id));
        saveStoredWishlist(wishlist);
        if (btnElement) {
            btnElement.classList.remove('active');
            const svg = btnElement.querySelector('svg');
            if (svg) {
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'currentColor');
            }
        }
        if (typeof showToast === 'function') {
            showToast(`Removed "${name}" from your Wishlist.`);
        }
    } else {
        wishlist.push({
            id: String(id),
            _id: String(id),
            name: name || 'Arshith Fresh Product',
            price: Number(price) || 0,
            image: image || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/4_6d56df69-1c9f-4f05-b1a7-ca631fc7b9aa.png',
            weight: 'Standard'
        });
        saveStoredWishlist(wishlist);
        if (btnElement) {
            btnElement.classList.add('active');
            const svg = btnElement.querySelector('svg');
            if (svg) {
                svg.setAttribute('fill', '#ef4444');
                svg.setAttribute('stroke', '#ef4444');
            }
        }
        if (typeof showToast === 'function') {
            showToast(`❤️ Added "${name}" to your Wishlist!`, 'success');
        }
    }

    // Sync all matching heart buttons on the page
    document.querySelectorAll('.product-card-wishlist-btn').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick') || '';
        if (onclickAttr.includes(`'${id}'`)) {
            const activeNow = isItemInWishlist(id);
            if (activeNow) {
                btn.classList.add('active');
                const svg = btn.querySelector('svg');
                if (svg) { svg.setAttribute('fill', '#ef4444'); svg.setAttribute('stroke', '#ef4444'); }
            } else {
                btn.classList.remove('active');
                const svg = btn.querySelector('svg');
                if (svg) { svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); }
            }
        }
    });

    renderWishlistDrawerContent();
}

function toggleWishlist(product) {
    if (!product || (!product.id && !product._id && !product.name)) return;
    const prodId = String(product.id || product._id || product.name).trim();
    let wishlist = getStoredWishlist();
    const existingIndex = wishlist.findIndex(item => String(item.id || item._id || item.name).trim() === prodId);

    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        saveStoredWishlist(wishlist);
        if (typeof showToast === 'function') {
            showToast(`Removed "${product.name || product.title || 'Product'}" from your Wishlist.`);
        }
    } else {
        wishlist.push({
            id: prodId,
            _id: prodId,
            name: product.name || product.title || 'Arshith Fresh Product',
            price: Number(product.price) || 0,
            image: product.image || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/4_6d56df69-1c9f-4f05-b1a7-ca631fc7b9aa.png',
            weight: product.weight || product.unit || 'Standard'
        });
        saveStoredWishlist(wishlist);
        if (typeof showToast === 'function') {
            showToast(`❤️ Added "${product.name || product.title || 'Product'}" to your Wishlist!`, 'success');
        }
    }
    renderWishlistDrawerContent();
}

function openWishlistModal() {
    let modal = document.getElementById('wishlistModalDrawer');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'wishlistModalDrawer';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.6);backdrop-filter:blur(4px);z-index:999999;display:flex;justify-content:flex-end;animation:fadeIn 0.2s ease-out;';
        modal.innerHTML = `
            <div style="background:#ffffff;width:100%;max-width:420px;height:100%;display:flex;flex-direction:column;box-shadow:-5px 0 25px rgba(0,0,0,0.15);position:relative;">
                <!-- Header -->
                <div style="padding:18px 20px;background:#0f7139;color:#ffffff;display:flex;align-items:center;justify-content:space-between;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" stroke="#ffffff" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        <h3 style="margin:0;font-size:17px;font-weight:700;letter-spacing:-0.2px;">My Wishlist</h3>
                    </div>
                    <button type="button" onclick="closeWishlistModal()" style="background:none;border:none;color:#ffffff;font-size:24px;cursor:pointer;line-height:1;">&times;</button>
                </div>
                <!-- Body -->
                <div id="wishlistDrawerBody" style="flex:1;overflow-y:auto;padding:16px;">
                    <!-- Rendered Items -->
                </div>
                <!-- Footer -->
                <div style="padding:14px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;justify-content:space-between;align-items:center;">
                    <button type="button" onclick="closeWishlistModal()" style="background:none;border:none;color:#64748b;font-size:13px;font-weight:600;cursor:pointer;">Continue Shopping</button>
                    <a href="${window.location.pathname.includes('/pages/') ? 'collections.html?category=all' : 'pages/collections.html?category=all'}" style="background:#0f7139;color:#ffffff;padding:8px 16px;border-radius:6px;font-size:12.5px;font-weight:700;text-decoration:none;">Explore Products &rarr;</a>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.onclick = (e) => {
            if (e.target === modal) closeWishlistModal();
        };
    }

    modal.style.display = 'flex';
    renderWishlistDrawerContent();
}

function closeWishlistModal() {
    const modal = document.getElementById('wishlistModalDrawer');
    if (modal) modal.style.display = 'none';
}

function renderWishlistDrawerContent() {
    const container = document.getElementById('wishlistDrawerBody');
    if (!container) return;

    const items = getStoredWishlist();
    if (items.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:48px 20px;">
                <div style="width:64px;height:64px;border-radius:50%;background:#fef2f2;color:#ef4444;display:flex;align-items:center;justify-content:center;margin:0 auto 16px auto;font-size:28px;">
                    ❤️
                </div>
                <h4 style="margin:0 0 6px 0;font-size:16px;font-weight:700;color:#1e293b;">Your Wishlist is Empty</h4>
                <p style="font-size:13px;color:#64748b;margin:0 0 20px 0;">Save your favorite organic groceries, dry fruits, oils & spices to buy them anytime!</p>
                <a href="${window.location.pathname.includes('/pages/') ? 'collections.html?category=all' : 'pages/collections.html?category=all'}" onclick="closeWishlistModal()" style="display:inline-block;background:#0f7139;color:#ffffff;padding:10px 22px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;box-shadow:0 3px 10px rgba(15,113,57,0.25);">
                    Start Shopping
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => `
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
            <img src="${item.image || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/4_6d56df69-1c9f-4f05-b1a7-ca631fc7b9aa.png'}" alt="${escapeHtml(item.name)}" style="width:55px;height:55px;border-radius:8px;object-fit:cover;border:1px solid #f1f5f9;background:#fafbfc;">
            <div style="flex:1;min-width:0;">
                <h4 style="margin:0 0 3px 0;font-size:13px;font-weight:700;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(item.name)}</h4>
                <div style="font-size:13.5px;font-weight:800;color:#0f7139;margin-bottom:6px;">₹${Number(item.price).toFixed(2)}</div>
                <button type="button" onclick="moveWishlistItemToCart('${item.id || item._id}', '${escapeHtml(item.name).replace(/'/g, "\\'")}', ${item.price}, '${item.image}')" style="background:#0f7139;color:#ffffff;border:none;padding:5px 12px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;">
                    🛒 Move to Cart
                </button>
            </div>
            <button type="button" onclick="removeWishlistItem('${item.id || item._id}')" title="Remove from Wishlist" style="background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;padding:4px;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'">&times;</button>
        </div>
    `).join('');
}

function removeWishlistItem(id) {
    let items = getStoredWishlist();
    items = items.filter(item => String(item.id || item._id) !== String(id));
    saveStoredWishlist(items);
    renderWishlistDrawerContent();
    if (typeof showToast === 'function') showToast('Removed from Wishlist.');
}

function moveWishlistItemToCart(id, name, price, image) {
    if (typeof addToStoreCart === 'function') {
        addToStoreCart(id, name, price, image);
    } else {
        let cart = [];
        try { cart = JSON.parse(localStorage.getItem('arshith_cart')) || []; } catch(e) {}
        cart.push({ id, title: name, price, image, quantity: 1 });
        try { localStorage.setItem('arshith_cart', JSON.stringify(cart)); } catch(e) {}
        if (typeof updateCartCount === 'function') updateCartCount();
        if (typeof showToast === 'function') showToast(`Added "${name}" to your cart!`, 'success');
    }
    removeWishlistItem(id);
}

// ----------------------------------------------------
// HERITAGE FARMLAND & ANIMATED NATURE AMBIANCE
// ----------------------------------------------------
function initFarm3DParallax() {
    // Keep image completely stable and grounded
}

// Global Sort Select Listener Registration
document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById("sortSelect") || document.querySelector(".sort-select-box");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            const sortVal = (e.target.value || "").toLowerCase();
            const isLowToHigh = sortVal.includes("low") || sortVal.includes("asc") || sortVal === "price-low";
            const isHighToLow = sortVal.includes("high") || sortVal.includes("desc") || sortVal === "price-high";
            const isRating = sortVal.includes("rating") || sortVal.includes("rated");
            const isTitleAsc = sortVal.includes("a-z") || sortVal === "title-asc";
            const isTitleDesc = sortVal.includes("z-a") || sortVal === "title-desc";

            const colGrid = document.getElementById("collectionsProductGrid");
            if (colGrid && Array.isArray(window.activeCollectionsProducts) && window.activeCollectionsProducts.length > 0) {
                const arr = [...window.activeCollectionsProducts];
                const getP = (p) => {
                    if (!p) return 0;
                    if (typeof p.salePrice === 'number' && !isNaN(p.salePrice)) return p.salePrice;
                    if (typeof p.price === 'number' && !isNaN(p.price)) return p.price;
                    if (typeof p.regularPrice === 'number' && !isNaN(p.regularPrice)) return p.regularPrice;
                    const str = String(p.salePrice || p.price || p.regularPrice || '');
                    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
                    return isNaN(num) ? 0 : num;
                };

                if (isLowToHigh) arr.sort((a, b) => getP(a) - getP(b));
                else if (isHighToLow) arr.sort((a, b) => getP(b) - getP(a));
                else if (isRating) arr.sort((a, b) => parseFloat(b.rating || b.ratingStars || 5.0) - parseFloat(a.rating || a.ratingStars || 5.0));
                else if (isTitleAsc) arr.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
                else if (isTitleDesc) arr.sort((a, b) => (b.title || b.name || "").localeCompare(a.title || a.name || ""));

                if (typeof createProductCardHTML === 'function') {
                    colGrid.innerHTML = arr.map(p => createProductCardHTML(p)).join('');
                    return;
                }
            }

            // Fallback DOM-based card sorting
            if (colGrid) {
                const cards = Array.from(colGrid.querySelectorAll(".product-card"));
                if (cards.length > 0) {
                    cards.sort((cardA, cardB) => {
                        const getPrice = (card) => {
                            const btn = card.querySelector(".add-to-cart-btn, [onclick*='addToStoreCart']");
                            if (btn) {
                                const onclickAttr = btn.getAttribute("onclick") || "";
                                const match = onclickAttr.match(/addToStoreCart\s*\([^,]+,[^,]+,\s*([0-9.]+)/);
                                if (match) return parseFloat(match[1]);
                            }
                            const saleEl = card.querySelector(".sale-price, .price-box .sale-price");
                            if (saleEl) {
                                const val = parseFloat(saleEl.textContent.replace(/[^0-9.]/g, ''));
                                if (!isNaN(val) && val > 0) return val;
                            }
                            const txt = card.textContent;
                            const matchTxt = txt.match(/Rs\.?\s*([0-9,.]+)/i) || txt.match(/₹\s*([0-9,.]+)/);
                            return matchTxt ? parseFloat(matchTxt[1].replace(/,/g, '')) : 0;
                        };
                        const getRating = (card) => {
                            const rateEl = card.querySelector(".rating-text");
                            if (rateEl) {
                                const match = rateEl.textContent.match(/([0-9.]+)/);
                                if (match) return parseFloat(match[1]);
                            }
                            return 5.0;
                        };
                        const getTitle = (card) => {
                            const h = card.querySelector(".card__heading, .product-title, h3, a");
                            return h ? h.textContent.trim().toLowerCase() : "";
                        };

                        if (isLowToHigh) return getPrice(cardA) - getPrice(cardB);
                        if (isHighToLow) return getPrice(cardB) - getPrice(cardA);
                        if (isRating) return getRating(cardB) - getRating(cardA);
                        if (isTitleAsc) return getTitle(cardA).localeCompare(getTitle(cardB));
                        if (isTitleDesc) return getTitle(cardB).localeCompare(getTitle(cardA));
                        return 0;
                    });
                    cards.forEach(card => colGrid.appendChild(card));
                }
            }
        });
    }
});

/* ==========================================================================
   UNIVERSAL TOP-RIGHT HAMBURGER BUTTON (☰) + FILTER & SORT DRAWER MANAGER
   Consistently injects top-right hamburger & side drawer across all category pages
   ========================================================================== */
(function initFilterAndSortDrawer() {
    function setupDrawer() {
        const colGrid = document.getElementById("collectionsProductGrid");
        if (!colGrid && !document.querySelector(".collections-page-wrapper, .collection-products-pane")) return;

        // 1. Inject Top-Right Hamburger Button if not present
        let topHamburgerBtn = document.getElementById("topHeaderFilterHamburgerBtn");
        if (!topHamburgerBtn) {
            topHamburgerBtn = document.createElement("button");
            topHamburgerBtn.id = "topHeaderFilterHamburgerBtn";
            topHamburgerBtn.className = "header-filter-hamburger-btn";
            topHamburgerBtn.setAttribute("aria-label", "Open Filter & Sort Menu");
            topHamburgerBtn.setAttribute("title", "Filter & Sort Products");
            topHamburgerBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="15" y2="18"></line>
                </svg>
                <span class="hamburger-label">Filter & Sort</span>
                <span class="filter-active-dot" id="filterActiveDot" style="display:none;"></span>
            `;

            // Place directly inside category hero container right beside heading (e.g. Dry Seeds)
            const heroContainer = document.querySelector(".collection-hero-container");
            const headerActions = document.querySelector(".header-actions");
            const topMetaRow = document.querySelector(".collection-top-meta");

            if (heroContainer) {
                heroContainer.appendChild(topHamburgerBtn);
            } else if (headerActions) {
                headerActions.appendChild(topHamburgerBtn);
            } else if (topMetaRow) {
                topMetaRow.appendChild(topHamburgerBtn);
            } else {
                document.body.appendChild(topHamburgerBtn);
            }
        }

        // 2. Inject Drawer Overlay & Panel if not present
        let overlay = document.getElementById("filterDrawerOverlay");
        let panel = document.getElementById("filterDrawerPanel");

        if (!overlay || !panel) {
            const drawerContainer = document.createElement("div");
            drawerContainer.innerHTML = `
                <div class="filter-drawer-overlay" id="filterDrawerOverlay"></div>
                <div class="filter-drawer-panel" id="filterDrawerPanel">
                    <div class="filter-drawer-header">
                        <h3 class="filter-drawer-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f7139" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                            Filter & Sort Products
                        </h3>
                        <button class="filter-drawer-close-btn" id="filterDrawerCloseBtn" aria-label="Close Filter Menu">&times;</button>
                    </div>
                    
                    <div class="filter-drawer-body">
                        <!-- SORT SECTION -->
                        <div class="filter-drawer-section">
                            <h4 class="drawer-section-heading">Sort Products By</h4>
                            <select id="drawerSortSelect" class="drawer-sort-select">
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="title-asc">Name: A to Z</option>
                                <option value="title-desc">Name: Z to A</option>
                            </select>
                        </div>

                        <!-- AVAILABILITY -->
                        <div class="filter-drawer-section">
                            <h4 class="drawer-section-heading">Availability</h4>
                            <label class="drawer-checkbox-lbl"><input type="checkbox" id="drawerInStock" checked> <span>In Stock</span></label>
                            <label class="drawer-checkbox-lbl"><input type="checkbox" id="drawerOutOfStock"> <span>Out of Stock</span></label>
                        </div>

                        <!-- PRICE RANGE -->
                        <div class="filter-drawer-section">
                            <h4 class="drawer-section-heading">Price Range (₹)</h4>
                            <div class="drawer-price-row">
                                <input type="number" id="drawerPriceFrom" placeholder="Min ₹" min="0">
                                <span>to</span>
                                <input type="number" id="drawerPriceTo" placeholder="Max ₹" min="0">
                            </div>
                        </div>

                        <!-- QUANTITY / SIZE -->
                        <div class="filter-drawer-section">
                            <h4 class="drawer-section-heading">Quantity / Size</h4>
                            <div class="drawer-tags-group">
                                <label class="drawer-tag-lbl"><input type="checkbox" value="1l" class="drawer-qty-check"> <span>1L</span></label>
                                <label class="drawer-tag-lbl"><input type="checkbox" value="5l" class="drawer-qty-check"> <span>5L</span></label>
                                <label class="drawer-tag-lbl"><input type="checkbox" value="500ml" class="drawer-qty-check"> <span>500ml</span></label>
                                <label class="drawer-tag-lbl"><input type="checkbox" value="250ml" class="drawer-qty-check"> <span>250ml</span></label>
                                <label class="drawer-tag-lbl"><input type="checkbox" value="1kg" class="drawer-qty-check"> <span>1kg</span></label>
                                <label class="drawer-tag-lbl"><input type="checkbox" value="500g" class="drawer-qty-check"> <span>500g</span></label>
                                <label class="drawer-tag-lbl"><input type="checkbox" value="250g" class="drawer-qty-check"> <span>250g</span></label>
                            </div>
                        </div>

                        <!-- SPECIAL FEATURES -->
                        <div class="filter-drawer-section">
                            <h4 class="drawer-section-heading">Special Attributes</h4>
                            <label class="drawer-checkbox-lbl"><input type="checkbox" id="drawerOrganic"> <span>Organic</span></label>
                            <label class="drawer-checkbox-lbl"><input type="checkbox" id="drawerColdPressed"> <span>Cold Pressed</span></label>
                        </div>
                    </div>

                    <div class="filter-drawer-footer">
                        <button class="drawer-reset-btn" id="drawerResetBtn">Reset All</button>
                        <button class="drawer-apply-btn" id="drawerApplyBtn">Apply Filters</button>
                    </div>
                </div>
            `;
            document.body.appendChild(drawerContainer);

            overlay = document.getElementById("filterDrawerOverlay");
            panel = document.getElementById("filterDrawerPanel");
        }

        // 3. Event Listeners for Open / Close Drawer
        const closeBtn = document.getElementById("filterDrawerCloseBtn");
        const applyBtn = document.getElementById("drawerApplyBtn");
        const resetBtn = document.getElementById("drawerResetBtn");

        function openDrawer() {
            if (overlay) overlay.classList.add("active");
            if (panel) panel.classList.add("active");
            document.body.style.overflow = "hidden";
        }

        function closeDrawer() {
            if (overlay) overlay.classList.remove("active");
            if (panel) panel.classList.remove("active");
            document.body.style.overflow = "";
        }

        if (topHamburgerBtn) topHamburgerBtn.addEventListener("click", openDrawer);
        if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
        if (overlay) overlay.addEventListener("click", closeDrawer);

        // 4. Core Filter & Sort Execution Logic
        function applyDrawerFiltersAndSort() {
            if (!colGrid) return;
            let baseProducts = window.activeCollectionsProducts || [];
            
            const sortVal = (document.getElementById("drawerSortSelect")?.value || "featured").toLowerCase();
            const inStockChecked = document.getElementById("drawerInStock")?.checked ?? true;
            const outOfStockChecked = document.getElementById("drawerOutOfStock")?.checked ?? false;
            const priceFrom = parseFloat(document.getElementById("drawerPriceFrom")?.value) || 0;
            const priceTo = parseFloat(document.getElementById("drawerPriceTo")?.value) || Infinity;
            const organicChecked = document.getElementById("drawerOrganic")?.checked ?? false;
            const coldPressedChecked = document.getElementById("drawerColdPressed")?.checked ?? false;

            const selectedQtys = Array.from(document.querySelectorAll(".drawer-qty-check:checked")).map(cb => cb.value.toLowerCase());

            const isFilterActive = !inStockChecked || outOfStockChecked || priceFrom > 0 || priceTo < Infinity || organicChecked || coldPressedChecked || selectedQtys.length > 0 || sortVal !== "featured";
            
            const activeDot = document.getElementById("filterActiveDot");
            if (activeDot) {
                activeDot.style.display = isFilterActive ? "block" : "none";
            }

            // If we have dynamic JS products array
            if (baseProducts.length > 0) {
                let filtered = baseProducts.filter(p => {
                    // Price filter
                    const pPrice = typeof p.salePrice === 'number' ? p.salePrice : (parseFloat(String(p.salePrice || p.price || 0).replace(/[^0-9.]/g, '')) || 0);
                    if (pPrice < priceFrom || pPrice > priceTo) return false;

                    // Quantity size filter
                    if (selectedQtys.length > 0) {
                        const titleLower = (p.title || p.name || "").toLowerCase();
                        const qtyLower = (p.weight || p.size || "").toLowerCase();
                        const matchesQty = selectedQtys.some(q => titleLower.includes(q) || qtyLower.includes(q));
                        if (!matchesQty) return false;
                    }

                    // Organic / Cold Pressed
                    if (organicChecked) {
                        const txt = (p.title || p.name || "" + p.description || "").toLowerCase();
                        if (!txt.includes("organic")) return false;
                    }
                    if (coldPressedChecked) {
                        const txt = (p.title || p.name || "" + p.description || "").toLowerCase();
                        if (!txt.includes("cold pressed") && !txt.includes("cold-pressed")) return false;
                    }

                    return true;
                });

                // Sort filtered products
                if (typeof sortProductsList === 'function') {
                    filtered = sortProductsList(filtered, sortVal);
                }

                if (typeof createProductCardHTML === 'function') {
                    colGrid.innerHTML = filtered.length > 0 ? filtered.map(p => createProductCardHTML(p)).join('') : `
                        <div class="empty-collection-state" style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 16px; margin: 20px 0;">
                            <h3 style="font-family:'Playfair Display', serif; font-size:20px; color:#0f7139; margin:0 0 8px 0;">No matching products</h3>
                            <p style="color:#64748b; font-size:14px; margin:0;">Try adjusting your selected filters or price range.</p>
                        </div>
                    `;
                }

                const countElem = document.getElementById("collectionProductCount");
                if (countElem) {
                    countElem.textContent = `${filtered.length} products`;
                }
            } else {
                // Fallback for static DOM cards
                const cards = Array.from(colGrid.querySelectorAll(".product-card"));
                cards.forEach(card => {
                    let show = true;
                    if (organicChecked && !card.textContent.toLowerCase().includes("organic")) show = false;
                    if (coldPressedChecked && !card.textContent.toLowerCase().includes("cold")) show = false;
                    card.style.display = show ? "" : "none";
                });
            }

            // Sync legacy sort select if present
            const legacySortSelect = document.getElementById("sortSelect");
            if (legacySortSelect && legacySortSelect.value !== sortVal) {
                legacySortSelect.value = sortVal;
            }
        }

        if (applyBtn) {
            applyBtn.addEventListener("click", () => {
                applyDrawerFiltersAndSort();
                closeDrawer();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                const sortSel = document.getElementById("drawerSortSelect");
                if (sortSel) sortSel.value = "featured";
                const inStock = document.getElementById("drawerInStock");
                if (inStock) inStock.checked = true;
                const outStock = document.getElementById("drawerOutOfStock");
                if (outStock) outStock.checked = false;
                const pFrom = document.getElementById("drawerPriceFrom");
                if (pFrom) pFrom.value = "";
                const pTo = document.getElementById("drawerPriceTo");
                if (pTo) pTo.value = "";
                const org = document.getElementById("drawerOrganic");
                if (org) org.checked = false;
                const cold = document.getElementById("drawerColdPressed");
                if (cold) cold.checked = false;

                document.querySelectorAll(".drawer-qty-check").forEach(cb => cb.checked = false);

                applyDrawerFiltersAndSort();
                if (typeof showToast === 'function') showToast("Filters reset to default");
            });
        }

        // Live sort change inside drawer
        const drawerSortSelect = document.getElementById("drawerSortSelect");
        if (drawerSortSelect) {
            drawerSortSelect.addEventListener("change", applyDrawerFiltersAndSort);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupDrawer);
    } else {
        setupDrawer();
    }
})();

/* ====================================================
   INTERACTIVE BLOG ARTICLE READER SYSTEM
   ==================================================== */
const BLOG_ARTICLES = {
    'dry-fish': {
        title: "Dry Fish Specials: Traditional Coastal Delicacies",
        category: "Specialties",
        date: "August 15, 2024 • 4 min read",
        author: "By Arshith Fresh Culinary Team",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        content: `
            <p>Sun-drying fish is one of coastal India's oldest and most revered traditional food preservation techniques. Rooted deeply in culinary traditions across Andhra Pradesh, Tamil Nadu, Kerala, and Bengal, dry fish delicacies hold a special place in traditional Indian kitchens.</p>
            <h3>The Art of Natural Curing</h3>
            <p>At Arshith Fresh, our dry fish selection is sourced directly from clean, artisanal coastal fisheries. Fresh catches are cleaned using pure sea water, lightly salted with natural rock salt, and sun-dried under hygienic solar dryers. No artificial preservatives, chemical bleaches, or synthetic coloring agents are ever added.</p>
            <h3>Nutritional Value & Rich Protein</h3>
            <p>Sun-dried fish is highly concentrated in essential nutrients. Gram for gram, high-quality dry fish contains up to three times the protein density of fresh fish, along with rich reserves of Omega-3 fatty acids, calcium, phosphorus, and vitamin D.</p>
            <div class="blog-takeaway-box">
                💡 <strong>Chef's Cooking Tip:</strong> Soak dry fish in warm turmeric water for 15 minutes before cooking. Sauté with shallots, red chili powder, garlic, and fresh curry leaves for an authentic, delicious coastal gravy!
            </div>
        `
    },
    'spices-health': {
        title: "Spices & Health: Pure Turmeric, Black Pepper & Cumin",
        category: "Wellness",
        date: "August 10, 2024 • 5 min read",
        author: "By Arshith Fresh Health & Wellness Team",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
        content: `
            <p>For thousands of years, Indian spices have served dual roles as culinary enhancers and powerful Ayurvedic remedies. Understanding the synergistic wellness benefits of pure, unadulterated spices can transform daily cooking into a holistic health ritual.</p>
            <h3>Turmeric & Curcumin Synergy</h3>
            <p>Raw, high-curcumin turmeric is celebrated for its potent anti-inflammatory and antioxidant properties. When combined with black pepper, the compound <em>piperine</em> enhances curcumin absorption by up to 2,000%, ensuring maximum bio-availability for joint health and immune strength.</p>
            <h3>Cumin (Jeera) for Digestion & Metabolism</h3>
            <p>Cumin seeds contain active essential oils that stimulate salivary glands and digestive enzymes, aiding nutrient assimilation and relieving acidity. Drinking warm cumin water every morning is a time-tested habit for gut vitality.</p>
            <div class="blog-takeaway-box">
                🌿 <strong>Arshith Fresh Promise:</strong> Our spices are cold-milled to retain natural volatile oils, ensuring 100% purity without fillers, starch, or artificial dyes.
            </div>
        `
    },
    'cold-pressed-oils': {
        title: "Cooking Essentials: Why Cold-Pressed Oils Matter",
        category: "Kitchen Essentials",
        date: "August 05, 2024 • 3 min read",
        author: "By Arshith Fresh Nutrition Team",
        image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80",
        content: `
            <p>The oil you use in daily cooking forms the foundation of your family's metabolic health. Traditional wood-pressed (Chekku/Ghani) oils offer vastly superior nutrition compared to industrially processed refined oils.</p>
            <h3>Cold-Pressed vs Refined Extraction</h3>
            <p>Refined oils undergo high-heat processing (up to 230°C), solvent extraction with hexane, and chemical bleaching. This strips away natural antioxidants, vitamins, and aroma. In contrast, wood-pressing extracts oil at ambient room temperatures without chemicals, locking in essential fatty acids, vitamin E, and phytosterols.</p>
            <h3>Benefits of Wood-Pressed Oils</h3>
            <p>• <strong>Groundnut Oil:</strong> High smoke point, rich in monounsaturated fats (MUFA) for heart health.<br>
            • <strong>Sesame (Gingelly) Oil:</strong> Packed with sesamol and sesamolin antioxidants.<br>
            • <strong>Coconut Oil:</strong> Rich in Lauric Acid for natural immunity and gut flora.</p>
            <div class="blog-takeaway-box">
                ✨ <strong>Pure Experience:</strong> Cold-pressed oil enhances food with authentic nutty aroma and rich texture, requiring significantly less quantity for cooking.
            </div>
        `
    },
    'spice-powders': {
        title: "Spice Powders & Podulu: Authentic Homemade Flavors",
        category: "Tradition",
        date: "July 28, 2024 • 4 min read",
        author: "By Arshith Fresh Heritage Kitchen",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
        content: `
            <p>South Indian spice powders, locally known as <em>Podulu</em>, are a culinary treasure. Handcrafted with roasted lentils, dried red chilies, garlic, and aromatic spices, Podulu turn any meal into an unforgettable feast.</p>
            <h3>The Craft of Roasting & Grinding</h3>
            <p>Achieving the perfect Podi requires patience. Whole spices and lentils are slow-roasted in iron pans to unleash essential oils, then coarse-ground to preserve crunchy texture and deep aroma. Varieties like Kandi Podi (Lentil Powder), Karivepaku Podi (Curry Leaf Powder), and Nalla Karam are staple favorites.</p>
            <h3>Serving Suggestions</h3>
            <p>Mix 1-2 spoons of Podi with hot steamed rice and a generous dollop of pure Arshith Fresh Cow Ghee, or sprinkle over hot Crispy Dosa, Idli, and Uttapam.</p>
            <div class="blog-takeaway-box">
                🌶️ <strong>100% Homemade Taste:</strong> Made in small batches using traditional recipes without artificial colors or preservatives.
            </div>
        `
    }
};

function openBlogArticle(id) {
    const article = BLOG_ARTICLES[id];
    if (!article) return;

    let backdrop = document.getElementById('blogArticleModal');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'blogArticleModal';
        backdrop.className = 'blog-modal-backdrop';
        backdrop.onclick = function(e) {
            if (e.target === backdrop) closeBlogModal();
        };
        document.body.appendChild(backdrop);
    }

    backdrop.innerHTML = `
        <div class="blog-modal-content">
            <button class="blog-modal-close-btn" onclick="closeBlogModal()" aria-label="Close modal">&times;</button>
            <img src="${article.image}" alt="${article.title}" class="blog-modal-hero-img">
            <div class="blog-modal-body">
                <div class="blog-modal-meta">
                    <span class="blog-modal-tag">${article.category}</span>
                    <span class="blog-modal-date">${article.date}</span>
                </div>
                <h2 class="blog-modal-title">${article.title}</h2>
                <div class="blog-modal-author">${article.author}</div>
                <div class="blog-modal-text">${article.content}</div>
            </div>
        </div>
    `;

    document.body.style.overflow = 'hidden';
    setTimeout(() => backdrop.classList.add('active'), 10);
}

function closeBlogModal() {
    const backdrop = document.getElementById('blogArticleModal');
    if (backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeBlogModal();
});

window.openBlogArticle = openBlogArticle;
window.closeBlogModal = closeBlogModal;

// Universal Slider Arrows & Drag-to-Scroll Support
(function initSliderControls() {
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.slider-arrow, .category-arrow');
        if (!btn) return;
        
        const wrapper = btn.closest('.category-slider-wrapper, .product-slider-wrapper, .products-carousel-container, .categories-section, .collections-top-nav-bar');
        if (!wrapper) return;
        
        const grid = wrapper.querySelector('.categories-grid, .products-grid, .categories-slider, .category-circle-row');
        if (!grid) return;
        
        const scrollAmount = grid.clientWidth * 0.75;
        if (btn.classList.contains('prev')) {
            grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    });

    function enableDragScroll() {
        const sliders = document.querySelectorAll('.categories-grid, .products-grid, .category-circle-row');
        sliders.forEach(slider => {
            if (slider.dataset.dragEnabled) return;
            slider.dataset.dragEnabled = 'true';
            
            let isDown = false;
            let startX;
            let scrollLeft;

            slider.addEventListener('mousedown', (e) => {
                if (e.target.closest('a, button, input')) return;
                isDown = true;
                slider.classList.add('active-dragging');
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });

            slider.addEventListener('mouseleave', () => {
                isDown = false;
                slider.classList.remove('active-dragging');
            });

            slider.addEventListener('mouseup', () => {
                isDown = false;
                slider.classList.remove('active-dragging');
            });

            slider.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 1.5;
                slider.scrollLeft = scrollLeft - walk;
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enableDragScroll);
    } else {
        enableDragScroll();
    }
    
    // Periodically re-check sliders for dynamically injected content
    setInterval(enableDragScroll, 1000);
})();









