const express = require('express')
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json());
app.use(cookieParser());

/**
 * - Routes Requires
 */
const authRoutes = require('./routes/auth.route')
const accountRoutes = require('./routes/account.route');
const transactionRoutes = require('./routes/transaction.route');
/**
 * - Routes Used
 */
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/transaction', transactionRoutes);







module.exports = app;