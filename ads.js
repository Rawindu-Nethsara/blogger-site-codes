// Updated ADS_CONFIG (add endpoint)
const ADS_CONFIG = {
    // ... your existing config
    endpoint: 'https://script.google.com/macros/s/AKfycbwP9ayrrYsgQXcB2lPytJCvbC_pZDZ1j0eEjIxXMXm7t6QTkEKyY3-HZS-E1AOzQXt_/exec'
};

// Updated getRandomAd()
async function getRandomAd() {
    try {
        const res = await fetch(ADS_CONFIG.endpoint, {
            method: 'POST',
            body: new URLSearchParams({ action: 'get_random_ad' })
        });
        const data = await res.json();
        if (data.success) {
            console.log(`[Ad] Fetched random: ${data.ad.AdFileUrl}`);
            return data.ad.AdFileUrl;
        }
    } catch (err) {
        console.error('[Ad] Fetch failed:', err);
    }
    return null; // Fallback to old if error
}

// In endAd(), after ad ends, update view
async function updateAdView(adUrl) {
    try {
        await fetch(ADS_CONFIG.endpoint, {
            method: 'POST',
            body: new URLSearchParams({ action: 'increment_view', adUrl })
        });
        console.log('[Ad] View incremented');
    } catch (err) {
        console.error('[Ad] View update failed');
    }
}

// In ad ended handler:
STATE.adContainer.addEventListener('ended', async () => {
    console.log('[Ad] Ended naturally');
    await updateAdView(STATE.currentAdUrl);
    endAd();
}, { once: true });

// For pre/mid-roll calls, await getRandomAd()
