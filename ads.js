const ADS_CONFIG = {
    endpoint: 'https://script.google.com/macros/s/AKfycbzCN38he4GItqvJIGxKrRg9odkofBcaK8qDBKvEv7GIBYI_YlyZ2rnhiz8fnQ1y8_ZptQ/exec'
};

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
    return null;
}

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

// For integration in player: Call this on ad end
// Example:
// adContainer.addEventListener('ended', async () => {
//     await updateAdView(currentAdUrl);
//     // Then end ad
// });
