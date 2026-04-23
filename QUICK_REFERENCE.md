# 🚀 TPS - Quick Reference Card

Print this or bookmark for quick access!

---

## ⚡ 3-STEP QUICK START

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd server && cp .env.example .env
npm install && npm run dev
# Server on http://localhost:5000
```

### 3. Frontend
```bash
cd client
npm install && npm run dev
# Frontend on http://localhost:3000
```

**Login with demo account**: admin@tps.com / (check schema.sql for password)

---

## 📚 Documentation Quick Links

| What? | Read This |
|-------|-----------|
| **New?** | INDEX.md or QUICKSTART.md |
| **Setup help** | CONFIGURATION.md |
| **Full details** | README.md |
| **How it works** | SYSTEM_OVERVIEW.md |
| **API calls** | API_DOCUMENTATION.md |
| **Deploy** | DEPLOYMENT.md |
| **File structure** | FILE_STRUCTURE.md |

---

## 🔑 Key Credentials

```
Role    Email              Password
-----   -----              --------
Admin   admin@tps.com      (check schema.sql)
Staff   staff@tps.com      (check schema.sql)
Customer customer1@tps.com (check schema.sql)
```

Or register a new account on the system!

---

## 📞 Common Commands

### Backend
```bash
cd server
npm run dev          # Start with nodemon
npm install          # Install dependencies
npm audit            # Check security
```

### Frontend
```bash
cd client
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm install          # Install dependencies
```

### Database
```bash
# Connect to MySQL
mysql -u root -p tps_db

# Import schema
mysql -u root -p < database/schema.sql

# Backup database
mysqldump -u root -p tps_db > backup.sql

# Restore database
mysql -u root -p tps_db < backup.sql
```

---

## 🌐 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web interface |
| Backend API | http://localhost:5000/api | REST API |
| Health Check | http://localhost:5000/api/health | API status |
| MySQL | localhost:3306 | Database |

---

## 📊 API Endpoints Summary

### Authentication
```
POST   /api/auth/register     - Create account
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Current user
```

### Customers
```
GET    /api/customers         - List all
POST   /api/customers         - Create
PUT    /api/customers/:id     - Update
DELETE /api/customers/:id     - Delete
GET    /api/customers/search  - Search
```

### Transactions
```
GET    /api/transactions      - List all
POST   /api/transactions      - Create
PATCH  /api/transactions/:id/status - Update status
DELETE /api/transactions/:id  - Delete
```

### Reports (Admin/Staff)
```
GET    /api/dashboard/stats   - Metrics
GET    /api/dashboard/reports/daily - Daily sales
GET    /api/dashboard/reports/monthly - Monthly sales
GET    /api/dashboard/export/transactions - Export CSV
```

---

## 🔒 Security Checklist

- [x] SQL injection prevention (prepared statements)
- [x] Password hashing (bcryptjs)
- [x] JWT authentication
- [x] Role-based access control
- [x] Input validation
- [x] CORS configured
- [x] Environment variables for secrets
- [x] Activity logging

---

## 🛠️ Technology Stack

**Backend**: Node.js + Express + MySQL + JWT  
**Frontend**: React 18 + Vite + Axios  
**Database**: MySQL (SQL-only, no NoSQL)  

---

## 📂 Key Files

| Purpose | File |
|---------|------|
| Main backend | server/server.js |
| DB connection | server/config/database.js |
| Auth logic | server/controllers/authController.js |
| Routes | server/routes/*.js |
| Main frontend | client/src/App.js |
| Pages | client/src/pages/*.js |
| API client | client/src/services/api.js |
| DB schema | database/schema.sql |

---

## ⚙️ Configuration

### .env Variables (Backend)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tps_db
JWT_SECRET=your_secret
JWT_EXPIRE=7d
```

### No other config needed!
Frontend auto-proxies to backend

---

## 🧪 Quick Test

```bash
# Test backend is running
curl http://localhost:5000/api/health

# Test frontend is running
curl http://localhost:3000

# Test database
mysql -u root -p tps_db -e "SELECT * FROM users;"
```

---

## 🎯 User Roles & Permissions

```
Admin    → Full access to everything
Staff    → Can manage data, view reports
Customer → Can create/view own transactions
```

---

## 📈 Common Tasks

### Create a Customer
1. Go to Customers page
2. Click "Add Customer"
3. Fill form and save

### Create a Transaction
1. Go to Transactions page
2. Click "New Transaction"
3. Select customer
4. Add items
5. Submit

### View Reports (Admin only)
1. Go to Reports page
2. View daily/monthly sales
3. Export data as CSV

### Check Activity Logs (Admin only)
1. Go to Activity Logs page
2. See all user actions

---

## 🐛 Troubleshooting Quick Guide

| Problem | Solution |
|---------|----------|
| Can't connect to DB | Check .env credentials, MySQL running? |
| Port in use | Kill process or change port |
| CORS error | Ensure backend is running |
| Login fails | Run database schema import |
| Frontend won't load | Check port 3000 available |
| No data showing | Create test data first |

---

## 📊 Project Stats

- **30+ API endpoints**
- **7 pages**
- **5 database tables**
- **8 CSS files**
- **100% SQL-based**
- **JWT secured**
- **Production ready**

---

## 🎓 Learning Resources

Study these to understand:
- **Full-stack**: server.js + App.js
- **SQL**: database/schema.sql
- **API**: API_DOCUMENTATION.md
- **Security**: middleware/auth.js
- **State**: services/AuthContext.js

---

## 🚀 Deployment (Quick)

For production:
1. Read DEPLOYMENT.md
2. Create .env with production values
3. Build frontend: `npm run build`
4. Start backend with PM2
5. Use Nginx as reverse proxy
6. Enable SSL/HTTPS
7. Setup database backups

---

## 📱 System Requirements

- Node.js v14+
- MySQL 5.7+
- npm/yarn
- 2GB disk space
- Ports 3000, 5000 available

---

## 🔄 Workflow

```
User → Frontend (React)
  ↓
 API (Express)
  ↓
Database (MySQL)
  ↓
Shows results in React
```

All requests include JWT token  
All responses come from MySQL

---

## 💡 Pro Tips

1. **Use localhost:3000** not 5000 (frontend handles API proxy)
2. **JWT in localStorage** persists login
3. **Prepared statements** prevent SQL injection
4. **Roles checked** on every request
5. **Logs recorded** for all actions

---

## 🎉 You're Ready!

Everything is set up and documented.  
Pick your starting point and begin!

---

## 📞 Need Help?

1. **Quick setup**: QUICKSTART.md
2. **Detailed docs**: README.md
3. **API reference**: API_DOCUMENTATION.md
4. **Troubleshooting**: CONFIGURATION.md
5. **Production**: DEPLOYMENT.md

---

**Version**: 1.0.0  
**Status**: Production Ready  
**Created**: April 2026

---

**Start now**: Go to localhost:3000 🚀
