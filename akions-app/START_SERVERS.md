# How to Start the Application

## Backend Server

The backend server is now running on **port 3000**.

### To start manually:
```bash
cd akions-app/backend
npm install  # (if not already done)
npm start
```

### Environment Variables
Create a `.env` file in `akions-app/backend/` with:
```
MONGODB_URI=mongodb://localhost:27017/ekions
JWT_SECRET=ekions-secret-key-change-in-production
PORT=3000
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

**Note**: Make sure MongoDB is running on your system before starting the backend.

## Frontend Server

The frontend server should be starting. It will run on:
- **Web**: http://localhost:19006 (or check terminal output)
- **Expo Dev Tools**: http://localhost:19000

### To start manually:
```bash
cd akions-app/frontend
npm install  # (if not already done)
npm start
# Then press 'w' for web, 'a' for Android, or 'i' for iOS
```

## Quick Start Commands

### Start Both Servers (PowerShell):
```powershell
# Terminal 1 - Backend
cd akions-app/backend
npm start

# Terminal 2 - Frontend  
cd akions-app/frontend
npm start
```

### Start Both Servers (Bash):
```bash
# Terminal 1 - Backend
cd akions-app/backend && npm start

# Terminal 2 - Frontend
cd akions-app/frontend && npm start
```

## Access Points

- **Backend API**: http://localhost:3000
- **Backend Health Check**: http://localhost:3000/api/health
- **Frontend Web**: Check Expo output (usually http://localhost:19006)
- **Admin Panel**: Login as admin user and click "Admin" button

## Prerequisites

1. **Node.js** installed (v14 or higher)
2. **MongoDB** running locally or connection string configured
3. **npm** or **yarn** package manager

## Troubleshooting

### Backend Issues:
- Check if MongoDB is running: `mongod --version`
- Check if port 3000 is available
- Verify `.env` file exists with correct values

### Frontend Issues:
- Clear cache: `npm start -- --clear`
- Check if ports 19000, 19001, 19006 are available
- Verify all dependencies are installed

### MongoDB Connection:
- Default: `mongodb://localhost:27017/ekions`
- If using MongoDB Atlas, update `MONGODB_URI` in `.env`

## Current Status

✅ Backend server: **RUNNING** on port 3000
🔄 Frontend server: **STARTING** (check terminal for URL)

