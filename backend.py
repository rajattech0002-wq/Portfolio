#!/usr/bin/env python3
"""
Real-time Analytics Backend Server
All visitors see the same aggregated metrics
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATA_FILE = 'analytics_data.json'

def load_analytics():
    """Load analytics from file or create new"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        except:
            pass
    return initialize_analytics()

def initialize_analytics():
    """Initialize new analytics data"""
    return {
        'totalVisitors': 0,
        'totalPageViews': 0,
        'totalClicks': 0,
        'pageStats': {},
        'lastUpdated': datetime.now().isoformat()
    }

def save_analytics(data):
    """Save analytics to file"""
    data['lastUpdated'] = datetime.now().isoformat()
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    return data

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get current analytics data - all users see the same"""
    data = load_analytics()
    return jsonify(data)

@app.route('/api/analytics/visitor', methods=['POST'])
def track_visitor():
    """Record a new visitor"""
    data = load_analytics()
    data['totalVisitors'] = min(data['totalVisitors'] + 1, 1000)
    save_analytics(data)
    return jsonify({'success': True, 'totalVisitors': data['totalVisitors']})

@app.route('/api/analytics/pageview', methods=['POST'])
def track_pageview():
    """Record a page view"""
    data = load_analytics()
    page = request.json.get('page', 'home')
    
    # Increment total page views
    data['totalPageViews'] = data['totalPageViews'] + 1
    
    # Track per-page stats
    if page not in data['pageStats']:
        data['pageStats'][page] = {'views': 0}
    data['pageStats'][page]['views'] += 1
    
    save_analytics(data)
    return jsonify({'success': True, 'totalPageViews': data['totalPageViews']})

@app.route('/api/analytics/click', methods=['POST'])
def track_click():
    """Record a click/interaction"""
    data = load_analytics()
    data['totalClicks'] = data['totalClicks'] + 1
    save_analytics(data)
    return jsonify({'success': True, 'totalClicks': data['totalClicks']})

@app.route('/api/analytics/reset', methods=['POST'])
def reset_analytics():
    """Reset analytics data"""
    data = initialize_analytics()
    save_analytics(data)
    return jsonify({'success': True, 'message': 'Analytics reset'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
