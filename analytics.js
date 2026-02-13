// ===== ANALYTICS TRACKING SYSTEM =====

// Initialize tracking on page load
window.addEventListener('load', function() {
    initializeTracking();
});

// Initialize tracking system
function initializeTracking() {
    // Get or create session ID
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('sessionId', sessionId);
    }
    
    // Track page view
    trackPageView(window.location.pathname);
    
    // Track session duration
    trackSessionDuration();
}

// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Track page view with real data
function trackPageView(pagePath) {
    const analytics = getAnalyticsData();
    
    // Get or create current session
    let sessions = analytics.sessions || [];
    let currentSession = sessions.find(s => s.sessionId === sessionStorage.getItem('sessionId'));
    
    if (!currentSession) {
        currentSession = {
            sessionId: sessionStorage.getItem('sessionId'),
            startTime: Date.now(),
            pages: [],
            device: getDeviceType(),
            referrer: document.referrer || 'direct',
            bounced: false
        };
        sessions.push(currentSession);
    }
    
    // Track page view
    currentSession.pages.push({
        path: pagePath,
        viewTime: Date.now(),
        timeOnPage: 0
    });
    
    // Update page statistics
    const pageStats = analytics.pageStats || {};
    const pageName = getPageName(pagePath);
    
    if (!pageStats[pageName]) {
        pageStats[pageName] = {
            path: pagePath,
            views: 0,
            totalTime: 0
        };
    }
    
    pageStats[pageName].views += 1;
    
    // Calculate total visitors (unique sessions)
    const uniqueVisitors = new Set(sessions.map(s => s.sessionId)).size;
    const totalPageViews = sessions.reduce((sum, s) => sum + s.pages.length, 0);
    
    analytics.totalVisitors = uniqueVisitors;
    analytics.pageViews = totalPageViews;
    analytics.pageStats = pageStats;
    analytics.sessions = sessions;
    analytics.lastUpdated = new Date().toISOString();
    
    localStorage.setItem('analytics', JSON.stringify(analytics));
}

// Track session duration and bounce rate
function trackSessionDuration() {
    const analytics = getAnalyticsData();
    const sessionId = sessionStorage.getItem('sessionId');
    const sessions = analytics.sessions || [];
    const currentSession = sessions.find(s => s.sessionId === sessionId);
    
    if (!currentSession) return;
    
    // Track time before leaving page
    window.addEventListener('beforeunload', function() {
        const sessionsData = getAnalyticsData().sessions;
        const session = sessionsData.find(s => s.sessionId === sessionId);
        
        if (session && session.pages.length > 0) {
            const lastPage = session.pages[session.pages.length - 1];
            lastPage.timeOnPage = Math.round((Date.now() - lastPage.viewTime) / 1000);
        }
        
        // Determine if bounced (only one page view)
        if (session.pages.length === 1) {
            session.bounced = true;
        }
        
        localStorage.setItem('analytics', JSON.stringify(getAnalyticsData()));
    });
}

// Get device type
function getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'Mobile';
    if (width <= 1024) return 'Tablet';
    return 'Desktop';
}

// Get page name from path
function getPageName(path) {
    const pageName = path.split('/').pop() || 'home';
    return pageName.replace('.html', '').charAt(0).toUpperCase() + pageName.replace('.html', '').slice(1);
}

// Get analytics data from localStorage
function getAnalyticsData() {
    const data = localStorage.getItem('analytics');
    return data ? JSON.parse(data) : {
        totalVisitors: 0,
        pageViews: 0,
        pageStats: {},
        sessions: [],
        lastUpdated: new Date().toISOString()
    };
}

// Calculate average session duration
function getAverageSessionDuration() {
    const analytics = getAnalyticsData();
    const sessions = analytics.sessions || [];
    
    if (sessions.length === 0) return '0s';
    
    let totalTime = 0;
    sessions.forEach(session => {
        session.pages.forEach((page, index) => {
            if (page.timeOnPage) {
                totalTime += page.timeOnPage;
            }
        });
    });
    
    const avgSeconds = Math.round(totalTime / sessions.length);
    return formatSeconds(avgSeconds);
}

// Calculate bounce rate
function getBounceRate() {
    const analytics = getAnalyticsData();
    const sessions = analytics.sessions || [];
    
    if (sessions.length === 0) return '0%';
    
    const bouncedSessions = sessions.filter(s => s.bounced).length;
    return Math.round((bouncedSessions / sessions.length) * 100) + '%';
}

// Format seconds to readable time
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

// Get real traffic data for display
function getRealAnalyticsData() {
    const analytics = getAnalyticsData();
    
    return {
        totalVisitors: analytics.totalVisitors,
        pageViews: analytics.pageViews,
        avgSessionDuration: getAverageSessionDuration(),
        bounceRate: getBounceRate(),
        pageStats: analytics.pageStats,
        sessions: analytics.sessions
    };
}

// Get device breakdown
function getDeviceBreakdown() {
    const analytics = getAnalyticsData();
    const sessions = analytics.sessions || [];
    
    const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
    sessions.forEach(session => {
        devices[session.device]++;
    });
    
    return devices;
}

// Get traffic sources breakdown
function getTrafficSources() {
    const analytics = getAnalyticsData();
    const sessions = analytics.sessions || [];
    
    const sources = {};
    sessions.forEach(session => {
        const referrer = session.referrer;
        if (referrer.includes('google')) {
            sources['Google Search'] = (sources['Google Search'] || 0) + 1;
        } else if (referrer.includes('linkedin')) {
            sources['LinkedIn'] = (sources['LinkedIn'] || 0) + 1;
        } else if (referrer.includes('github')) {
            sources['GitHub'] = (sources['GitHub'] || 0) + 1;
        } else if (referrer === 'direct') {
            sources['Direct Traffic'] = (sources['Direct Traffic'] || 0) + 1;
        } else {
            sources['Referral Links'] = (sources['Referral Links'] || 0) + 1;
        }
    });
    
    return sources;
}

// Clear analytics data
function clearAnalytics() {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
        localStorage.removeItem('analytics');
        sessionStorage.removeItem('sessionId');
        alert('Analytics data cleared successfully!');
        location.reload();
    }
}

// Export analytics report
function exportAnalytics() {
    const data = getRealAnalyticsData();
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
    
    alert('Analytics report exported successfully!');
}
