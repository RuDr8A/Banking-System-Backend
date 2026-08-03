const express = require('express');
const authController = require('../controller/user.controller');
const { route } = require('../app');
const router = express.Router();


router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);







module.exports = router;