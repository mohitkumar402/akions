# Start Database and Backend

## 📊 Important: You're Using MongoDB Atlas (Cloud Database)

**Good News:** You don't need to run a local database!

Your setup uses **MongoDB Atlas** (cloud), which means:
- ✅ Database is already running in the cloud
- ✅ No installation needed
- ✅ Accessible 24/7
- ✅ Just connect to it!

## 🚀 How to Start Everything:

### Step 1: Database is Already Running!
- MongoDB Atlas runs in the cloud
- Your connection string connects to it automatically
- No action needed for the database

### Step 2: Start Backend Server

**PowerShell:**
```powershell
cd akions-app/backend
npm start
```

**You should see:**
```
Server is running on port 3000
Health check: http://localhost:3000/api/health
Connected to MongoDB ✅
```

### Step 3: Verify Connection

1. **Check health endpoint:**
   - Visit: http://localhost:3000/api/health
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Check MongoDB connection:**
   - Look for "Connected to MongoDB" in terminal
   - No authentication errors

## 🔧 If You See MongoDB Errors:

### Authentication Failed:
1. Check `.env` file has correct `MONGODB_URI`
2. Verify password in MongoDB Atlas
3. Check Network Access (IP whitelist)

### Connection Timeout:
1. Check MongoDB Atlas Network Access
2. Add your IP address or `0.0.0.0/0` (for development)

## ✅ Your Current Setup:

- **Database:** MongoDB Atlas (cloud) - Already running!
- **Backend:** Node.js/Express - Start with `npm start`
- **Connection String:** Already in `.env` file

## 📝 Connection String Format:

```
MONGODB_URI=mongodb+srv://akionsdevteam:Abc123@ekions.edczomg.mongodb.net/ekions?retryWrites=true&w=majority&appName=ekions
```

**No local MongoDB installation needed!** Just start the backend server.




