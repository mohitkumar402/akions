require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userService = require('./userService');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const paymentRoutes = require('./routes/payment');
const chatRoutes = require('./routes/chat');
const chatKnowledgeRoutes = require('./routes/chatKnowledge');
const uploadRoutes = require('./routes/upload');
const { authenticateToken, requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// JWT: in production, secret is required (no default)
if (isProduction && !process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is required in production. Set it in .env');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-dev-secret';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ekions';

// Allowed origins: add CORS_ALLOWED_ORIGINS (comma-separated) in .env for extra origins
const allowedOrigins = [
  'http://localhost:8082',
  'http://localhost:19006',
  'http://localhost:3000',
  'https://akions.onrender.com',
  ...(process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim()) : []),
];
const vercelPattern = /^https:\/\/.*\.vercel\.app$/;

// CORS: in production only allow known origins; in dev allow all for flexibility
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.includes(origin) || vercelPattern.test(origin);
    if (allowed) {
      return callback(null, true);
    }
    if (isProduction) {
      return callback(new Error('CORS not allowed'), false);
    }
    if (process.env.LOG_CORS === 'true') {
      console.log(`CORS: Allowing origin (dev) ${origin}`);
    }
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Ekions Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      blogs: '/api/blogs',
      internships: '/api/internships',
      projects: '/api/projects',
      payment: '/api/payment',
      admin: '/api/admin',
    },
    note: 'This is the API server. Access the frontend through the Expo/Metro bundler URL.',
  });
});
// Helper function to URL encode password in connection string
function encodeMongoPassword(uri) {
  try {
    // Extract password from connection string
    const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);
    if (match) {
      const username = match[1];
      const password = match[2];
      // Check if password is already encoded
      if (password === decodeURIComponent(password)) {
        // Password needs encoding
        const encodedPassword = encodeURIComponent(password);
        return uri.replace(`:${password}@`, `:${encodedPassword}@`);
      }
    }
    return uri;
  } catch (err) {
    return uri;
  }
}

// Connect to MongoDB
const encodedMongoURI = encodeMongoPassword(MONGODB_URI);

// Log connection attempt (without showing password)
const safeURI = MONGODB_URI.replace(/:([^:@]+)@/, ':***@');
console.log('Attempting to connect to MongoDB...');
console.log('Connection string (password hidden):', safeURI);

mongoose
  .connect(encodedMongoURI, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    retryWrites: true,
    maxPoolSize: 10,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('\n🔍 Troubleshooting steps:');
    console.error('1. Verify username and password in MongoDB Atlas');
    console.error('2. Check if password contains special characters - they must be URL-encoded');
    console.error('   Example: @ becomes %40, # becomes %23, % becomes %25');
    console.error('3. Whitelist your IP address in MongoDB Atlas:');
    console.error('   - Go to Network Access → Add IP Address');
    console.error('   - Or use 0.0.0.0/0 to allow all IPs (less secure)');
    console.error('4. Verify database user has "readWrite" permissions');
    console.error('5. Check if connection string format is correct:');
    console.error('   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
    console.error('\n💡 Tip: Try encoding your password manually if it has special characters');
    console.error('   Use: encodeURIComponent("your-password")');
    // Don't exit - allow server to run without DB for testing
    console.error('\n⚠️  Server will continue running, but database features will not work.');
  });

// User storage & refresh token management handled by userService (in-memory).

