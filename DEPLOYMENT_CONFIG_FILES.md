# Deployment Configuration Files

This document explains the deployment configuration files for Vercel (Frontend) and Railway (Backend).

## 📁 Files Created

### 1. `akions-app/frontend/vercel.json`
Vercel configuration for the Expo frontend application.

### 2. `akions-app/backend/railway.json`
Railway configuration for the Node.js backend API.

### 3. `akions-app/backend/nixpacks.toml`
Alternative Railway build configuration using Nixpacks (more detailed control).

---

## 🚀 Vercel Deployment (Frontend)

### File: `akions-app/frontend/vercel.json`

This file configures Vercel to:
- Build the Expo app for web
- Output to `web-build` directory
- Handle client-side routing with rewrites
- Set security headers

### Deployment Steps:

1. **Connect to Vercel:**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure in Vercel Dashboard:**
   - **Framework Preset:** Other (or Expo)
   - **Root Directory:** `akions-app/frontend`
   - **Build Command:** `npm install && npx expo export:web` (auto-detected from vercel.json)
   - **Output Directory:** `web-build` (auto-detected from vercel.json)
   - **Install Command:** `npm install`

3. **Add Environment Variables:**
   - `EXPO_PUBLIC_API_URL` - Your Railway backend URL
     - Example: `https://yourapp.up.railway.app`

4. **Deploy:**
   - Click "Deploy"
   - Wait for build (3-5 minutes)
   - Get your frontend URL

### Alternative: If Expo Web Build Fails

If `expo export:web` doesn't work, you may need to add a build script to `package.json`:

```json
{
  "scripts": {
    "build": "expo export:web",
    "start": "expo start",
    "web": "expo start --web"
  }
}
```

Then update `vercel.json`:
```json
{
  "buildCommand": "npm run build"
}
```

---

## 🚂 Railway Deployment (Backend)

### Files Created:

#### 1. `akions-app/backend/railway.json`
Railway's native configuration file.

#### 2. `akions-app/backend/nixpacks.toml`
More detailed build configuration using Nixpacks (Railway's build system).

### Deployment Steps:

1. **Connect to Railway:**
   - Go to https://railway.app
   - Sign up/Login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure in Railway Dashboard:**
   - **Root Directory:** `akions-app/backend`
   - **Start Command:** `node server.js` (auto-detected from railway.json)
   - **Build Command:** `npm install` (auto-detected from railway.json)

   OR Railway will auto-detect from `railway.json` or `nixpacks.toml`

3. **Add Environment Variables:**
   - Go to Settings → Variables
   - Add all required variables (see `RAILWAY_ENV_READY.txt`)
   - ⚠️ Make sure `MONGODB_URI` uses `/ekions` database name

4. **Deploy:**
   - Railway automatically deploys on git push
   - Or click "Deploy" button
   - Wait for deployment (2-5 minutes)
   - Get your backend URL

### Configuration Details:

**railway.json:**
- Uses NIXPACKS builder (Railway's default)
- Builds with `npm install`
- Starts with `node server.js`
- Restarts on failure (up to 10 retries)

**nixpacks.toml:**
- Specifies Node.js 18
- Uses npm 9
- Sets production environment
- More granular control over build process

---

## 🔧 Manual Configuration (If Files Don't Work)

### Vercel Manual Setup:

1. **Root Directory:** `akions-app/frontend`
2. **Framework:** Other (or Expo)
3. **Build Command:** `npm install && npx expo export:web`
4. **Output Directory:** `web-build`
5. **Install Command:** `npm install`

### Railway Manual Setup:

1. **Root Directory:** `akions-app/backend`
2. **Start Command:** `node server.js`
3. **Build Command:** `npm install`
4. **Environment:** Node.js (auto-detected)

---

## 📝 Environment Variables

### Frontend (Vercel):
```
EXPO_PUBLIC_API_URL=https://your-railway-app.up.railway.app
```

### Backend (Railway):
See `RAILWAY_ENV_READY.txt` for complete list:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...@cluster.net/ekions?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@ekions.com
```

---

## ✅ Verification

### After Frontend Deploy:
- Visit your Vercel URL
- Check browser console for errors
- Verify API calls are going to Railway backend

### After Backend Deploy:
- Visit `https://your-app.up.railway.app/api/health`
- Should return: `{"status":"OK","message":"Server is running"}`
- Test login/register endpoints

---

## 🐛 Troubleshooting

### Vercel Build Fails:
- Check if Expo web is properly configured
- Verify `package.json` has all dependencies
- Check build logs for specific errors
- May need to add `expo` export scripts

### Railway Build Fails:
- Check Root Directory is set to `akions-app/backend`
- Verify all environment variables are set
- Check build logs for npm install errors
- Ensure `server.js` exists in root directory

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Expo Web Deployment:** https://docs.expo.dev/workflow/publishing/#web

---

**Files Created:**
- ✅ `akions-app/frontend/vercel.json`
- ✅ `akions-app/backend/railway.json`
- ✅ `akions-app/backend/nixpacks.toml`


