const express = require('express');
const router = express.Router();
const accountController = require('../controller/account.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/create', authMiddleware.authMiddleware, accountController.createAccount);


module.exports = router;