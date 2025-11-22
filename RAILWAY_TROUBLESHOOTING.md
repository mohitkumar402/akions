# Railway Deployment Troubleshooting Guide

## 🚨 Common Railway Deployment Failures

### ❌ **ERROR: "secret ID missing for "" environment variable"**

This error means Railway found an environment variable with an **empty name** or a variable that has an **invalid format**.

**Solution:**

1. **Check All Environment Variables in Railway:**
   - Go to Railway → **Settings** → **Variables**
   - Look for any variable with:
     - Empty key name (no name before the `=`)
     - Spaces in the variable name
     - Special characters that aren't allowed
     - Empty value (if Railway is configured to require it)

2. **Delete Problematic Variables:**
   - Remove any variables with empty or invalid names
   - Remove variables you're not using
   - Make sure each variable has both a name AND a value

3. **Verify Required Variables Format:**
   All variables should follow this format:
   ```
   VARIABLE_NAME=value_with_no_spaces_unless_quoted
   ```
   
   ❌ **WRONG:**
   ```
   =some_value                    (empty name)
   MY VAR=value                   (space in name)
   VARIABLE_NAME=                 (empty value can cause issues)
   ```
   
   ✅ **CORRECT:**
   ```
   VARIABLE_NAME=value
   VARIABLE_NAME="value with spaces"
   VARIABLE_NAME=value123
   ```

4. **Re-add Variables Properly:**
   - Click **+ New Variable**
   - Enter variable name (no spaces, use underscores: `MY_VAR`)
   - Enter value
   - Save

5. **Minimum Required Variables (with values):**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.net/ekions?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-min-32-chars-long
   ```
   
   **Optional but recommended:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ADMIN_EMAIL=admin@ekions.com
   RAZORPAY_KEY_ID=your-key-id
   RAZORPAY_KEY_SECRET=your-secret
   ```
   
   **⚠️ DO NOT SET:**
   - `PORT` - Railway sets this automatically
   - Any variable with an empty name
   - Variables with spaces in the name (use underscores instead)

6. **After Fixing:**
   - Save all variables
   - Go to **Deployments** → Click **Redeploy**
   - Watch the build logs to ensure it succeeds

### 1. **Root Directory Not Set** (Most Common)
Railway doesn't know where your backend code is located.

**Solution:**
1. Go to Railway project → **Settings** → **Service**
2. Set **Root Directory** to: `akions-app/backend`
3. Save and redeploy

### 2. **Missing Environment Variables**
Railway needs all environment variables set.

**Required Variables:**
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ekions?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@ekions.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**⚠️ IMPORTANT:** 
- Make sure `MONGODB_URI` uses `/ekions` as the database name (not `/akions`)
- Railway sets `PORT` automatically, but you can also set it explicitly
- Add `0.0.0.0/0` to MongoDB Atlas Network Access to allow Railway's IPs

### 3. **Build/Start Commands Not Configured**
Railway needs explicit commands.

**Go to Settings → Deploy:**
- **Build Command:** `npm install` (or leave empty - Railway auto-detects)
- **Start Command:** `node server.js`
- **Root Directory:** `akions-app/backend`

### 4. **MongoDB Connection Issues**

**Check:**
1. **Database Name:** Must be `/ekions` (not `/akions`)
2. **IP Whitelist:** Add `0.0.0.0/0` to MongoDB Atlas Network Access
3. **Connection String Format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ekions?retryWrites=true&w=majority
   ```
   ⚠️ Make sure `/ekions` comes before the `?`

### 5. **Port Configuration**
Railway sets PORT automatically. Your server.js already handles this:
```javascript
const PORT = process.env.PORT || 3000;
```
✅ This is correct - no changes needed.

### 6. **Build Errors**

**Check:**
- Node.js version compatibility (Railway uses latest LTS)
- All dependencies in `package.json`
- No missing files in repository

### 7. **Deployment Hangs/Fails**

**Check Railway Logs:**
1. Go to Railway project → **Deployments**
2. Click on the failed deployment
3. Check the **Logs** tab for errors

**Common Log Errors:**
- `Cannot find module` → Missing dependency or wrong root directory
- `MongoServerSelectionError` → MongoDB connection issue
- `Port already in use` → Port conflict (unlikely on Railway)
- `ECONNREFUSED` → MongoDB not accessible from Railway

## ✅ Step-by-Step Railway Setup

### Step 1: Configure Service Settings
1. Go to Railway project
2. Click **Settings** → **Service**
3. Set **Root Directory:** `akions-app/backend`
4. **Build Command:** Leave empty (auto-detected) or `npm install`
5. **Start Command:** `node server.js`

### Step 2: Add Environment Variables
1. Go to **Settings** → **Variables**
2. Click **+ New Variable** for each:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ekions?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ADMIN_EMAIL=admin@ekions.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```
   ⚠️ **Don't set PORT** - Railway sets it automatically

### Step 3: Configure MongoDB Atlas
1. Go to MongoDB Atlas → **Network Access**
2. Add IP Address: `0.0.0.0/0` (allows all IPs)
3. Verify connection string uses `/ekions` database name

### Step 4: Deploy
1. Go to **Deployments** tab
2. Click **Redeploy** or push to GitHub (if connected)
3. Watch the logs for errors

### Step 5: Check Health
1. Get your Railway URL (e.g., `yourapp.up.railway.app`)
2. Test: `https://yourapp.up.railway.app/api/health`
3. Should return: `{"status":"OK","message":"Server is running"}`

## 🔍 Debugging Checklist

- [ ] Root Directory set to `akions-app/backend`
- [ ] All environment variables added in Railway
- [ ] MongoDB URI uses `/ekions` (not `/akions`)
- [ ] MongoDB Atlas allows `0.0.0.0/0` IPs
- [ ] Start command is `node server.js`
- [ ] No PORT variable set (Railway handles it)
- [ ] JWT_SECRET is set and long enough
- [ ] Repository is connected and up to date
- [ ] Check deployment logs for specific errors

## 📞 Still Having Issues?

1. **Check Railway Logs** - Look for specific error messages
2. **Test Locally First** - Make sure it works with `.env` file
3. **Verify MongoDB** - Test connection string in MongoDB Compass
4. **Check Railway Status** - Visit status.railway.app

## 🎯 Quick Fixes

### If deployment fails immediately:
```bash
# Check your local setup works
cd akions-app/backend
npm install
npm start
# Test: http://localhost:3000/api/health
```

### If MongoDB connection fails:
```bash
# Test connection string locally
node -e "require('mongoose').connect('YOUR_MONGODB_URI').then(() => console.log('Connected!'))"
```

### If build fails:
```bash
# Clean install locally
cd akions-app/backend
rm -rf node_modules package-lock.json
npm install
```

---

**Remember:** Most Railway failures are due to:
1. ❌ Wrong Root Directory
2. ❌ Missing Environment Variables  
3. ❌ Wrong Database Name (`/akions` vs `/ekions`)
4. ❌ MongoDB IP Whitelist not allowing Railway IPs

