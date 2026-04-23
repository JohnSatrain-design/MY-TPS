# Quick Start Guide

## 1️⃣ Database Setup (2 minutes)

```bash
# Open MySQL CLI
mysql -u root -p

# Run the schema
source /path/to/database/schema.sql

# Verify
USE tps_db;
SHOW TABLES;
```

## 2️⃣ Backend Setup (5 minutes)

```bash
cd server

# Create .env file
cp .env.example .env

# Install dependencies
npm install

# Start server
npm run dev
```

✅ Server running on `http://localhost:5000`

## 3️⃣ Frontend Setup (3 minutes)

```bash
cd client

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ Frontend running on `http://localhost:3000`

## 4️⃣ Login & Test

1. Open `http://localhost:3000` in browser
2. Click "Register" to create account OR use demo account
3. Login with credentials
4. Navigate through Dashboard, Customers, Transactions
5. Admin users can view Reports and Logs

## 📊 Quick Test Workflow

### As Admin/Staff:
1. **Dashboard** - See sales metrics
2. **Customers** - Create/edit customers
3. **Transactions** - Create transaction with items
4. **Reports** - View sales analytics
5. **Logs** - Check activity audit trail

### As Customer:
1. **Dashboard** - View overview
2. **Customers** - See own info
3. **Transactions** - Create/view transactions
4. **Cannot access**: Reports, Logs

## 🗂️ Project Files

### Must Configure
- `server/.env` - Database credentials

### Key Files
- `database/schema.sql` - Database structure
- `server/server.js` - Express app entry point
- `server/config/database.js` - MySQL connection pool
- `server/middleware/auth.js` - JWT & role checking
- `client/src/App.js` - React router & layout
- `client/src/services/api.js` - API client

## 🔧 Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to database" | Check DB_HOST, DB_USER, DB_PASSWORD in .env |
| "Cannot GET /api/..." | Backend not running? Check port 5000 |
| "Cannot login" | Ensure schema.sql was executed |
| "CORS error" | Clear browser cache, restart servers |

## 📝 MySQL Database

**Tables Created:**
- users (with roles)
- customers
- transactions
- transaction_items
- logs

**Demo Users:**
- admin@tps.com (Admin)
- staff@tps.com (Staff)
- customer1@tps.com (Customer)
- customer2@tps.com (Customer)

## 🎯 What to Try First

1. **Create a Customer**
   - Go to Customers page
   - Click "Add Customer"
   - Fill form and save

2. **Create a Transaction**
   - Go to Transactions page
   - Click "New Transaction"
   - Select customer
   - Add items with prices
   - Submit

3. **View Analytics** (Admin only)
   - Go to Reports
   - Check daily/monthly sales
   - Export CSV

4. **Check Logs** (Admin only)
   - Go to Activity Logs
   - See all user actions

## 💡 Tips

- Use different roles to test permissions
- Test search functionality on Customers page
- Try exporting data as CSV
- Change transaction status to see updates
- All data stored in MySQL - no external databases!

## 🚀 Next Steps

- Customize styling in `client/src/styles.css`
- Add more SQL queries in dashboard controller
- Integrate chart.js for visualizations
- Add email notifications
- Deploy to production

---

Ready to run? Start with **Database Setup** above! 🎉
