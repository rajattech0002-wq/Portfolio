# Railway Deployment Guide

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (recommended - auto-connects your repos)
3. Verify email if needed

## Step 2: Create New Project
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your `Portfolio` repository
3. Railway auto-detects Python/Flask ✓

## Step 3: Configure Environment (Flask needs this)
1. Go to your project → Variables tab
2. Add this environment variable:
   ```
   PORT = 5000
   ```
3. Railway will auto-detect Flask and start the server

## Step 4: Deploy
1. Click "Deploy" button
2. Wait ~30-60 seconds for build
3. You'll see a live URL like: `https://portfolio-prod-abc123.railway.app`

## Step 5: Test Your Backend
- Visit: `https://YOUR-RAILWAY-URL/api/analytics`
- Should return JSON with analytics data
- Example response:
  ```json
  {
    "totalVisitors": 0,
    "totalPageViews": 0,
    "totalClicks": 0,
    "pageStats": {},
    "lastUpdated": "2026-02-14T..."
  }
  ```

## Step 6: Update Frontend with Production URL
1. Open `analytics.js` in your editor
2. Find the API_BASE line (around line 6-7)
3. Replace this section:
   ```javascript
   const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
   const API_BASE = isDevelopment 
       ? 'http://localhost:5000/api/analytics'
       : 'https://rajat-portfolio.pythonanywhere.com/api/analytics';
   ```
   
   With your Railway URL:
   ```javascript
   const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
   const API_BASE = isDevelopment 
       ? 'http://localhost:5000/api/analytics'
       : 'https://YOUR-RAILWAY-URL/api/analytics';
   ```

4. Save and commit:
   ```bash
   git add analytics.js
   git commit -m "Update backend URL to Railway"
   git push origin main
   ```

## Step 7: Configure GitHub Pages (Frontend)
1. Go to your GitHub repository settings
2. Scroll to "Pages" section
3. Source: "Deploy from a branch"
4. Branch: `main` | Folder: `/ (root)`
5. Click Save
6. Wait ~2 minutes for deployment
7. Your frontend will be at: `https://YOUR_USERNAME.github.io/Portfolio`

## Step 8: Test Everything
1. Visit your GitHub Pages URL: `https://YOUR_USERNAME.github.io/Portfolio`
2. Click through pages, check Analytics tab
3. Reload page, metrics should increment
4. Test from different browser/device - everyone sees same count ✓

**That's it!** Auto-deploys on every git push 🚀

---

## Your Final URLs:
- **Frontend (GitHub Pages):** `https://YOUR_USERNAME.github.io/Portfolio`
- **Backend (Railway):** `https://YOUR-RAILWAY-URL`

## Automatic Updates
Every time you push to GitHub:
1. Railway auto-rebuilds and deploys backend
2. GitHub Pages auto-rebuilds and deploys frontend
3. Changes live in ~1 minute total

## Troubleshooting

**Backend returning 404?**
- Check that `/api/analytics` endpoint exists in backend.py
- Manual test: `https://YOUR-RAILWAY-URL/api/analytics`

**Analytics not updating?**
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Verify analytics.js has correct Railway URL

**Still showing localhost?**
- Make sure analytics.js is updated with Railway URL
- Commit and push changes
- Wait for GitHub Pages to redeploy (~2 min)
- Force refresh browser (Ctrl+F5)

**Railway build failed?**
- Check Railway logs: Project → Deployments → View logs
- Ensure `requirements.txt` exists and has correct format
- Common issue: Flask not in requirements.txt (should have `flask==2.3.3`)

**Need Railway URL?**
- Go to your Railway project
- Click "Deployments" tab
- Most recent successful deployment shows the URL
- Format: `https://[project-name]-[random].railway.app`
