# Deployment Guide

This guide covers deploying the Transaction Processing System to production.

## Prerequisites

- Linux/Windows server with Node.js installed
- MySQL server (can be same server or remote)
- Domain name (optional)
- SSL certificate (recommended)

## 🚀 Production Deployment

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
sudo apt install nodejs npm -y

# Install MySQL (if not already installed)
sudo apt install mysql-server -y

# Create application directory
sudo mkdir -p /var/www/tps
cd /var/www/tps
```

### 2. Clone/Transfer Code

```bash
# Option 1: Clone from git
git clone <repo-url> .

# Option 2: Upload files via SCP
scp -r server user@server:/var/www/tps/
scp -r client user@server:/var/www/tps/
```

### 3. Setup Backend

```bash
cd /var/www/tps/server

# Install dependencies
npm install --production

# Create .env with production values
cat > .env << EOF
PORT=5000
NODE_ENV=production

DB_HOST=localhost
DB_PORT=3306
DB_USER=tps_user
DB_PASSWORD=strong_password_here
DB_NAME=tps_db

JWT_SECRET=your_very_long_secret_key_min_32_chars
JWT_EXPIRE=7d

API_BASE_URL=https://yourdomain.com
EOF

# Set proper permissions
chmod 600 .env
chown -R www-data:www-data /var/www/tps
```

### 4. Setup Frontend

```bash
cd /var/www/tps/client

# Install dependencies
npm install --production

# Build for production
npm run build

# This creates a 'dist' directory with optimized files
```

### 5. Configure Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/tps
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificate (using Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend - React app
    location / {
        root /var/www/tps/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript 
               application/json application/javascript 
               application/x-javascript text/xml application/xml;
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/tps /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Setup SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is enabled by default
sudo systemctl enable certbot.timer
```

### 7. Setup Database

```bash
# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE tps_db;
CREATE USER 'tps_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON tps_db.* TO 'tps_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u tps_user -p tps_db < /var/www/tps/database/schema.sql
```

### 8. Setup PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the backend with PM2
cd /var/www/tps/server
pm2 start server.js --name "tps-backend" --instances max

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup systemd -u www-data --hp /var/www/tps

# Verify it's running
pm2 list
```

### 9. Database Backups

**Automated daily backup:**

```bash
# Create backup script
sudo nano /usr/local/bin/tps-backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/tps"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

mysqldump -u tps_user -p'strong_password_here' tps_db | \
  gzip > $BACKUP_DIR/tps_db_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -mtime +30 -delete
```

**Make it executable and add to cron:**

```bash
sudo chmod +x /usr/local/bin/tps-backup.sh

# Edit crontab
sudo crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * /usr/local/bin/tps-backup.sh
```

### 10. Monitoring & Logging

**Check logs:**

```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

**Monitor system resources:**

```bash
# Install monitoring tools
sudo apt install htop iotop -y

# View real-time stats
htop
```

## 🔐 Security Best Practices

### 1. Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny all other incoming
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### 2. Environment Variables

```bash
# Use strong secrets
JWT_SECRET=generate_with: openssl rand -base64 32

# Restrict file permissions
chmod 600 .env
chown www-data:www-data .env
```

### 3. Database Security

```sql
-- Create limited database user
CREATE USER 'tps_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON tps_db.* TO 'tps_user'@'localhost';

-- Don't use root account in production
-- Regularly update passwords
```

### 4. Enable CORS Restrictions

In `server/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
```

### 5. Rate Limiting

Add to backend:

```bash
npm install express-rate-limit
```

In `server/server.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

## 📊 Performance Optimization

### Frontend Optimization

```bash
# Build with Vite optimization
npm run build

# Check bundle size
npm install -g vite-plugin-visualizer
```

### Backend Optimization

1. **Enable database connection pooling** (already configured)
2. **Add redis caching** for frequently accessed data
3. **Implement query optimization** - add more indexes
4. **Use CDN** for static assets

### Database Optimization

```sql
-- Analyze tables
ANALYZE TABLE users, customers, transactions, transaction_items, logs;

-- Check slow query log
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';

-- Optimize tables
OPTIMIZE TABLE users, customers, transactions, transaction_items, logs;
```

## 📈 Scaling Strategies

### Vertical Scaling
- Increase server RAM
- Upgrade CPU
- Use faster SSD storage

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Multiple backend instances
- Database replication/clustering

**Example load balancer config:**

```nginx
upstream tps_backend {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

location /api {
    proxy_pass http://tps_backend;
}
```

## 🔍 Health Checks

Add health check endpoint in `server/server.js`:

```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

Monitor with:

```bash
curl https://yourdomain.com/api/health
```

## 📝 Maintenance

### Regular Tasks

- **Weekly**: Check logs for errors
- **Monthly**: Review user activity
- **Quarterly**: Database optimization
- **Yearly**: Security audit

### Updates

```bash
# Check for npm updates
npm outdated

# Update packages safely
npm update

# Security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

## Troubleshooting

### Backend won't start
```bash
pm2 logs tps-backend
# Check port 5000 is available
netstat -tlnp | grep 5000
```

### Database connection issues
```bash
# Test connection
mysql -u tps_user -p -h localhost tps_db
```

### High memory usage
```bash
# Check processes
pm2 monit

# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=4096 pm2 start server.js
```

---

**Deployment Checklist:**
- [ ] Server provisioned
- [ ] Node.js & MySQL installed
- [ ] Code deployed
- [ ] .env configured
- [ ] Database imported
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] PM2 started
- [ ] Backups configured
- [ ] Firewall enabled
- [ ] Tested endpoints
- [ ] Monitoring enabled

For support, check logs and verify each component is running.
