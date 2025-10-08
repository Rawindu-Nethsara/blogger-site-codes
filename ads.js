// MOOVIED Ads System - Cloudinary Integration
// This script fetches active ads from Google Sheets and tracks views in real-time

const ADS_CONFIG = {
    endpoint: 'https://script.google.com/macros/s/AKfycbwHpgo8feCpO1v2s-FNp5Drj17IFvJ0YeOu1KDKBNWcDEdCTX_78b1o0dkdQ7o2CNJw/exec',
    cacheKey: 'moovied_ads_cache',
    cacheExpiry: 5 * 60 * 1000, // 5 minutes
    retryAttempts: 3,
    retryDelay: 1000
};

// Global variable to store all active ads
window.ADS_URLS = [];

// Fetch all active ads and cache them
async function fetchAllActiveAds() {
    console.log('[Ads] Fetching all active ads from Cloudinary...');
    
    try {
        // Check cache first
        const cached = getCachedAds();
        if (cached && cached.length > 0) {
            console.log(`[Ads] Using cached ads: ${cached.length} ads`);
            window.ADS_URLS = cached;
            return cached;
        }

        // Fetch from server
        const res = await fetch(ADS_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ action: 'get_all_active_ads' })
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        
        if (data.success && data.ads && data.ads.length > 0) {
            console.log(`[Ads] ✓ Fetched ${data.ads.length} active ads from Cloudinary`);
            window.ADS_URLS = data.ads;
            
            // Cache the ads
            cacheAds(data.ads);
            
            return data.ads;
        } else {
            console.warn('[Ads] No active ads available');
            return [];
        }
    } catch (err) {
        console.error('[Ads] Fetch failed:', err);
        
        // Try to use cached ads even if expired
        const cached = getCachedAds(true);
        if (cached && cached.length > 0) {
            console.log(`[Ads] Using expired cache as fallback: ${cached.length} ads`);
            window.ADS_URLS = cached;
            return cached;
        }
        
        return [];
    }
}

// Get a random ad from the active ads pool
async function getRandomAd() {
    console.log('[Ad] Selecting random ad...');
    
    try {
        // Ensure we have ads loaded
        if (!window.ADS_URLS || window.ADS_URLS.length === 0) {
            console.log('[Ad] No ads in memory, fetching...');
            await fetchAllActiveAds();
        }

        // If still no ads, try fetching a single random ad
        if (!window.ADS_URLS || window.ADS_URLS.length === 0) {
            console.log('[Ad] Fetching single random ad from server...');
            const res = await fetch(ADS_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ action: 'get_random_ad' })
            });

            const data = await res.json();
            
            if (data.success && data.ad && data.ad.AdFileUrl) {
                console.log(`[Ad] ✓ Random ad: ${data.ad.AdFileUrl.substring(0, 60)}...`);
                return data.ad.AdFileUrl;
            }
        } else {
            // Select random ad from pool
            const randomIndex = Math.floor(Math.random() * window.ADS_URLS.length);
            const selectedAd = window.ADS_URLS[randomIndex];
            console.log(`[Ad] ✓ Selected ad ${randomIndex + 1}/${window.ADS_URLS.length}: ${selectedAd.substring(0, 60)}...`);
            return selectedAd;
        }
    } catch (err) {
        console.error('[Ad] Selection failed:', err);
    }
    
    console.warn('[Ad] No ads available');
    return null;
}

// Update ad view count with retry mechanism
async function updateAdView(adUrl) {
    if (!adUrl) {
        console.warn('[Ad] No ad URL provided for view update');
        return false;
    }

    console.log(`[Ad] Updating view count for: ${adUrl.substring(0, 60)}...`);
    
    for (let attempt = 1; attempt <= ADS_CONFIG.retryAttempts; attempt++) {
        try {
            const res = await fetch(ADS_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ 
                    action: 'increment_view', 
                    adUrl: adUrl 
                })
            });

            const data = await res.json();
            
            if (data.success) {
                console.log(`[Ad] ✓ View count updated successfully ${data.views ? `(Total: ${data.views})` : ''}`);
                return true;
            } else {
                console.warn(`[Ad] View update failed: ${data.message}`);
            }
        } catch (err) {
            console.error(`[Ad] View update error (attempt ${attempt}/${ADS_CONFIG.retryAttempts}):`, err);
            
            if (attempt < ADS_CONFIG.retryAttempts) {
                await new Promise(resolve => setTimeout(resolve, ADS_CONFIG.retryDelay * attempt));
            }
        }
    }
    
    console.error('[Ad] View update failed after all retry attempts');
    return false;
}

// Cache management functions
function cacheAds(ads) {
    try {
        const cacheData = {
            ads: ads,
            timestamp: Date.now()
        };
        localStorage.setItem(ADS_CONFIG.cacheKey, JSON.stringify(cacheData));
        console.log(`[Cache] Saved ${ads.length} ads`);
    } catch (err) {
        console.warn('[Cache] Failed to save:', err);
    }
}

function getCachedAds(ignoreExpiry = false) {
    try {
        const cached = localStorage.getItem(ADS_CONFIG.cacheKey);
        if (!cached) return null;

        const cacheData = JSON.parse(cached);
        const age = Date.now() - cacheData.timestamp;

        if (ignoreExpiry || age < ADS_CONFIG.cacheExpiry) {
            console.log(`[Cache] Found ${cacheData.ads.length} ads (age: ${Math.floor(age / 1000)}s)`);
            return cacheData.ads;
        } else {
            console.log(`[Cache] Expired (age: ${Math.floor(age / 1000)}s)`);
            return null;
        }
    } catch (err) {
        console.warn('[Cache] Failed to read:', err);
        return null;
    }
}

function clearAdCache() {
    try {
        localStorage.removeItem(ADS_CONFIG.cacheKey);
        console.log('[Cache] Cleared');
    } catch (err) {
        console.warn('[Cache] Failed to clear:', err);
    }
}

// Initialize ads on page load
(async function initAds() {
    console.log('[Ads] Initializing MOOVIED Ads System...');
    
    try {
        await fetchAllActiveAds();
        console.log(`[Ads] ✓ Initialization complete. ${window.ADS_URLS.length} ads ready.`);
        
        // Refresh ads cache every 5 minutes
        setInterval(async () => {
            console.log('[Ads] Refreshing ads cache...');
            await fetchAllActiveAds();
        }, ADS_CONFIG.cacheExpiry);
        
    } catch (err) {
        console.error('[Ads] Initialization failed:', err);
    }
})();

// Export functions for use in player
window.getRandomAd = getRandomAd;
window.updateAdView = updateAdView;
window.fetchAllActiveAds = fetchAllActiveAds;
window.clearAdCache = clearAdCache;

console.log('[Ads] MOOVIED Ads System loaded successfully');