// Helper function to generate tokens
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
      const user = await userService.createUser({ name, email, password });
      const accessToken = generateAccessToken({ id: user.id, email: user.email, name: user.name, role: user.role });
      const refreshToken = generateRefreshToken({ id: user.id, email: user.email });
      await userService.addRefreshToken(user.id, refreshToken);
      res.status(201).json({ user, accessToken, refreshToken });
    } catch (e) {
      if (e.message === 'User already exists') {
        return res.status(409).json({ error: 'User already exists' });
      }
      throw e;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user (regular users only - admins should use /api/auth/admin/login)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRecord = await userService.findByEmail(email);
    if (!userRecord) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Prevent admin users from logging in through regular login
    if (userRecord.role === 'admin') {
      return res.status(403).json({ error: 'Admin users must use the admin login page' });
    }
    
    const isPasswordValid = await userService.verifyPassword(password, userRecord.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    await userService.updateLoginMeta(userRecord.id, req.ip);
    const accessToken = generateAccessToken({ id: userRecord.id, email: userRecord.email, name: userRecord.name, role: userRecord.role });
    const refreshToken = generateRefreshToken({ id: userRecord.id, email: userRecord.email });
    await userService.addRefreshToken(userRecord.id, refreshToken);
    res.json({ user: userService.sanitizeUser(userRecord), accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin login (admin users only)
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRecord = await userService.findByEmail(email);
    if (!userRecord) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Only allow admin users to login through this endpoint
    if (userRecord.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. This login is for administrators only.' });
    }
    
    const isPasswordValid = await userService.verifyPassword(password, userRecord.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    await userService.updateLoginMeta(userRecord.id, req.ip);
    const accessToken = generateAccessToken({ id: userRecord.id, email: userRecord.email, name: userRecord.name, role: userRecord.role });
    const refreshToken = generateRefreshToken({ id: userRecord.id, email: userRecord.email });
    await userService.addRefreshToken(userRecord.id, refreshToken);
    res.json({ user: userService.sanitizeUser(userRecord), accessToken, refreshToken });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Use route modules
// Chat routes should be registered before public routes to avoid conflicts
app.use('/api', chatRoutes);
app.use('/api', chatKnowledgeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);
app.use('/api/payment', paymentRoutes);

// List users (admin only)
app.get('/api/auth/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (e) {
    console.error('List users error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role (admin only)
app.put('/api/auth/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      return res.status(400).json({ error: 'userId and role required' });
    }
    const updated = await userService.updateUserRole(userId, role);
    res.json(updated);
  } catch (e) {
    console.error('Update role error:', e);
    if (e.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Apply for internship (authenticated user)
app.post('/api/internships/apply', authenticateToken, async (req, res) => {
  try {
    const { internshipId, fullName, email, phone, coverLetter, experience, skills, education, availability, additionalInfo, resume } = req.body;
    if (!internshipId) {
      return res.status(400).json({ error: 'internshipId required' });
    }
    if (!fullName || !email) {
      return res.status(400).json({ error: 'fullName and email are required' });
    }

    // Get internship details for email
    const Internship = require('./models/Internship');
    let internship = null;
    // Handle both MongoDB ObjectIds and simple string IDs
    if (mongoose.Types.ObjectId.isValid(internshipId)) {
      internship = await Internship.findById(internshipId);
    } else {
      // If it's not a valid ObjectId, try to find by a custom ID field or skip
      // For now, we'll skip the lookup since frontend uses simple IDs
      console.log(`Internship ID "${internshipId}" is not a valid MongoDB ObjectId, skipping lookup for email notification`);
    }

    const application = await userService.applyForInternship({ 
      internshipId, 
      userId: req.user.id, 
      ip: req.ip,
      fullName,
      email,
      phone,
      coverLetter,
      experience,
      skills,
      education,
      availability,
      additionalInfo,
      resume,
    });

    // Send email notification
    const emailService = require('./services/emailService');
    if (internship) {
      await emailService.sendApplicationEmail({
        fullName,
        email,
        phone,
        internshipTitle: internship.title,
        company: internship.company,
        coverLetter,
        experience,
        skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
        education,
        availability,
        additionalInfo,
      });
    }

    res.status(201).json(application);
  } catch (e) {
    console.error('Apply internship error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List current user's applications
app.get('/api/internships/applications/mine', authenticateToken, async (req, res) => {
  try {
    const apps = await userService.listApplicationsByUser(req.user.id);
    res.json(apps);
  } catch (e) {
    console.error('List my applications error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List all applications (admin only)
app.get('/api/internships/applications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const apps = await userService.listApplications();
    res.json(apps);
  } catch (e) {
    console.error('List applications error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh access token
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const exists = await userService.hasRefreshToken(refreshToken);
    if (!exists) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
      }

      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout user
app.post('/api/auth/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await userService.revokeRefreshToken(refreshToken);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile (protected route)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await userService.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userService.sanitizeUser(user));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile (protected route)
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    
    const user = await userService.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update name if provided
    if (name) {
      await userService.updateName(user.id, name);
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password required' });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      if (!validatePassword(newPassword)) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      await userService.updatePassword(user.id, newPassword);
    }

    // updatedAt handled by Mongoose timestamps

    const updated = await userService.findById(user.id);
    res.json(userService.sanitizeUser(updated));
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password (protected route)
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    const user = await userService.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    await userService.updatePassword(user.id, newPassword);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete account (protected route)
app.delete('/api/auth/account', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required to delete account' });
    }

    const user = await userService.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await userService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    await userService.deleteUserById(user.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
