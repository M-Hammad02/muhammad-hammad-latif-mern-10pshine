const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword } = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const upload = require("../middlewares/upload");
const { updateUserValidation } = require('../validations/userValidation');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');


// Register user
router.post('/register',registerValidation, validate, register);

// Login user
router.post('/login',loginValidation, validate, login);

// Get current user profile
router.get('/me', authMiddleware, getProfile);

// Update user info
// router.put('/me', authMiddleware,updateUserValidation, validate, updateProfile);
router.put('/me', authMiddleware, updateProfile);

// Change password
router.put('/change-password', authMiddleware, changePassword);

// Change avatar
router.post('/change-avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const avatarUrl = `/uploads/${req.file.filename}`;
    console.log("🟢 Avatar file path:", avatarUrl);
    console.log("🟢 Authenticated user before update:", req.user);

    // Update user avatar in DB
    req.user.avatar = avatarUrl;
    await req.user.save();

    console.log("🟢 Updated user avatar:", req.user.avatar);

    res.json({ message: 'Avatar updated successfully', avatar: avatarUrl });
  } catch (err) {
    console.error('❌ Avatar upload error:', err);
    res.status(500).json({ message: 'Error changing avatar' });
  }
});


module.exports = router;
