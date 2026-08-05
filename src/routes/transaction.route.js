const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

router.post('/', authMiddleware.authMiddleware, transactionController.createTransaction);


module.exports = router;

