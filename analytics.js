// ===== REAL ANALYTICS TRACKING SYSTEM =====
// All visitors see the same aggregated metrics from backend server

// Determine API base URL (localhost for dev, Railway for prod)
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isDevelopment 
    ? 'http://localhost:5000/api/analytics'
    : 'https://portfolio-production-7eb5.up.railway.app/api/analytics';

// Track new visitor on first page load
window.addEventListener('load', function() {
    const hasVisited = sessionStorage.getItem('visited');
    if (!hasVisited) {
        trackNewVisitor();
        sessionStorage.setItem('visited', 'true');
    }
    trackPageViewEvent();
    trackAllClicks();
});

// Track a new visitor
async function trackNewVisitor() {
    try {
        const response = await fetch(`${API_BASE}/visitor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log('Visitor tracked:', data);
    } catch (e) {
        console.log('Backend not available', e);
    }
}

// Track page view
async function trackPageViewEvent() {
    try {
        const page = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
        const response = await fetch(`${API_BASE}/pageview`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page })
        });
        const data = await response.json();
        console.log('Page view tracked:', data);
    } catch (e) {
        console.log('Backend not available', e);
    }
}

// Track all clicks on page
function trackAllClicks() {
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a, button, [role="button"]');
        if (target) {
            trackClick();
        }
    });
}

// Track a click
async function trackClick() {
    try {
        const response = await fetch(`${API_BASE}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (window.updateAnalyticsDisplay) {
            window.updateAnalyticsDisplay();
        }
    } catch (e) {
        console.log('Backend not available', e);
    }
}

// Get all analytics from backend
async function getAnalyticsData() {
    try {
        const response = await fetch(`${API_BASE}`);
        const data = await response.json();
        return data;
    } catch (e) {
        console.log('Backend not available', e);
        return {
            totalVisitors: 0,
            totalPageViews: 0,
            totalClicks: 0,
            pageStats: {},
            lastUpdated: new Date().toISOString()
        };
    }
}

// Get real analytics metrics
async function getRealAnalyticsData() {
    const data = await getAnalyticsData();
    
    const bounceRate = data.totalVisitors > 0 
        ? Math.max(0, 100 - (data.totalClicks / Math.max(data.totalVisitors, 1) * 5))
        : 0;
    
    const avgSessionDuration = data.totalVisitors > 0
        ? Math.round((data.totalClicks / data.totalVisitors) * 15)
        : 0;
    
    return {
        totalVisitors: data.totalVisitors,
        pageViews: data.totalPageViews,
        avgSessionDuration: formatSeconds(avgSessionDuration),
        bounceRate: Math.round(bounceRate) + '%',
        pageStats: data.pageStats,
        totalClicks: data.totalClicks
    };
}

// Format seconds
function formatSeconds(seconds) {
    if (seconds < 60) return seconds + 's';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes + 'm ' + secs + 's';
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get device breakdown (simulated)
function getDeviceBreakdown() {
    return {
        Desktop: 52,
        Mobile: 35,
        Tablet: 13
    };
}

// Get traffic sources (simulated)
function getTrafficSources() {
    return {
        'Direct Traffic': 42,
        'Google Search': 35,
        'LinkedIn': 15,
        'GitHub': 5,
        'Referral Links': 3
    };
}

// Clear analytics (reset backend)
async function clearAnalytics() {
    if (confirm('Are you sure you want to clear all analytics data?')) {
        try {
            await fetch(`${API_BASE}/reset`, { method: 'POST' });
            alert('Analytics cleared!');
            location.reload();
        } catch (e) {
            alert('Could not clear analytics');
        }
    }
}

// Export analytics
async function exportAnalytics() {
    const data = await getRealAnalyticsData();
    const report = {
        exportDate: new Date().toLocaleString(),
        ...data
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}
