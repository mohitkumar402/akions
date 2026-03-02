const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const examplePath = path.join(__dirname, '..', '.env.example');

if (fs.existsSync(envPath)) {
  console.log('.env already exists – skipping.');
  process.exit(0);
}

if (!fs.existsSync(examplePath)) {
  console.error('.env.example not found.');
  process.exit(1);
}

fs.copyFileSync(examplePath, envPath);
console.log('Created .env from .env.example – edit .env and set MONGODB_URI (and other values for production).');
process.exit(0);
