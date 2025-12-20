require('dotenv').config();
const mongoose = require('mongoose');

// Helper function to URL encode password
function encodeMongoPassword(uri) {
  try {
    const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);
    if (match) {
      const username = match[1];
      const password = match[2];
      if (password === decodeURIComponent(password)) {
        const encodedPassword = encodeURIComponent(password);
        return uri.replace(`:${password}@`, `:${encodedPassword}@`);
      }
    }
    return uri;
  } catch (err) {
    return uri;
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ekions';

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection string (password hidden):', MONGODB_URI.replace(/:([^:@]+)@/, ':***@'));

// Test with original URI
console.log('\n1️⃣  Testing with original connection string...');
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ Connected successfully with original string!');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Failed with original string:', err.message);
    
    // Test with encoded password
    console.log('\n2️⃣  Testing with URL-encoded password...');
    const encodedURI = encodeMongoPassword(MONGODB_URI);
    
    if (encodedURI !== MONGODB_URI) {
      console.log('Password was encoded, trying again...');
      mongoose.connect(encodedURI, { serverSelectionTimeoutMS: 5000 })
        .then(() => {
          console.log('✅ Connected successfully with encoded password!');
          console.log('\n💡 Solution: Use URL-encoded password in your .env file');
          process.exit(0);
        })
        .catch((err2) => {
          console.log('❌ Still failed:', err2.message);
          console.log('\n🔧 Additional troubleshooting:');
          console.log('1. Check MongoDB Atlas Network Access - whitelist your IP');
          console.log('2. Verify username and password are correct');
          console.log('3. Ensure database user has proper permissions');
          process.exit(1);
        });
    } else {
      console.log('Password appears to already be encoded or has no special characters');
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check MongoDB Atlas Network Access - whitelist your IP (0.0.0.0/0 for testing)');
      console.log('2. Verify username and password in MongoDB Atlas dashboard');
      console.log('3. Check if database name is correct');
      process.exit(1);
    }
  });

