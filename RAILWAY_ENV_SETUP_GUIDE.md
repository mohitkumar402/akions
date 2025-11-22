# Railway Environment Variables - Complete Setup Guide

## 📋 Quick Copy-Paste Ready Template

Copy the variables below and paste them into Railway → Settings → Variables. Then replace the placeholders with your actual values.

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://YOUR_MONGODB_USERNAME:YOUR_MONGODB_PASSWORD@YOUR_CLUSTER.mongodb.net/ekions?retryWrites=true&w=majority
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_MINIMUM_32_CHARACTERS_LONG_CHANGE_THIS
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=YOUR_EMAIL@gmail.com
SMTP_PASS=YOUR_GMAIL_APP_PASSWORD
ADMIN_EMAIL=admin@ekions.com
```

## 📝 Step-by-Step Instructions

### Step 1: Copy the Template
Copy all the variables from above (or from `RAILWAY_ENV_READY.txt`)

### Step 2: Get Your Values

#### 1. MongoDB Atlas Connection String
- Go to: https://www.mongodb.com/cloud/atlas
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace:
  - `<password>` with your MongoDB password
  - `<dbname>` with `ekions` (⚠️ must be ekions, not akions)
- Example format:
  ```
  mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ekions?retryWrites=true&w=majority
  ```

#### 2. JWT Secret Key
Generate a secure random string (minimum 32 characters):
- Option 1: Visit https://generate-secret.vercel.app/32
- Option 2: Run in terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Option 3: Use any secure random string generator

#### 3. Razorpay Keys
- Go to: https://dashboard.razorpay.com/app/keys
- Copy your **Key ID** → Replace `YOUR_RAZORPAY_KEY_ID`
- Copy your **Key Secret** → Replace `YOUR_RAZORPAY_KEY_SECRET`
- Use Test keys for development, Live keys for production

#### 4. Gmail App Password (for SMTP)
- Go to: https://myaccount.google.com/
- Enable **2-Step Verification** (if not already enabled)
- Go to: https://myaccount.google.com/apppasswords
- Select "Mail" and "Other (Custom name)"
- Enter name: "Ekions Backend"
- Copy the 16-character password → Replace `YOUR_GMAIL_APP_PASSWORD`
- Use your Gmail address → Replace `YOUR_EMAIL@gmail.com`

### Step 3: Replace Placeholders
Replace all `YOUR_*` placeholders with your actual values:

| Placeholder | What to Replace With |
|------------|---------------------|
| `YOUR_MONGODB_USERNAME` | Your MongoDB Atlas username |
| `YOUR_MONGODB_PASSWORD` | Your MongoDB Atlas password (URL encode special chars) |
| `YOUR_CLUSTER` | Your MongoDB cluster address (e.g., `cluster0.xxxxx`) |
| `YOUR_SUPER_SECRET_JWT_KEY_MINIMUM_32_CHARACTERS_LONG_CHANGE_THIS` | A secure random 32+ character string |
| `YOUR_RAZORPAY_KEY_ID` | Your Razorpay Key ID |
| `YOUR_RAZORPAY_KEY_SECRET` | Your Razorpay Key Secret |
| `YOUR_EMAIL@gmail.com` | Your Gmail address |
| `YOUR_GMAIL_APP_PASSWORD` | Gmail App Password (16 characters) |

### Step 4: Add to Railway
1. Go to Railway → Your Project → **Settings** → **Variables**
2. For each variable, click **+ New Variable**
3. Paste variable name and value
4. **Important:** Make sure:
   - No spaces in variable names
   - All values are filled (no empty values)
   - Variable names use underscores (e.g., `SMTP_USER` not `SMTP USER`)
5. Save all variables

### Step 5: Verify Setup
1. Go to **Deployments** tab
2. Click **Redeploy** (if needed)
3. Check the build logs
4. Test your API: `https://your-app.railway.app/api/health`

## ⚠️ Important Notes

### DO NOT Set These:
- ❌ `PORT` - Railway sets this automatically
- ❌ Any variable with spaces in the name
- ❌ Any variable with an empty value

### Database Name Must Be:
- ✅ `/ekions` (not `/akions`)
- Example: `mongodb+srv://...@cluster.net/ekions?retryWrites=true&w=majority`

### MongoDB Atlas IP Whitelist:
1. Go to MongoDB Atlas → **Network Access**
2. Click **Add IP Address**
3. Add `0.0.0.0/0` (allows all IPs including Railway)

## 🔍 Example of Filled Values

Here's an example with real values (don't use these exact values):

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://ekionsuser:MyPass123%40@cluster0.abc123.mongodb.net/ekions?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
RAZORPAY_KEY_ID=rzp_test_ABC123xyz
RAZORPAY_KEY_SECRET=secret_XYZ789abc
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=youremail@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
ADMIN_EMAIL=admin@ekions.com
```

## 📁 Files Reference

- `RAILWAY_ENV_COMPLETE.env` - Complete file with comments and explanations
- `RAILWAY_ENV_READY.txt` - Clean template ready to copy-paste

## ✅ Checklist

Before deploying, make sure:
- [ ] All `YOUR_*` placeholders are replaced with actual values
- [ ] MongoDB URI uses `/ekions` database name
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] JWT_SECRET is at least 32 characters long
- [ ] Gmail App Password is generated and copied
- [ ] Razorpay keys are correct (test or live)
- [ ] All variables added to Railway with correct names (no spaces)
- [ ] No empty values for any variable
- [ ] PORT variable is NOT set (Railway handles it)


