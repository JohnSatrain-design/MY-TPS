# Customer Self-POS TODO

Steps:
1. ✅ routes/transactions.js POST allow customer role
2. transactionController.js createTransaction scoped customer_id for customer role
3. authController.js getCurrentUser add customer data
4. Transactions.js customer role auto-customer POS
5. Restart server, test customer login /transactions buy

Progress: Complete! Customer POS enabled (self-checkout own account).
1. ✅ routes/transactions POST customer role
2. ✅ transactionController scoped customer_id customer role
3. ✅ authController.me customer data
4. ✅ Transactions.js customer auto customer POS
Test: Register/login customer → /transactions cart/checkout!
