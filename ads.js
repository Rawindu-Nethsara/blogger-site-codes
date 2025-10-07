const ADS_CONFIG = {
    endpoint: 'https://script.google.com/macros/s/AKfycbx5IbylpxIbQAHmKxdoxG1CSz7cjIR4g1hmGTS6sxp57tuBT3w_UD8mx90jKo7Ui5T8yA/exec'
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
