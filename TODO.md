# TPS Reward Points & Customer Modifications TODO

From approved plan (user confirmed self-register also creates record):

1. [] Update database/schema.sql: ADD COLUMN points INT UNSIGNED DEFAULT 0 to customers
2. [] Update server/seeder.js to INSERT points = 0
3. [] Modify server/controllers/transactionController.js: add points update in createTransaction and updateStatus (if 'completed')
4. [] Add server/controllers/customerController.js: registerCustomer function (staff/admin POST /customers/register: create user+customer)
5. [] Update server/routes/customers.js: POST /register (roleMiddleware staff/admin)
6. [] Update client/src/services/api.js: customerAPI.registerCustomer
7. [] Update client/src/pages/Transactions.js: canCheckout = user.role !== 'customer'
8. [] Update client/src/pages/Dashboard.js: for customer, show points (fetch from /auth/me or customers/me)
9. [] Update client/src/pages/Customers.js: add registerCustomer form (staff/admin)
10. [] Rerun seeder.js
11. [] Restart server
12. [] Test all flows
