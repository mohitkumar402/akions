// Quick script to URL-encode your MongoDB password
// Usage: node fix-mongodb-password.js "your-password-here"

const password = process.argv[2];

if (!password) {
  console.log('Usage: node fix-mongodb-password.js "your-password"');
  console.log('\nExample:');
  console.log('  node fix-mongodb-password.js "p@ss#word"');
  process.exit(1);
}

const encoded = encodeURIComponent(password);
console.log('\n📝 Password Encoding:');
console.log('Original:  ', password);
console.log('Encoded:   ', encoded);
console.log('\n💡 Use the encoded password in your connection string:');
console.log('   mongodb+srv://username:' + encoded + '@cluster.mongodb.net/ekions?retryWrites=true&w=majority');
console.log('\n⚠️  Common special characters that need encoding:');
console.log('   @ → %40');
console.log('   # → %23');
console.log('   % → %25');
console.log('   & → %26');
console.log('   + → %2B');
console.log('   / → %2F');
console.log('   = → %3D');
console.log('   ? → %3F');

