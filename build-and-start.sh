#!/bin/bash

echo "🏗️ Building Utilitix for production..."

# Stop any existing PM2 processes
pm2 stop utilitix 2>/dev/null || true
pm2 delete utilitix 2>/dev/null || true

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building client..."
npm run build:client

echo "🔨 Building server..."
npm run build:server

# Check if build was successful
if [ ! -f "dist/server/index.js" ]; then
    echo "❌ Build failed! Server files not found."
    exit 1
fi

if [ ! -d "dist/client" ]; then
    echo "❌ Build failed! Client files not found."
    exit 1
fi

echo "✅ Build successful!"

# Create production environment file
echo "📝 Creating production environment..."
cat > .env.production << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://utilitix_user:utilitix123@localhost:5432/utilitix
EOF

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

echo "✅ Application started successfully!"
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🌐 Your application should be running on:"
echo "   http://localhost:3000"
echo "   http://your-server-ip:3000"