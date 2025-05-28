#!/bin/bash

echo "🚀 Setting up database for Utilitix..."

# Stop any existing PostgreSQL connections
sudo systemctl restart postgresql

# Create database and user with simple authentication
sudo -u postgres psql << EOF
-- Drop existing database and user if they exist
DROP DATABASE IF EXISTS utilitix;
DROP USER IF EXISTS utilitix_user;

-- Create database
CREATE DATABASE utilitix;

-- Create user with simple password
CREATE USER utilitix_user WITH PASSWORD 'utilitix123';

-- Grant all privileges
ALTER USER utilitix_user CREATEDB;
ALTER USER utilitix_user WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE utilitix TO utilitix_user;

-- Connect to the database and grant schema permissions
\c utilitix
GRANT ALL ON SCHEMA public TO utilitix_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO utilitix_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO utilitix_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO utilitix_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO utilitix_user;

\q
EOF

echo "✅ Database setup complete!"
echo "🔧 Testing connection..."

# Test the connection
export DATABASE_URL="postgresql://utilitix_user:utilitix123@localhost:5432/utilitix"
psql "$DATABASE_URL" -c "SELECT 'Connection successful!' as status;"

if [ $? -eq 0 ]; then
    echo "✅ Database connection working!"
    echo "🚀 Running database schema migration..."
    npm run db:push
    echo "✅ Setup complete! Your database is ready."
else
    echo "❌ Connection failed. Please check PostgreSQL installation."
fi