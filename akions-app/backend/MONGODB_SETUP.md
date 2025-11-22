# MongoDB Setup Guide

## Problem
The backend is showing: `MongooseServerSelectionError: connect ECONNREFUSED ::1:27017`

This means MongoDB is not running on your system.

## Solution Options

### Option 1: Install and Run MongoDB Locally (Recommended for Development)

#### Windows Installation:
1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Download and install

2. **Start MongoDB Service:**
   ```powershell
   # Check if service exists
   Get-Service -Name "*mongo*"
   
   # Start MongoDB service
   Start-Service -Name "MongoDB"
   
   # Or start manually
   mongod --dbpath "C:\data\db"
   ```

3. **Verify MongoDB is Running:**
   ```powershell
   # Test connection
   mongosh
   # Or
   mongo
   ```

#### Create Data Directory (if needed):
```powershell
# Create MongoDB data directory
New-Item -ItemType Directory -Path "C:\data\db" -Force
```

### Option 2: Use MongoDB Atlas (Cloud - Free Tier)

1. **Sign up for MongoDB Atlas:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a Cluster:**
   - Choose FREE tier (M0)
   - Select a region close to you
   - Wait for cluster to be created (2-3 minutes)

3. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `ekions`

4. **Update .env file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ekions?retryWrites=true&w=majority
   ```

5. **Whitelist IP Address:**
   - In Atlas, go to "Network Access"
   - Add your IP address (or 0.0.0.0/0 for development)

### Option 3: Use Docker (If you have Docker installed)

```powershell
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running
docker ps
```

## Quick Fix Commands

### Check MongoDB Status:
```powershell
Get-Service -Name "*mongo*"
netstat -ano | findstr :27017
```

### Start MongoDB (if service exists):
```powershell
Start-Service -Name "MongoDB"
```

### Start MongoDB Manually:
```powershell
# Create data directory first
New-Item -ItemType Directory -Path "C:\data\db" -Force

# Start MongoDB
mongod --dbpath "C:\data\db"
```

## Verify Connection

After starting MongoDB, test the connection:
```powershell
# Test with mongosh
mongosh

# Or test with mongo (older version)
mongo
```

## Update Backend .env

Make sure your `.env` file has:
```env
MONGODB_URI=mongodb://localhost:27017/ekions
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ekions
```

## Restart Backend

After MongoDB is running:
1. Stop the backend server (Ctrl+C)
2. Start it again: `npm start`
3. You should see: "Connected to MongoDB"

## Troubleshooting

### Port 27017 already in use:
```powershell
# Find process using port 27017
netstat -ano | findstr :27017

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Permission errors:
- Run PowerShell as Administrator
- Check MongoDB service permissions

### MongoDB not in PATH:
- Add MongoDB bin directory to system PATH
- Or use full path: `C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe`

