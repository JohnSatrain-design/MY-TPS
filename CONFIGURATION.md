# TPS System - Configuration & Verification Guide

## ✅ Pre-Installation Checklist

Before starting, ensure you have:

- [ ] Node.js v14+ installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] MySQL Server installed (`mysql --version`)
- [ ] 2GB free disk space
- [ ] Port 3000 available (frontend)
- [ ] Port 5000 available (backend)
- [ ] Port 3306 available (MySQL, if local)

---

## 🔧 Configuration Steps

### Step 1: Database Setup

**File**: `database/schema.sql`

```bash
# Option A: Using MySQL CLI
mysql -u root -p < database/schema.sql

# Option B: Direct MySQL
mysql -u root -p
source database/schema.sql;
```

**Verify:**
```bash
mysql -u root -p -e "USE tps_db; SHOW TABLES; DESCRIBE users;"
```

Expected tables: `users`, `customers`, `transactions`, `transaction_items`, `logs`

---

### Step 2: Backend Configuration

**Location**: `server/`

**Create .env file:**
```bash
cp server/.env.example server/.env
```

**Edit `server/.env`:**
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=              # Leave empty if no password
DB_NAME=tps_db
JWT_SECRET=your_secret_key_here_min_32_chars
JWT_EXPIRE=7d
API_BASE_URL=http://localhost:5000
```

**Install dependencies:**
```bash
cd server
npm install
```

**Verify installation:**
```bash
npm list --depth=0
```

Should show:
- express
- mysql2
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator

**Start backend:**
```bash
npm run dev
```

**Verify running:**
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"Server is running"}
```

---

### Step 3: Frontend Configuration

**Location**: `client/`

**Install dependencies:**
```bash
cd client
npm install
```

**Verify installation:**
```bash
npm list --depth=0
```

Should show:
- react
- react-dom
- react-router-dom
- axios

**Check build:**
```bash
npm run build
```

Should create `dist/` directory without errors.

**Start frontend:**
```bash
npm run dev
```

**Verify running:**
```bash
curl http://localhost:3000
```

Should return HTML

---

## 🧪 Post-Installation Tests

### Test 1: Database Connection

**Backend logs should show:**
```
Server is running on port 5000
```

**Test query:**
```bash
curl http://localhost:5000/api/health
```

### Test 2: Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Should return:
```json
{
  "message": "User registered successfully",
  "userId": 5,
  "role": "customer"
}
```

### Test 3: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Should return JWT token:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {...}
}
```

### Test 4: Protected Route

```bash
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/customers
```

Should return customer list (may be empty initially)

### Test 5: Frontend Access

Open browser to `http://localhost:3000`

Should see:
- [ ] Login page loads
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Dashboard appears after login
- [ ] Sidebar navigation visible
- [ ] Can navigate to other pages

---

## 📊 Database Verification

**Connect to MySQL:**
```bash
mysql -u root -p tps_db
```

**Check schema:**
```sql
-- Show all tables
SHOW TABLES;

-- Check users table
DESC users;
SELECT COUNT(*) FROM users;

-- Check customers table
DESC customers;

-- Check transactions
DESC transactions;

-- Check sample data
SELECT * FROM users LIMIT 5;
```

**Expected sample data:**
- 4 users (admin, staff, customer1, customer2)
- 2 customers

---

## 🔐 Security Configuration

### 1. Update JWT Secret

**In `server/.env`:**
```bash
# Generate secure secret
openssl rand -base64 32

# Update JWT_SECRET with output
JWT_SECRET=your_generated_secret_here
```

### 2. Change Demo Database Credentials

For production, create new MySQL user:

```sql
CREATE USER 'tps_prod'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON tps_db.* TO 'tps_prod'@'localhost';
FLUSH PRIVILEGES;
```

Update `.env`:
```env
DB_USER=tps_prod
DB_PASSWORD=strong_password_here
```

### 3. Enable CORS Restrictions

In production, update `server/server.js`:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## 🐛 Troubleshooting Configuration

### Issue: Cannot connect to database

**Check:**
1. Is MySQL running?
   ```bash
   mysql -u root -p -e "SELECT 1;"
   ```

