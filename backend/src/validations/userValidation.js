const { body } = require('express-validator');

exports.updateUserValidation = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email')
    .optional()
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
];
