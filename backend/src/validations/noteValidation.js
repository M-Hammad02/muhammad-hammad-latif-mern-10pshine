const { body, param } = require('express-validator');

exports.createNoteValidation = [
  body('title')
    .isString().withMessage('Title must be text')
    .trim()
    .notEmpty().withMessage('Title is required'),
  body('content')
    .isString().withMessage('Content must be text')
    .trim()
    .notEmpty().withMessage('Content is required'),
];

exports.updateNoteValidation = [
  param('id').isInt().withMessage('Note ID must be a valid integer'),
  body('title')
    .optional()
    .isString().withMessage('Title must be text')
    .trim(),
  body('content')
    .optional()
    .isString().withMessage('Content must be text')
    .trim(),
];
