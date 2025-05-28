#!/bin/bash

echo "🔧 Quick fix for Utilitix deployment..."

# Create a simple start script without TypeScript compilation
echo "📝 Creating simple production start..."

# Copy server files to a simple structure
mkdir -p prod
cp -r server prod/
cp -r shared prod/
cp -r client prod/

# Install dependencies if needed
npm install

# Build client only
echo "🏗️ Building client..."
npm run build:client

# Create a simple node start file
cat > prod-start.js << 'EOF'
// Simple production start without TypeScript compilation
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('dist/client'));
app.use(express.json());

// Basic API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/client/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Utilitix running on port ${PORT}`);
});
EOF

echo "✅ Quick fix ready!"
echo "🚀 Starting with Node.js directly..."

# Start the application
node prod-start.js &

echo "✅ Application started!"
echo "🌐 Access your website at: http://your-server-ip:3000"