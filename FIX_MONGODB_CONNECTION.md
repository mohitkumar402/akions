# Fix MongoDB Authentication Error - Quick Guide

## 🔍 Current Issue:
```
MongoDB connection error: MongoServerError: bad auth : authentication failed
```

Your MongoDB connection string is:
```
MONGODB_URI=mongodb+srv://akionsdevteam:Mohit%40%24123@ekions.edczomg.mongodb.net/akions?retryWrites=true&w=majority
```

## ✅ Two Issues to Fix:

### 1. Database Name is Wrong
- ❌ Currently: `/akions`
- ✅ Should be: `/ekions`

### 2. Authentication Failed
Possible causes:
- Wrong username or password
- Password encoding issue
- Database user doesn't exist in MongoDB Atlas

## 🔧 Steps to Fix:

### Step 1: Update Database Name

1. Open `akions-app/backend/.env` file
2. Find the line with `MONGODB_URI`
3. Change `/akions` to `/ekions`:
   ```
   MONGODB_URI=mongodb+srv://akionsdevteam:Mohit%40%24123@ekions.edczomg.mongodb.net/ekions?retryWrites=true&w=majority
   ```
   ⚠️ Change `/akions?` to `/ekions?`

### Step 2: Verify MongoDB Atlas Credentials

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com/
2. **Check Database Access:**
   - Click "Database Access" in left menu
   - Verify user `akionsdevteam` exists
   - Check if password is correct

3. **Reset Password (if needed):**
   - Click on the user
   - Click "Edit"
   - Click "Edit Password"
   - Create a new password
   - **Save the password!**

4. **Update Connection String:**
   - If password changed, update in `.env` file
   - URL encode special characters:
     - `@` → `%40`
     - `#` → `%23`
     - `$` → `%24`
   - Example: If password is `MyPass@123`, use `MyPass%40123`

### Step 3: Verify IP Whitelist

1. **Go to MongoDB Atlas → Network Access**
2. **Check if your IP is allowed:**
   - Add your current IP address
   - OR add `0.0.0.0/0` for development (allows all IPs)

### Step 4: Get Fresh Connection String

1. **In MongoDB Atlas:**
   - Click on your cluster
   - Click "Connect"
   - Choose "Connect your application"
   - Select "Node.js" driver
   - Copy the connection string

2. **Update in .env:**
   - Replace `<password>` with your actual password (URL encoded)
   - Replace `<dbname>` with `ekions`
   - Format: `mongodb+srv://username:password@cluster.net/ekions?retryWrites=true&w=majority`

### Step 5: Restart Backend

After updating `.env`:
1. Stop the server (Ctrl+C)
2. Restart: `cd akions-app/backend; npm start`
3. You should see: **"Connected to MongoDB"** ✅

## 📝 Corrected Connection String Format:

```
MONGODB_URI=mongodb+srv://username:encoded_password@cluster.mongodb.net/ekions?retryWrites=true&w=majority
```

**Key Points:**
- Database name: `/ekions` (not `/akions`)
- Password must be URL encoded if it has special characters
- Cluster address: `ekions.edczomg.mongodb.net` (this looks correct)

## 🔑 Password URL Encoding:

Your current password encoding `Mohit%40%24123` decodes to `Mohit@$123`

- `%40` = `@`
- `%24` = `$`

If your password changed, encode the new password properly.

## ✅ Success Check:

After fixing, you should see in terminal:
```
Server is running on port 3000
Health check: http://localhost:3000/api/health
Connected to MongoDB ✅
```

No authentication errors!

