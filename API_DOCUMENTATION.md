# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

Tokens are obtained by logging in and are valid for 7 days.

---

## 🔐 Authentication Endpoints

### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "customer"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": 5,
  "role": "customer"
}
```

---

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### Get Current User
```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "created_at": "2024-04-22T10:30:00Z"
  }
}
```

---

## 👥 Customer Endpoints

### Get All Customers
```
GET /customers
```

**Response:**
```json
{
  "total": 2,
  "customers": [
    {
      "id": 1,
      "name": "John Doe",
      "contact": "555-1234",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "created_at": "2024-04-22T10:00:00Z"
    }
  ]
}
```

---

### Get Customer by ID
```
GET /customers/:id
```

**Response:**
```json
{
  "customer": {
    "id": 1,
    "name": "John Doe",
    "contact": "555-1234",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001"
  }
}
```

---

### Create Customer (Admin/Staff only)
```
POST /customers
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "contact": "555-5678",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "postal_code": "90001"
}
```

**Response:**
```json
{
  "message": "Customer created successfully",
  "customer": {
    "id": 3,
    "name": "Jane Smith",
    "contact": "555-5678",
    "address": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "postal_code": "90001",
    "created_at": "2024-04-22T10:30:00Z"
  }
}
```

---

### Update Customer (Admin/Staff only)
```
PUT /customers/:id
```

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "contact": "555-9999",
  "address": "789 Pine Rd",
  "city": "Los Angeles",
  "state": "CA",
  "postal_code": "90002"
}
```

---

### Delete Customer (Admin only)
```
DELETE /customers/:id
```

---

### Search Customers
```
GET /customers/search?query=john
```

---

## 💳 Transaction Endpoints

### Get All Transactions
```
GET /transactions
```

**Response:**
```json
{
  "total": 5,
  "transactions": [
    {
      "id": 1,
      "customer_id": 1,
      "total_amount": "150.50",
      "status": "completed",
      "created_at": "2024-04-22T10:00:00Z",
      "customer_name": "John Doe"
    }
  ]
}
```

---

### Get Transaction by ID
```
GET /transactions/:id
```

**Response:**
```json
{
  "transaction": {
    "id": 1,
    "customer_id": 1,
    "total_amount": "150.50",
    "status": "completed",
    "created_at": "2024-04-22T10:00:00Z",
    "customer_name": "John Doe"
  },
  "items": [
    {
      "id": 1,
      "product_name": "Product A",
      "quantity": 2,
      "price": "50.00"
    },
    {
      "id": 2,
      "product_name": "Product B",
      "quantity": 1,
      "price": "50.50"
    }
  ]
}
```

---

### Create Transaction
```
POST /transactions
```

**Request Body:**
```json
{
  "customer_id": 1,
  "items": [
    {
      "product_name": "Product A",
      "quantity": 2,
      "price": 50.00
    },
    {
      "product_name": "Product B",
      "quantity": 1,
      "price": 50.50
    }
  ]
}
```

**Response:**
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": 6,
    "customer_id": 1,
    "total_amount": "150.50",
    "status": "pending",
    "created_at": "2024-04-22T10:30:00Z",
    "customer_name": "John Doe"
  }
}
```

---

### Update Transaction Status (Admin/Staff only)
```
PATCH /transactions/:id/status
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Valid Statuses:**
- `pending`
- `completed`
- `cancelled`

---

### Get Customer Transactions
```
GET /transactions/customer/:customerId
```

---

### Delete Transaction (Admin only)
```
DELETE /transactions/:id
```

---

## 📊 Dashboard Endpoints

### Get Dashboard Statistics (Admin/Staff only)
```
GET /dashboard/stats
```

**Response:**
```json
{
  "total_sales": 1250.50,
  "total_transactions": 8,
  "total_customers": 2,
  "pending_transactions": 2
}
```

---

### Get Recent Transactions
```
GET /dashboard/transactions/recent?limit=10&offset=0
```

---

### Get Daily Sales Report (Admin/Staff only)
```
GET /dashboard/reports/daily
```

**Response:**
```json
{
  "total": 5,
  "report": [
    {
      "date": "2024-04-22",
      "transaction_count": 3,
      "daily_sales": "450.75"
    }
  ]
}
```

---

### Get Monthly Sales Report (Admin/Staff only)
```
GET /dashboard/reports/monthly
```

**Response:**
```json
{
  "total": 1,
  "report": [
    {
      "month": "2024-04",
      "transaction_count": 8,
      "monthly_sales": "1250.50"
    }
  ]
}
```

---

### Get Sales by Status (Admin/Staff only)
```
GET /dashboard/reports/status
```

**Response:**
```json
{
  "report": [
    {
      "status": "completed",
      "count": 6,
      "amount": "1000.00"
    },
    {
      "status": "pending",
      "count": 2,
      "amount": "250.50"
    },
    {
      "status": "cancelled",
      "count": 0,
      "amount": "0.00"
    }
  ]
}
```

---

### Get Top Customers (Admin/Staff only)
```
GET /dashboard/customers/top?limit=10
```

**Response:**
```json
{
  "total": 2,
  "customers": [
    {
      "id": 1,
      "name": "John Doe",
      "contact": "555-1234",
      "transaction_count": 5,
      "total_spent": "750.00"
    }
  ]
}
```

---

### Get Activity Logs (Admin only)
```
GET /dashboard/logs/activity?limit=50&offset=0
```

**Response:**
```json
{
  "total": 10,
  "logs": [
    {
      "id": 1,
      "user_id": 1,
      "action": "User login",
      "entity_type": "user",
      "entity_id": 1,
      "created_at": "2024-04-22T10:30:00Z",
      "user_name": "Admin User"
    }
  ]
}
```

---

### Export Transactions (Admin/Staff only)
```
GET /dashboard/export/transactions
```

**Response:** CSV file download

---

## 🔑 Role-Based Access Control

### Admin
- ✅ All endpoints
- ✅ Dashboard statistics
- ✅ Reports
- ✅ Activity logs
- ✅ Delete operations

### Staff
- ✅ Dashboard statistics
- ✅ Reports
- ✅ Export data
- ✅ Create/update customers
- ✅ Create/update transactions
- ❌ Delete operations
- ❌ Activity logs

### Customer
- ✅ Dashboard overview
- ✅ View customers
- ✅ Create/view own transactions
- ❌ Admin functions
- ❌ Reports
- ❌ Logs

---

## 📋 Error Responses

### 400 Bad Request
```json
{
  "error": "Customer name is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Customer not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create customer"
}
```

---

## 🧪 Example API Calls

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tps.com",
    "password": "password123"
  }'
```

**Get All Transactions:**
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/transactions
```

**Create Customer:**
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Customer",
    "contact": "555-9999",
    "city": "New York",
    "state": "NY"
  }'
```

---

## 📊 SQL Queries in Use

Each endpoint leverages SQL queries:

- **GET** - SELECT with WHERE, JOIN
- **POST** - INSERT with FOREIGN KEYS
- **PUT** - UPDATE with WHERE
- **DELETE** - DELETE with WHERE
- **Reports** - GROUP BY, SUM, COUNT, ORDER BY

All queries use prepared statements to prevent SQL injection.
