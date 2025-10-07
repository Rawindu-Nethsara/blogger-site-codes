// ads.js - Updated Player JS for Server 01 & 02
// Updated ADS_CONFIG (add endpoint)
const ADS_CONFIG = {
    // ... your existing config from original code
    endpoint: 'https://script.google.com/macros/s/AKfycbwv1NFbh-LM_vCPMPFnGS9KJz8E4jK9tzvBJTx1CDHyxNP-3zIHiDi6FU2A1Kk8esmb2Q/exec'
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
    return null; // Fallback if error
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

// In ad ended handler (integrate into your original code):
// STATE.adContainer.addEventListener('ended', async () => {
//     console.log('[Ad] Ended naturally');
//     await updateAdView(STATE.currentAdUrl);
//     endAd();
// }, { once: true });

// For pre/mid-roll calls, await getRandomAd()
