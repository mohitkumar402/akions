# Step-by-Step Deployment Guide

## 🚀 Quick Start: Deploy to Railway (Backend) + Vercel (Frontend)

### Part 1: Deploy Backend to Railway

#### Step 1: Prepare Your Backend
```bash
cd akions-app/backend
```

#### Step 2: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository

#### Step 3: Configure Backend
1. Railway will auto-detect Node.js
2. Go to **Settings** → **Variables**
3. Add these environment variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   NODE_ENV=production
   ```

#### Step 4: Deploy
- Railway automatically deploys on git push
- Or click "Deploy" button
- Wait for deployment (2-5 minutes)
- Copy your backend URL (e.g., `yourapp.up.railway.app`)

#### Step 5: Update CORS in Backend
In `akions-app/backend/server.js`, update CORS:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:8082',
    'https://your-frontend-url.vercel.app', // Add your Vercel URL
    'https://your-custom-domain.com' // Add custom domain if any
  ],
  credentials: true
};
```

### Part 2: Deploy Frontend to Vercel

#### Step 1: Prepare Frontend
1. Update API URL in frontend code
2. In `akions-app/frontend/src`, find all files with `http://localhost:3000`
3. Replace with your Railway backend URL

Create `akions-app/frontend/.env`:
```
EXPO_PUBLIC_API_URL=https://yourapp.up.railway.app
```

#### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository

#### Step 3: Configure Frontend
1. **Framework Preset**: Expo
2. **Root Directory**: `akions-app/frontend`
3. **Build Command**: `npm run build` or leave default
4. **Output Directory**: Leave default
5. **Install Command**: `npm install`

#### Step 4: Add Environment Variables
In Vercel project settings:
```
EXPO_PUBLIC_API_URL=https://yourapp.up.railway.app
```

#### Step 5: Deploy
- Click "Deploy"
- Wait for build (3-5 minutes)
- Get your frontend URL (e.g., `yourapp.vercel.app`)

### Part 3: Update Backend CORS with Frontend URL

1. Go back to Railway
2. Update CORS in backend code with Vercel URL
3. Redeploy backend

## 🔄 Alternative: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Select your repository

### Step 3: Configure
- **Name**: akions-backend
- **Environment**: Node
- **Build Command**: `cd akions-app/backend && npm install`
- **Start Command**: `cd akions-app/backend && node server.js`
- **Plan**: Free (or choose paid)

### Step 4: Environment Variables
Add the same variables as Railway

### Step 5: Deploy
- Click "Create Web Service"
- Render will deploy automatically
- Get your URL (e.g., `yourapp.onrender.com`)

## 📱 Deploy Mobile Apps (iOS/Android)

### Using Expo EAS Build

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Login
```bash
eas login
```

#### Step 3: Configure
```bash
cd akions-app/frontend
eas build:configure
```

#### Step 4: Build for Android
```bash
eas build --platform android
```

#### Step 5: Build for iOS
```bash
eas build --platform ios
```

#### Step 6: Submit to Stores
```bash
# Android
eas submit --platform android

# iOS
eas submit --platform ios
```

## 🔧 Post-Deployment Configuration

### 1. Update Frontend API URLs
Replace all `http://localhost:3000` with your production backend URL:
- Search in `akions-app/frontend/src` for `localhost:3000`
- Replace with your Railway/Render URL

### 2. MongoDB Atlas Setup
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Get connection string
4. Add to backend environment variables
5. Whitelist Railway/Render IP (or use 0.0.0.0/0 for all)

### 3. File Uploads
For production, consider:
- **AWS S3** for file storage
- **Cloudinary** for images
- **Railway/Render** volumes (limited)

Update upload route to use cloud storage.

### 4. Domain Setup (Optional)

#### Custom Domain for Backend (Railway)
1. Go to Railway project → Settings → Domains
2. Add custom domain
3. Update DNS records

#### Custom Domain for Frontend (Vercel)
1. Go to Vercel project → Settings → Domains
2. Add custom domain
3. Update DNS records

## ✅ Final Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] API URLs updated in frontend
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] MongoDB Atlas connected
- [ ] Admin login works
- [ ] All CRUD operations work
- [ ] File uploads work (or configured cloud storage)
- [ ] SSL/HTTPS enabled
- [ ] Custom domains configured (if needed)
- [ ] Error monitoring set up
- [ ] Backups configured

## 🐛 Troubleshooting

### Backend Issues

#### Railway Deployment Failures

**Most Common Issues:**

1. **❌ "secret ID missing for "" environment variable" Error**
   - **Cause:** Empty or invalid environment variable name
   - **Fix:** 
     - Go to Railway → Settings → Variables
     - Delete any variables with empty names or spaces in names
     - Use underscores, not spaces: `MY_VAR` not `MY VAR`
     - Ensure all variables have both name AND value
   - **See:** `RAILWAY_ENV_FIX.md` for detailed fix

2. **Root Directory Not Set**
   - Go to Railway → Settings → Service
   - Set **Root Directory** to: `akions-app/backend`

3. **Wrong Database Name in MONGODB_URI**
   - ⚠️ Must use `/ekions` (not `/akions`)
   - Format: `mongodb+srv://user:pass@cluster.net/ekions?retryWrites=true&w=majority`

4. **Missing Environment Variables**
   - Add all required variables in Railway → Settings → Variables
   - Don't set `PORT` - Railway sets it automatically

5. **MongoDB Atlas IP Whitelist**
   - Add `0.0.0.0/0` to allow Railway IPs
   - Go to Atlas → Network Access → Add IP Address

6. **Build/Start Commands**
   - **Start Command:** `node server.js`
   - **Root Directory:** `akions-app/backend`

**For detailed troubleshooting, see `RAILWAY_TROUBLESHOOTING.md`**

#### General Issues
- **Port error**: Railway/Render sets PORT automatically, use `process.env.PORT || 3000`
- **MongoDB connection**: Check connection string and IP whitelist
- **CORS errors**: Update CORS with frontend URL

### Frontend Issues
- **API errors**: Check API URL is correct
- **Build errors**: Check Node version compatibility
- **Environment variables**: Ensure they're prefixed correctly (EXPO_PUBLIC_)

## 📞 Support

- Railway: https://railway.app/help
- Render: https://render.com/docs
- Vercel: https://vercel.com/support
- Expo: https://docs.expo.dev

---

**Ready to deploy?** Follow the steps above! 🚀





