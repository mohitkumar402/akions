# Quick MongoDB Setup - Choose Your Option

## 🚀 Option 1: MongoDB Atlas (Cloud - RECOMMENDED)

### Why Atlas?
- ✅ No installation needed
- ✅ Free tier (512MB storage)
- ✅ Works immediately
- ✅ No local setup required

### Steps (5 minutes):

1. **Sign Up:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create free account

2. **Create Free Cluster:**
   - Click "Build a Database"
   - Choose **FREE (M0)** tier
   - Select region (choose closest to you)
   - Click "Create"
   - Wait 2-3 minutes for cluster to be ready

3. **Create Database User:**
   - Go to "Database Access" (left menu)
   - Click "Add New Database User"
   - Username: `ekions_user` (or any name)
   - Password: Create a strong password (SAVE IT!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address:**
   - Go to "Network Access" (left menu)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP
   - Click "Confirm"

5. **Get Connection String:**
   - Go back to "Database" (left menu)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env file:**
   - Open `akions-app/backend/.env`
   - Replace the connection string:
   ```
   MONGODB_URI=mongodb+srv://ekions_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ekions?retryWrites=true&w=majority
   ```
   - Replace `YOUR_PASSWORD` with the password you created
   - Replace `cluster0.xxxxx.mongodb.net` with your actual cluster address
   - Add `/ekions` before the `?` to specify database name

7. **Restart Backend:**
   - Stop backend (Ctrl+C)
   - Start again: `npm start`
   - You should see: "Connected to MongoDB" ✅

---

## 💻 Option 2: Install MongoDB Locally

### Windows Installation:

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI
   - Download installer

2. **Install:**
   - Run the installer
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (GUI tool)
   - Click "Install"

3. **Verify Installation:**
   ```powershell
   # Check if service is running
   Get-Service -Name "MongoDB"
   
   # If not running, start it
   Start-Service -Name "MongoDB"
   ```

4. **Test Connection:**
   ```powershell
   mongosh
   # Or (older versions)
   mongo
   ```

5. **Update .env (if needed):**
   ```
   MONGODB_URI=mongodb://localhost:27017/ekions
   ```

6. **Restart Backend:**
   - Stop backend (Ctrl+C)
   - Start again: `npm start`

---

## 🐳 Option 3: Docker (If you have Docker)

```powershell
# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify
docker ps

# Your .env should have:
# MONGODB_URI=mongodb://localhost:27017/akions
```

---

## ✅ Quick Test

After setup, test your connection:

```powershell
# Test MongoDB connection
mongosh "mongodb://localhost:27017/ekions"
# Or for Atlas:
mongosh "mongodb+srv://username:password@cluster.mongodb.net/ekions"
```

---

## 🎯 Recommended: Start with Atlas

**MongoDB Atlas is the fastest way to get started:**
1. No installation
2. Free tier
3. Works immediately
4. Can switch to local later if needed

**Time to setup: ~5 minutes**

---

## Need Help?

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Local Installation: https://docs.mongodb.com/manual/installation/
- Connection Issues: Check firewall and network settings

