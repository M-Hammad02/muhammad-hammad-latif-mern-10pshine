const { body } = require('express-validator');

exports.registerValidation = [
  body('name')
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginValidation = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