2. Is database created?
   ```bash
   mysql -u root -p -e "SHOW DATABASES;" | grep tps_db
   ```

3. Check `.env` file:
   - DB_HOST matches `localhost` or IP
   - DB_USER exists
   - DB_PASSWORD is correct
   - DB_NAME is `tps_db`

**Fix:**
```bash
# Recreate database
mysql -u root -p < database/schema.sql
```

### Issue: Port 5000 already in use

**Find what's using it:**
```bash
# Linux/Mac
lsof -i :5000

# Windows
netstat -ano | findstr :5000
```

**Kill process:**
```bash
# Linux/Mac
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Issue: Frontend can't reach backend

**Check:**
1. Is backend running?
   ```bash
   curl http://localhost:5000/api/health
   ```

2. Check browser console (F12) for errors

3. Verify CORS is enabled in backend

4. Check Vite proxy config in `client/vite.config.js`

### Issue: Cannot login

**Check:**
1. Did you import the database schema?
   ```bash
   mysql -u root -p tps_db -e "SELECT COUNT(*) FROM users;"
   ```

2. Try registering a new user first

3. Check backend logs for errors

---

## 📈 Performance Verification

### Backend Performance

**Check response time:**
```bash
time curl http://localhost:5000/api/customers
```

Should respond in < 100ms

**Check memory usage:**
```bash
# Linux/Mac
ps aux | grep "node server.js"

# Should use < 100MB RAM initially
```

### Database Performance

**Check query speed:**
```sql
-- Time this query
SELECT c.*, COUNT(t.id) as transaction_count 
FROM customers c 
LEFT JOIN transactions t ON c.id = t.customer_id 
GROUP BY c.id;
```

Should complete in < 50ms

### Frontend Performance

**Check bundle size:**
```bash
cd client
npm run build
ls -lh dist/
```

Should be < 500KB for main bundle

---

## 🔄 Environment Variables Reference

**Backend (.env)**

| Variable | Purpose | Example |
|----------|---------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 3306 |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | (leave empty or enter) |
| DB_NAME | Database name | tps_db |
| JWT_SECRET | JWT signing key | (generated) |
| JWT_EXPIRE | Token expiry | 7d |
| API_BASE_URL | API URL | http://localhost:5000 |

**Frontend (Vite)**

Auto-configured in `vite.config.js`:
```javascript
proxy: {
  '/api': 'http://localhost:5000'
}
```

---

## ✅ Final Verification Checklist

- [ ] MySQL running and database created
- [ ] Backend .env file configured
- [ ] Backend dependencies installed
- [ ] Backend server running on port 5000
- [ ] Frontend dependencies installed
- [ ] Frontend server running on port 3000
- [ ] Can access `http://localhost:3000`
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Dashboard loads after login
- [ ] Can navigate to all pages
- [ ] Customers page loads
- [ ] Transactions page loads
- [ ] Reports page visible (admin)
- [ ] Logs page visible (admin)
- [ ] Can create customer
- [ ] Can create transaction
- [ ] Database has new records
- [ ] JWT tokens working
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

## 🚀 Next Steps

Once verified:

1. **Explore Features**
   - Create sample data
   - Test all CRUD operations
   - Try reports/exports

2. **Review Code**
   - Check backend controllers
   - Review React components
   - Study SQL queries

3. **Customize**
   - Modify colors/styling
   - Add new features
   - Integrate charts

4. **Deploy**
   - Follow `DEPLOYMENT.md`
   - Setup production .env
   - Configure database backups

---

## 📝 Configuration Summary

**Minimum required configuration:**
```
✓ MySQL with tps_db database
✓ server/.env with DB credentials
✓ client/ dependencies installed
✓ Both servers running on ports 5000 & 3000
```

**Verification command:**
```bash
# Run all checks
echo "Backend: "; curl -s http://localhost:5000/api/health | jq
echo "Frontend: "; curl -s http://localhost:3000 | head -1
echo "Database: "; mysql -u root -p -e "SHOW DATABASES" | grep tps_db
```

---

**Configuration Complete!** You're ready to use the TPS system. 🎉

For detailed information, see:
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick start guide
- `API_DOCUMENTATION.md` - API reference
- `DEPLOYMENT.md` - Production setup
