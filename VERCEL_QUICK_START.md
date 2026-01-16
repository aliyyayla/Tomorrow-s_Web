# Quick Vercel Deployment Guide

## ✅ What I've Prepared

1. ✅ Updated all API URLs to use environment variables
2. ✅ Created `vercel.json` configuration file
3. ✅ Fixed hardcoded localhost URLs in:
   - `src/services/api.js`
   - `src/App.js`
   - `src/pages/PostEditor.js`

## 🚀 Quick Deployment Steps

### Step 1: Deploy Backend (Choose One)

**Option A: Render (Easiest)**
1. Go to https://render.com → Sign up
2. New + → Web Service
3. Connect GitHub → Select `thelens-backend` folder
4. Settings:
   - Build: (leave empty)
   - Start: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = any random string
6. Deploy → Copy your URL (e.g., `https://thelens-backend.onrender.com`)

**Option B: Railway**
1. Go to https://railway.app → Sign up
2. New Project → Deploy from GitHub
3. Select `thelens-backend` folder
4. Add same environment variables
5. Deploy → Copy URL

### Step 2: Deploy Frontend to Vercel

1. **Push to GitHub** (if needed):
   ```bash
   git add .
   git commit -m "Ready for Vercel"
   git push
   ```

2. **Go to Vercel:**
   - Visit https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repo
   - **Important:** Select the `thelens` folder (not thelens-backend)

3. **Configure:**
   - Framework: Create React App (auto-detected)
   - Root Directory: `thelens`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `build` (auto-filled)

4. **Add Environment Variable:**
   - Click "Environment Variables"
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.onrender.com/api`
   - ✅ Check Production, Preview, Development

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live! 🎉

### Step 3: Test

Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Articles display
- ✅ Search works
- ✅ Contact form works
- ✅ Admin login works (if backend is deployed)

## 🔧 Troubleshooting

**"API calls failing"**
→ Check `REACT_APP_API_URL` in Vercel settings matches your backend URL + `/api`

**"CORS error"**
→ Your backend CORS is already set to allow all origins, should work fine

**"Build failed"**
→ Check Vercel build logs for specific errors

## 📝 Notes

- Your backend CORS is configured to allow all origins (line 10 in server.js)
- All environment variables are set up correctly
- The frontend will automatically use the correct API URL based on environment

## 🎯 Next Steps After Deployment

1. Update your backend CORS to only allow your Vercel domain (optional, for security)
2. Set up a custom domain in Vercel (optional)
3. Configure MongoDB Atlas if using cloud database

---

**Need help?** Check `DEPLOYMENT.md` for detailed instructions.
