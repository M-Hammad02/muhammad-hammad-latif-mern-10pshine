const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const { updateUserValidation } = require('../validations/userValidation');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const validate = require('../middlewares/validate');


// Register user
router.post('/register',registerValidation, validate, register);

// Login user
router.post('/login',loginValidation, validate, login);

// Get profile (protected route)
//router.get('/profile', authMiddleware, getProfile);

// Get current user profile
router.get('/me', authMiddleware, getProfile);

// Update user info
router.put('/me', authMiddleware,updateUserValidation, validate, updateProfile);


module.exports = router;
