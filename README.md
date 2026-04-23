# Transaction Processing System (TPS)

A full-stack transaction processing system with real-time customer interaction and transaction handling using a strictly SQL-based relational database (MySQL).

## 🏗️ Project Structure

```
TPS/
├── server/              # Node.js + Express backend
│   ├── config/         # Database & configuration
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth, logging
│   ├── routes/         # API endpoints
│   ├── server.js       # Main server file
│   ├── package.json
│   └── .env.example
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API & auth logic
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── database/
    └── schema.sql      # MySQL database schema
```

## 🗄️ Database Schema (MySQL)

The system uses a fully normalized relational database with the following tables:

- **users**: User accounts with roles (admin, staff, customer)
- **customers**: Customer information
- **transactions**: Transaction records linked to customers
- **transaction_items**: Individual items in transactions
- **logs**: Audit logs for system activity

All tables use proper:
- Primary keys (AUTO_INCREMENT)
- Foreign key relationships
- Indexes for performance
- Prepared statements for security

## ⚙️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (mysql2/promise)
- **Authentication**: JWT
- **Password Hashing**: bcryptjs

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

### 1. Database Setup

```bash
# Create the database
mysql -u root -p < database/schema.sql
```

Or manually:
1. Open MySQL CLI
2. Run the SQL commands from `database/schema.sql`

### 2. Backend Setup

```bash
cd server

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Install dependencies
npm install

# Start the server
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📝 Environment Variables

Create `.env` file in the `server/` directory:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tps_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
API_BASE_URL=http://localhost:5000
```

## 👥 Demo Credentials

The database comes pre-populated with demo users:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tps.com | (hashed in DB) |
| Staff | staff@tps.com | (hashed in DB) |
| Customer | customer1@tps.com | (hashed in DB) |
| Customer | customer2@tps.com | (hashed in DB) |

For testing, use any email with password: `password123` (after registration)

## 🔑 Core Features

### 1. Authentication System
- Secure registration & login
- JWT token-based authentication
- Role-based access control
- Password hashing with bcryptjs

### 2. Customer Management
- Add, edit, delete customers
- Search functionality (using SQL LIKE)
- View customer details
- Full contact information storage

### 3. Transaction Processing
- Create transactions with multiple items
- Automatic total calculation
- Transaction status management (pending, completed, cancelled)
- Delete transactions

### 4. Admin Dashboard
- Key metrics (total sales, transaction count, etc.)
- Recent transactions display
- Role-based data visibility

### 5. Reports & Analytics
- Daily sales reports (using DATE grouping)
- Monthly sales reports
- Sales by status breakdown
- Top customers ranking
- CSV export functionality

### 6. Activity Logging
- Audit trail for all actions
- User action tracking
- System-wide event logging

## 🔒 Security Features

- **SQL Injection Prevention**: Prepared statements for all queries
- **Password Security**: bcryptjs hashing
- **Authentication**: JWT tokens
- **Authorization**: Role-based access control
- **Input Validation**: Server-side validation
- **CORS**: Enabled for frontend communication

## 📊 SQL Queries Used

The system actively uses:

- **SELECT**: Retrieve data from tables
- **INSERT**: Add new records
- **UPDATE**: Modify existing records
- **DELETE**: Remove records
- **JOIN**: Combine data from multiple tables
- **GROUP BY**: Aggregate data (sales reports)
- **ORDER BY**: Sort results
- **WHERE**: Filter data with complex conditions
- **SUM/COUNT**: Aggregate functions
- **LIKE**: Pattern matching for search
- **LIMIT/OFFSET**: Pagination

## 🛣️ API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
```

### Customers
```
GET    /api/customers          - Get all customers
GET    /api/customers/:id      - Get customer by ID
POST   /api/customers          - Create customer
PUT    /api/customers/:id      - Update customer
DELETE /api/customers/:id      - Delete customer
GET    /api/customers/search   - Search customers
```

### Transactions
```
GET    /api/transactions       - Get all transactions
GET    /api/transactions/:id   - Get transaction details
POST   /api/transactions       - Create transaction
PATCH  /api/transactions/:id/status - Update status
GET    /api/transactions/customer/:customerId - Get customer transactions
DELETE /api/transactions/:id   - Delete transaction
```

### Dashboard & Reports
```
GET    /api/dashboard/stats                - Dashboard statistics
GET    /api/dashboard/transactions/recent  - Recent transactions
GET    /api/dashboard/reports/daily        - Daily sales report
GET    /api/dashboard/reports/monthly      - Monthly sales report
GET    /api/dashboard/reports/status       - Sales by status
GET    /api/dashboard/customers/top        - Top customers
GET    /api/dashboard/logs/activity        - Activity logs
GET    /api/dashboard/export/transactions  - Export to CSV
```

## 🎨 UI Features

- **Responsive Design**: Mobile-friendly interface
- **Sidebar Navigation**: Easy menu navigation
- **Status Badges**: Visual status indicators
- **Tables**: Clean, sortable data display
- **Forms**: Input validation and feedback
- **Charts Ready**: Structure for Chart.js integration
- **Dark/Light Ready**: CSS variable system

## 📱 Page Structure

### Public Pages
- **Login** - User authentication
- **Register** - New user registration

### Protected Pages
- **Dashboard** - Overview & recent activity
- **Customers** - Customer management (CRUD)
- **Transactions** - Transaction management
- **Reports** - Analytics & exports (staff+)
- **Activity Logs** - Audit trail (admin only)

## 🔄 Data Flow

1. User logs in via React frontend
2. Backend validates credentials against MySQL
3. JWT token issued for future requests
4. Frontend stores token in localStorage
5. All API calls include JWT in Authorization header
6. Backend validates token and processes SQL queries
7. Results returned and displayed in React components

## 🧪 Testing

### Test Transaction Flow
1. Log in as customer
2. Go to Transactions
3. Click "New Transaction"
4. Select a customer
5. Add items with prices
6. Submit transaction
7. View in Recent Transactions

### Test Reports (Admin/Staff)
1. Log in as admin/staff
2. Go to Reports
3. View daily/monthly sales
4. Check top customers
5. Export data as CSV

## 🐛 Troubleshooting

### Database Connection Error
```
Check .env database credentials
Ensure MySQL is running
Verify database name matches config
```

### API Not Responding
```
Check backend is running on port 5000
Verify CORS is enabled
Check network tab in browser console
```

### Frontend Not Loading
```
Verify frontend is running on port 3000
Check Vite server logs
Clear browser cache
```

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [JWT Overview](https://jwt.io/)

## 📄 License

This project is provided as-is for educational purposes.

## 🤝 Support

For issues or questions, please check:
1. The error message in browser console
2. Backend server logs
3. MySQL error logs
4. Ensure all prerequisites are installed

---

**Version**: 1.0.0  
**Last Updated**: April 2026
