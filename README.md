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

# Install PM2 (process manager)
sudo npm install -g pm2

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

# Install dependencies
npm install

# Build the project
npm run build
```

### Step 5: Environment Configuration

Create environment file:

```bash
sudo nano .env.production
```

Add these variables (replace with your actual values):

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://utilitix_user:your_secure_password_here@localhost:5432/utilitix
```

### Step 6: Setup Database Schema

```bash
# Push database schema
npm run db:push
```

### Step 7: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/utilitix
```

Add this configuration (replace `your-domain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/utilitix /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Start Application with PM2

```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it gives you
```

### Step 9: Setup SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Create SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Step 10: Verify Deployment

1. Check if the application is running: `pm2 status`
2. Check Nginx status: `sudo systemctl status nginx`
3. Visit your domain in a browser

## 🔧 Management Commands

### Update Application

```bash
cd /var/www/utilitix
git pull origin main
npm install
npm run build
pm2 restart utilitix
```

### Monitor Application

```bash
# View logs
pm2 logs utilitix

# Monitor status
pm2 monit

# Restart application
pm2 restart utilitix
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

1. **Port 3000 already in use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 PID_NUMBER
   ```

2. **Permission denied errors**
   ```bash
   sudo chown -R $USER:$USER /var/www/utilitix
   ```

3. **Database connection failed**
   - Check PostgreSQL is running: `sudo systemctl status postgresql`
   - Verify database credentials in `.env.production`

4. **Nginx errors**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   tail -f /var/log/nginx/error.log
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