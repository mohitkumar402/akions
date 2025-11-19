# MongoDB Atlas Setup - Step by Step

## 🚀 Quick Setup (5 minutes)

### Step 1: Sign Up
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Click "Try Free"
3. Sign up with Google, GitHub, or Email
4. Fill in your details and verify email

### Step 2: Create Free Cluster
1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier (Free Forever)
3. Select a **Cloud Provider** (AWS, Google Cloud, or Azure)
4. Choose a **Region** (pick closest to you, e.g., Mumbai for India)
5. Click **"Create"**
6. Wait 2-3 minutes for cluster to be created

### Step 3: Create Database User
1. In the setup wizard, you'll be asked to create a user
2. **Username**: `akions_user` (or any name you like)
3. **Password**: Create a strong password (SAVE THIS!)
4. Click **"Create Database User"**
5. **IMPORTANT**: Save your username and password!

### Step 4: Whitelist IP Address
1. In the setup wizard, choose **"Add My Current IP Address"**
2. OR click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` to whitelist
3. Click **"Finish and Close"**

### Step 5: Get Connection String
1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** and version **"5.5 or later"**
4. Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Update .env File
1. Open `akions-app/backend/.env`
2. Find the line: `MONGODB_URI=mongodb://localhost:27017/akions`
3. Replace it with your Atlas connection string
4. **IMPORTANT**: 
   - Replace `<password>` with your actual password
   - Add `/akions` before the `?` to specify database name
   - Final format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/akions?retryWrites=true&w=majority`

**Example:**
```env
MONGODB_URI=mongodb+srv://akions_user:MyPassword123@cluster0.abc123.mongodb.net/akions?retryWrites=true&w=majority
```

### Step 7: Restart Backend
1. Stop the backend server (Ctrl+C in backend window)
2. Start it again: `npm start`
3. You should see: **"Connected to MongoDB"** ✅

---

## ✅ Verification

After setup, test your connection:
- Backend should show: "Connected to MongoDB"
- No more connection errors
- You can now sign up and login!

---

## 🔒 Security Notes

- **Never commit your .env file to git**
- **Don't share your connection string publicly**
- **Use strong passwords**
- **For production, whitelist specific IPs only**

---

## 🆘 Troubleshooting

### Connection Timeout
- Check if IP is whitelisted in Atlas
- Try "Allow Access from Anywhere" for testing

### Authentication Failed
- Verify username and password are correct
- Check for special characters in password (may need URL encoding)

### Database Not Found
- Make sure you added `/akions` in the connection string
- Database will be created automatically on first use

---

## 📞 Need Help?

- Atlas Documentation: https://docs.atlas.mongodb.com/
- Connection String Guide: https://docs.atlas.mongodb.com/connect-to-cluster/

