# Utilitix - Free Online Tools Platform

A comprehensive web-based toolkit providing free, user-friendly online utilities for everyday digital tasks.

## 🚀 Features

- **Image Tools**: Resize, crop, convert, and optimize images
- **File Tools**: Convert file formats and compress multiple files
- **Text Tools**: Advanced text editor with syntax highlighting
- **Font Changer**: Transform text with beautiful fonts
- **Color Picker**: Professional color selection with multiple format support
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Ad Integration**: Ready for Google AdSense and Adsterra monetization

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **Deployment**: Production-ready for VPS hosting

## 📦 VPS Hosting Guide

### Prerequisites

Before starting, ensure your VPS has:
- Ubuntu 20.04+ or similar Linux distribution
- At least 1GB RAM and 10GB storage
- Root or sudo access

### Step 1: Connect to Your VPS

```bash
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

### Step 2: Install Required Software

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx (web server)
sudo apt install nginx -y

# No additional process managers needed

# Install Git
sudo apt install git -y
```

### Step 3: Setup PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell, run these commands:
CREATE DATABASE utilitix;
CREATE USER utilitix_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE utilitix TO utilitix_user;
ALTER USER utilitix_user CREATEDB;
\q

# Now connect to the utilitix database and grant schema permissions
sudo -u postgres psql -d utilitix

# Grant permissions on public schema:
GRANT ALL ON SCHEMA public TO utilitix_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO utilitix_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO utilitix_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO utilitix_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO utilitix_user;
\q
```

### Step 4: Clone and Setup Project

```bash
# Navigate to web directory
cd /var/www

# Clone your project (replace with your repository URL)
sudo git clone https://github.com/yourusername/utilitix.git
cd utilitix

# Set proper permissions
sudo chown -R $USER:$USER /var/www/utilitix

# Install dependencies and build
npm install
npm run build
```

### Step 5: Create Systemd Service (Production-Ready)

Create the systemd service file:

```bash
sudo nano /etc/systemd/system/utilitix.service
```

Add this exact content (copy/paste):

```ini
[Unit]
Description=Utilitix - Free Online Tools Platform
Documentation=https://github.com/yourusername/utilitix
After=network.target
Wants=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/utilitix
ExecStart=/usr/bin/node server/index.js
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=utilitix
Environment=NODE_ENV=production
Environment=PORT=3000
KillMode=mixed
KillSignal=SIGINT
TimeoutStopSec=20

[Install]
WantedBy=multi-user.target
```

Set proper permissions and start the service:

```bash
# Set proper ownership
sudo chown -R www-data:www-data /var/www/utilitix

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable utilitix
sudo systemctl start utilitix

# Verify service is running
sudo systemctl status utilitix
```

**Check logs if needed:**
```bash
# View live logs
sudo journalctl -u utilitix -f

# View recent logs
sudo journalctl -u utilitix --since "10 minutes ago"
```

### Step 6: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/utilitix
```

Add this bulletproof configuration (replace `your-domain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    # Health check (don't log)
    location = /health {
        proxy_pass http://localhost:3000;
        access_log off;
    }
    
    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }
    
    # All other routes (React app with client-side routing)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
        
        # Handle client-side routing fallback
        proxy_intercept_errors on;
        error_page 404 = @fallback;
    }
    
    # Fallback for client-side routing
    location @fallback {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and test configuration:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/utilitix /etc/nginx/sites-enabled/

# Remove default site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx
```

### Step 7: Setup SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Create SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Step 8: Verify Deployment

1. **Check application status:**
   ```bash
   sudo systemctl status utilitix
   ```

2. **Check Nginx status:**
   ```bash
   sudo systemctl status nginx
   ```

3. **Test the application:**
   ```bash
   # Test health endpoint
   curl http://localhost:3000/health
   
   # Test through Nginx
   curl http://localhost/health
   ```

4. **Visit your website:**
   - `http://your-domain.com`
   - Test navigation: `/color-picker`, `/image-converter`, etc.
   - Refresh pages to ensure routing works

5. **Monitor logs in real-time:**
   ```bash
   # Application logs
   sudo journalctl -u utilitix -f
   
   # Nginx logs
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

## 🔧 Management Commands

### Update Application

```bash
cd /var/www/utilitix
git pull origin main
npm install
npm run build
sudo systemctl restart utilitix
```

### Monitor Application

```bash
# View logs
sudo journalctl -u utilitix -f

# Check status
sudo systemctl status utilitix

# Restart application
sudo systemctl restart utilitix
```

### Database Management

```bash
# Access database
sudo -u postgres psql -d utilitix

# Backup database
pg_dump -U utilitix_user -h localhost utilitix > backup.sql

# Restore database
psql -U utilitix_user -h localhost utilitix < backup.sql
```

## 🚨 Troubleshooting

### Common Issues

1. **Service won't start:**
   ```bash
   # Check detailed logs
   sudo journalctl -u utilitix --no-pager
   
   # Check file permissions
   sudo chown -R www-data:www-data /var/www/utilitix
   
   # Verify Node.js path
   which node
   # Update ExecStart in service file if needed
   ```

2. **Port 3000 already in use:**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 PID_NUMBER
   sudo systemctl restart utilitix
   ```

3. **Nginx errors:**
   ```bash
   # Test configuration
   sudo nginx -t
   
   # Check error logs
   sudo tail -f /var/log/nginx/error.log
   
   # Restart services
   sudo systemctl restart nginx
   sudo systemctl restart utilitix
   ```

4. **Routing issues (404 on page refresh):**
   ```bash
   # Verify Nginx config has fallback location
   # Check application logs
   sudo journalctl -u utilitix -f
   ```

5. **SSL/HTTPS issues:**
   ```bash
   # Renew certificate
   sudo certbot renew --dry-run
   
   # Check certificate status
   sudo certbot certificates
   ```

## 📈 Performance Optimization

### Enable Gzip Compression

Add to Nginx configuration:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied expired no-cache no-store private must-revalidate auth;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### Setup Log Rotation

```bash
sudo nano /etc/logrotate.d/utilitix
```

Add:

```
/var/www/utilitix/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 www-data www-data
}
```

## 🔒 Security Recommendations

1. **Firewall Setup**
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

2. **Fail2ban** (Optional)
   ```bash
   sudo apt install fail2ban
   ```

3. **Regular Updates**
   ```bash
   sudo apt update && sudo apt upgrade
   npm audit fix
   ```

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review application logs: `pm2 logs utilitix`
- Check system logs: `sudo journalctl -u nginx`

## 📝 License

This project is licensed under the MIT License.