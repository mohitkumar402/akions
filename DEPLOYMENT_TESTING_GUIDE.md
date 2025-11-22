# Deployment Testing Guide

## 🚀 Pre-Deployment Testing Checklist

### Backend Testing (http://localhost:3000)

#### 1. Health Check
- [ ] GET `/api/health` - Should return `{"status":"OK"}`
- [ ] Server starts without errors
- [ ] MongoDB connection successful

#### 2. Authentication
- [ ] POST `/api/auth/register` - User registration works
- [ ] POST `/api/auth/login` - User login works
- [ ] GET `/api/auth/me` - Token validation works
- [ ] Admin login: `admin@akionsmpss` / `Mohit@123`

#### 3. Public APIs (No Auth Required)
- [ ] GET `/api/products` - Returns product list
- [ ] GET `/api/products/:id` - Returns single product
- [ ] GET `/api/blogs` - Returns blog list
- [ ] GET `/api/blogs/:id` - Returns single blog
- [ ] GET `/api/internships` - Returns internship list
- [ ] GET `/api/internships/:id` - Returns single internship
- [ ] GET `/api/projects` - Returns project list

#### 4. Admin APIs (Requires Admin Token)
- [ ] GET `/api/admin/products` - List all products
- [ ] POST `/api/admin/products` - Create product
- [ ] PUT `/api/admin/products/:id` - Update product
- [ ] DELETE `/api/admin/products/:id` - Delete product

- [ ] GET `/api/admin/blogs` - List all blogs
- [ ] POST `/api/admin/blogs` - Create blog
- [ ] PUT `/api/admin/blogs/:id` - Update blog
- [ ] DELETE `/api/admin/blogs/:id` - Delete blog

- [ ] GET `/api/admin/projects` - List all projects
- [ ] POST `/api/admin/projects` - Create project
- [ ] PUT `/api/admin/projects/:id` - Update project
- [ ] DELETE `/api/admin/projects/:id` - Delete project

- [ ] GET `/api/admin/internships` - List all internships
- [ ] POST `/api/admin/internships` - Create internship
- [ ] PUT `/api/admin/internships/:id` - Update internship
- [ ] DELETE `/api/admin/internships/:id` - Delete internship

- [ ] GET `/api/admin/documents` - List all documents
- [ ] POST `/api/admin/documents` - Create document
- [ ] PUT `/api/admin/documents/:id` - Update document
- [ ] DELETE `/api/admin/documents/:id` - Delete document

#### 5. File Upload
- [ ] POST `/api/upload/file` - Upload image/video works
- [ ] Files saved to `uploads/images` or `uploads/videos`
- [ ] File URLs returned correctly

#### 6. Chat API
- [ ] POST `/api/chat/session` - Create chat session
- [ ] POST `/api/chat` - Send message
- [ ] GET `/api/chat/history/:sessionId` - Get chat history

### Frontend Testing (http://localhost:8082)

#### 1. Public Pages (No Login Required)
- [ ] Home page loads
- [ ] Marketplace page loads and displays products
- [ ] Blog page loads and displays blogs
- [ ] Internships page loads and displays internships
- [ ] About page loads
- [ ] Services page loads
- [ ] Contact page loads
- [ ] Search functionality works

#### 2. Authentication
- [ ] User registration form works
- [ ] User login form works
- [ ] Admin login page accessible at `/AdminLogin`
- [ ] Logout functionality works
- [ ] Protected routes redirect to login

#### 3. Admin Dashboard
- [ ] Admin login: `admin@akionsmpss` / `Mohit@123`
- [ ] Admin dashboard loads after login
- [ ] All admin tabs visible (Products, Blogs, Projects, Internships, Documents)

#### 4. Products Management
- [ ] View all products
- [ ] Add new product (with file upload)
- [ ] Edit existing product
- [ ] Delete product
- [ ] File upload from device works
- [ ] URL input as fallback works

#### 5. Blogs Management
- [ ] View all blogs
- [ ] Add new blog (with file upload)
- [ ] Edit existing blog
- [ ] Delete blog
- [ ] File upload from device works
- [ ] Blog content displays correctly

#### 6. Projects Management
- [ ] View all projects
- [ ] Add new project (with file upload)
- [ ] Edit existing project
- [ ] Delete project
- [ ] Features and Technologies fields work
- [ ] File upload from device works

#### 7. Internships Management
- [ ] View all internships
- [ ] Add new internship (with file upload)
- [ ] Edit existing internship
- [ ] Delete internship
- [ ] Type selector (Remote/On-site/Hybrid) works
- [ ] File upload from device works

#### 8. Documents Management
- [ ] View all documents
- [ ] Add new document (with file upload)
- [ ] Edit existing document
- [ ] Delete document
- [ ] File upload from device works

#### 9. User Features
- [ ] Internship application form works
- [ ] Application sends email
- [ ] Product details page loads
- [ ] Blog post detail page loads
- [ ] Chatbot functionality works

#### 10. UI/UX
- [ ] Responsive design works on different screen sizes
- [ ] Dark theme applied correctly
- [ ] Hover effects work (web)
- [ ] Navigation works smoothly
- [ ] Forms validate correctly
- [ ] Error messages display properly
- [ ] Success messages display properly

## 🔧 Environment Variables Check

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
```

### Frontend
- API_BASE should point to backend URL
- For production: Update to production backend URL

## 📝 Deployment Steps

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Update `.env` with production values
3. Install dependencies: `npm install`
4. Start server: `node server.js` or use PM2
5. Ensure port 3000 is accessible

### Frontend Deployment
1. Update API_BASE in frontend to production backend URL
2. Build for production: `expo build` or `eas build`
3. Deploy to hosting (Vercel, Netlify, etc.)
4. Or build native apps for iOS/Android

## ⚠️ Common Issues to Check

- [ ] CORS configured correctly for production domain
- [ ] MongoDB connection string is correct
- [ ] JWT secret is strong and secure
- [ ] File upload directory has write permissions
- [ ] Environment variables are set correctly
- [ ] Ports are not blocked by firewall
- [ ] SSL/HTTPS configured for production
- [ ] Error logging is working
- [ ] Database indexes are created
- [ ] Admin user exists in database

## ✅ Final Verification

- [ ] All CRUD operations work
- [ ] File uploads work
- [ ] Authentication works
- [ ] Public pages load
- [ ] Admin pages are protected
- [ ] No console errors
- [ ] No network errors
- [ ] Forms submit correctly
- [ ] Data persists in database
- [ ] Images/videos display correctly

---

**Ready for Deployment!** 🚀






