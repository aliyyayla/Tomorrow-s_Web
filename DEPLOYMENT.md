# Deployment Guide for The Lens

## Deploying to Vercel

### Prerequisites
1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)
3. Your backend server deployed (see Backend Deployment section)

### Step 1: Deploy Backend First

**Important:** You need to deploy your backend server before deploying the frontend.

#### Option A: Deploy Backend to Render (Recommended)
1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `thelens-backend` folder
5. Configure:
   - **Name:** thelens-backend
   - **Environment:** Node
   - **Build Command:** (leave empty or `npm install`)
   - **Start Command:** `npm start`
6. Add Environment Variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secret key for JWT tokens
   - `PORT` - (optional, defaults to 5000)
7. Click "Create Web Service"
8. Copy your backend URL (e.g., `https://thelens-backend.onrender.com`)

#### Option B: Deploy Backend to Railway
1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository and the `thelens-backend` folder
4. Add environment variables (same as above)
5. Copy your backend URL

### Step 2: Deploy Frontend to Vercel

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard:**
   - Visit https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the `thelens` folder (not thelens-backend)

3. **Configure Project:**
   - **Framework Preset:** Create React App (auto-detected)
   - **Root Directory:** `thelens` (or leave as root if deploying from thelens folder)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add: `REACT_APP_API_URL`
   - Value: Your backend URL + `/api` (e.g., `https://thelens-backend.onrender.com/api`)
   - Make sure to add it for **Production**, **Preview**, and **Development**

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Step 3: Update CORS in Backend

Make sure your backend allows requests from your Vercel domain:

In `thelens-backend/server.js`, update CORS:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-project.vercel.app'
  ],
  credentials: true
}));
```

### Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Test all features:
   - View articles
   - Search functionality
   - Contact form
   - Admin login (if backend is working)

### Troubleshooting

**Issue: API calls failing**
- Check that `REACT_APP_API_URL` is set correctly in Vercel
- Verify backend is running and accessible
- Check browser console for CORS errors

**Issue: Images not loading**
- Ensure backend is serving static files correctly
- Check image URLs in the database

**Issue: Build fails**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Local Development

For local development, create a `.env` file in the `thelens` folder:
```
REACT_APP_API_URL=http://localhost:5001/api
```

This file is already in `.gitignore`, so it won't be committed.
