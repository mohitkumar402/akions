# Fix MongoDB Authentication Error

## ❌ Current Error:
```
MongoDB connection error: MongoServerError: bad auth : authentication failed
```

## 🔍 What This Means:
The MongoDB username or password in your `.env` file is incorrect, or the database user doesn't exist.

## ✅ Solution Steps:

### Step 1: Check Your MongoDB Atlas Connection String

1. **Go to MongoDB Atlas:**
   - Visit: https://cloud.mongodb.com/
   - Log in to your account

2. **Get Your Connection String:**
   - Click on your cluster
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

3. **Verify Database User:**
   - Go to "Database Access" (left sidebar)
   - Check if your database user exists
   - If not, create a new user:
     - Username: (e.g., `ekions_user`)
     - Password: Create a strong password
     - Privileges: "Read and write to any database"

### Step 2: Update Your .env File

Open `akions-app/backend/.env` and update the `MONGODB_URI`:

**Format:**
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/ekions?retryWrites=true&w=majority
```

**Important:**
- Replace `USERNAME` with your MongoDB Atlas username
- Replace `PASSWORD` with your MongoDB Atlas password
- **URL Encode special characters in password:**
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `/` → `%2F`
  - `?` → `%3F`
  - `=` → `%3D`
  - `&` → `%26`
- Replace `CLUSTER` with your cluster address
- Make sure `/ekions` is included before the `?`

**Example:**
If your password is `MyPass@123#`, it should be `MyPass%40123%23`:
```
MONGODB_URI=mongodb+srv://ekions_user:MyPass%40123%23@cluster0.abc123.mongodb.net/ekions?retryWrites=true&w=majority
```

### Step 3: Verify IP Whitelist

1. **Go to MongoDB Atlas → Network Access**
2. **Check if your IP is whitelisted:**
   - Add your current IP address
   - OR add `0.0.0.0/0` (allows all IPs - for development only)

### Step 4: Test the Connection String

You can test your connection string using MongoDB Compass or directly:
- Download MongoDB Compass: https://www.mongodb.com/try/products/compass
- Paste your connection string
- Click "Connect"

### Step 5: Restart Backend Server

After updating `.env`:
1. Stop the server (Ctrl+C in terminal)
2. Restart: `cd akions-app/backend; npm start`
3. You should see: **"Connected to MongoDB"** ✅

## 🔧 Quick URL Encoding Helper

If your password has special characters, encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `/` | `%2F` |
| `?` | `%3F` |
| `=` | `%3D` |
| `&` | `%26` |
| ` ` (space) | `%20` |

**Example:**
- Password: `P@ss#123`
- Encoded: `P%40ss%23123`

## 📝 Complete .env Example

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Database Connection
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://your_username:your_encoded_password@your_cluster.mongodb.net/ekions?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Razorpay (optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email SMTP (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@ekions.com
```

## 🆘 Still Having Issues?

1. **Verify username/password in MongoDB Atlas:**
   - Go to Database Access
   - Check if user exists
   - Reset password if needed

2. **Check connection string format:**
   - Should start with `mongodb+srv://`
   - Should include `/ekions` database name
   - Should have `?retryWrites=true&w=majority` at the end

3. **Test with MongoDB Compass:**
   - Download and install MongoDB Compass
   - Try connecting with your connection string
   - If it works in Compass, the connection string is correct

4. **Check MongoDB Atlas Status:**
   - Ensure your cluster is running
   - Check for any service alerts

## ✅ Success Indicators

After fixing, you should see:
```
Server is running on port 3000
Health check: http://localhost:3000/api/health
Connected to MongoDB ✅
```

No more authentication errors!




