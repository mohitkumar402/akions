# Fix: Duplicate Refresh Token Error

## ✅ Issue Fixed

The duplicate refresh token error has been fixed. The `addRefreshToken` function now uses `findOneAndUpdate` with `upsert: true` to handle duplicate tokens gracefully.

## 🔧 What Was Fixed

**Before:**
- `RefreshToken.create()` would fail if the same token already exists
- No error handling for duplicate keys

**After:**
- Uses `findOneAndUpdate` with `upsert: true`
- Handles duplicate key errors gracefully
- Token is updated if it exists, created if it doesn't

## 📝 Database Name Issue

**The error shows:** `collection: akions.refreshtokens`

This means your MongoDB connection string is still using the **old database name** `akions` instead of `ekions`.

### Fix Database Name:

1. **Check your `.env` file:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/akions?retryWrites=true&w=majority
   ```
   
2. **Change it to:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ekions?retryWrites=true&w=majority
   ```
   
   ⚠️ **Important:** Change `/akions` to `/ekions` in your MongoDB URI

3. **Or update in Railway Variables:**
   - Go to Railway → Settings → Variables
   - Find `MONGODB_URI`
   - Make sure it ends with `/ekions` (not `/akions`)

4. **Restart your backend server** after updating the connection string

## 🔄 Next Steps

1. ✅ Duplicate token error is fixed (no action needed)
2. ⚠️ Update your MongoDB connection string to use `/ekions` database name
3. ⚠️ Restart the backend server

## 💡 Alternative: Clear Existing Tokens

If you want to start fresh, you can clear existing refresh tokens:

1. **Using MongoDB Compass or Atlas UI:**
   - Connect to your database
   - Go to `akions` database → `refreshtokens` collection
   - Delete all documents (or the specific duplicate token)

2. **Or update connection to use `ekions` database:**
   - MongoDB will create the new database automatically
   - Old `akions` database will remain but won't be used


