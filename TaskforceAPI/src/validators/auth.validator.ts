import { body } from 'express-validator';

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

/**
 * Validation rules for user registration/creation
 */
export const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&'.]+$/).withMessage('Name can only contain letters, numbers, spaces, and common punctuation (&, -, \', .)'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('role')
    .optional()
    .isIn(['Manager', 'Production Lead', 'Supervisor', 'Task Viewer']).withMessage('Invalid role')
];

/**
 * Validation rules for password change
 */
export const changePasswordValidation = [
  body('currentPassword')
    .optional()
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

/**
 * Validation rules for updating user profile
 */
export const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&'.]+$/).withMessage('Name can only contain letters, numbers, spaces, and common punctuation (&, -, \', .)'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('role')
    .optional()
    .isIn(['Manager', 'Production Lead', 'Supervisor', 'Task Viewer']).withMessage('Invalid role')
];
