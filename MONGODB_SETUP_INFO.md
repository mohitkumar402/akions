# MongoDB Database Setup Info

## 📊 Your Current Setup:

You are using **MongoDB Atlas** (cloud database), which means:
- ✅ **No local installation needed**
- ✅ **Database runs in the cloud**
- ✅ **Accessible from anywhere**
- ✅ **Free tier available**

## 🔗 Your Connection String:

```
mongodb+srv://akionsdevteam:Abc123@ekions.edczomg.mongodb.net/ekions?retryWrites=true&w=majority
```

## ✅ What You Need to Know:

### 1. **No Local Database Required**
- MongoDB Atlas is a cloud service
- Your backend connects to it automatically
- Just make sure your `.env` file has the correct connection string

### 2. **Database is Already Running**
- MongoDB Atlas is always running (24/7)
- You don't need to start/stop it
- Just ensure your backend can connect to it

### 3. **To Use Database:**
1. Make sure `.env` has correct `MONGODB_URI`
2. Start your backend server: `cd akions-app/backend; npm start`
3. Backend will automatically connect to MongoDB Atlas

## 🔧 Current Connection Details:

- **Database Type:** MongoDB Atlas (Cloud)
- **Cluster:** ekions.edczomg.mongodb.net
- **Database Name:** ekions
- **Username:** akionsdevteam
- **Password:** Abc123

## ✅ To Verify Connection:

1. **Start Backend:**
   ```powershell
   cd akions-app/backend
   npm start
   ```

2. **Look for this message:**
   ```
   Connected to MongoDB ✅
   ```

3. **If you see authentication error:**
   - Check MongoDB Atlas → Database Access
   - Verify username/password
   - Check Network Access (IP whitelist)

## 🆘 Need Local MongoDB Instead?

If you want to install MongoDB locally (optional):

1. **Download:** https://www.mongodb.com/try/download/community
2. **Install on Windows**
3. **Update .env:**
   ```
   MONGODB_URI=mongodb://localhost:27017/ekions
   ```

But for now, **MongoDB Atlas is recommended** - it's easier and works immediately!




