import { body, param } from 'express-validator';

/**
 * Validation for aircraft creation/update
 */
export const aircraftValidation = [
  body('tail_number')
    .trim()
    .notEmpty().withMessage('Tail number is required')
    .isLength({ min: 1, max: 20 }).withMessage('Tail number must be between 1 and 20 characters')
    .matches(/^[A-Z0-9-]+$/).withMessage('Tail number can only contain uppercase letters, numbers, and hyphens')
];

/**
 * Validation for tasks creation/update
 */
export const taskValidation = [
  body('aircraft_id')
    .notEmpty().withMessage('Aircraft ID is required')
    .isInt({ min: 1 }).withMessage('Aircraft ID must be a positive integer'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 3, max: 500 }).withMessage('Description must be between 3 and 500 characters'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Incomplete', 'Complete']).withMessage('Status must be Incomplete or Complete'),
  
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
  
  body('shift')
    .notEmpty().withMessage('Shift is required')
    .isIn(['1st', '2nd', '3rd']).withMessage('Shift must be 1st, 2nd, or 3rd')
];

/**
 * Validation for personnel creation/update
 */
export const personnelValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&'.]+$/).withMessage('Name can only contain letters, numbers, spaces, and common punctuation (&, -, \', .)'),
  
  body('role')
    .trim()
    .notEmpty().withMessage('Role is required')
    .isLength({ min: 2, max: 100 }).withMessage('Role must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&'.]+$/).withMessage('Role can only contain letters, numbers, spaces, and common punctuation (&, -, \', .)'),
  
  body('specialty')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Specialty must be less than 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&'.,/]+$/).withMessage('Specialty can only contain letters, numbers, spaces, and common punctuation (&, -, \', ., ,, /)'),
  
  body('shift')
    .notEmpty().withMessage('Shift is required')
    .isIn(['1st', '2nd', '3rd']).withMessage('Shift must be 1st, 2nd, or 3rd')
];

/**
 * Validation for assignments creation/update
 */
export const assignmentValidation = [
  body('task_id')
    .notEmpty().withMessage('Task ID is required')
    .isInt({ min: 1 }).withMessage('Task ID must be a positive integer'),
  
  body('lines')
    .notEmpty().withMessage('Lines array is required')
    .isArray({ min: 1 }).withMessage('At least one personnel assignment is required'),
  
  body('lines.*.personnel_id')
    .notEmpty().withMessage('Personnel ID is required')
    .isInt({ min: 1 }).withMessage('Personnel ID must be a positive integer'),
  
  body('lines.*.role')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Role must be less than 50 characters')
];

/**
 * Validation for training creation/update
 */
export const trainingValidation = [
  body('personnel_id')
    .notEmpty().withMessage('Personnel ID is required')
    .isInt({ min: 1 }).withMessage('Personnel ID must be a positive integer'),
  
  body('phase')
    .trim()
    .notEmpty().withMessage('Phase is required')
    .isLength({ max: 100 }).withMessage('Phase must be less than 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&'.,/]+$/).withMessage('Phase can only contain letters, numbers, spaces, and common punctuation (&, -, \', ., ,, /)'),
  
  body('progress')
    .notEmpty().withMessage('Progress is required')
    .isInt({ min: 0, max: 100 }).withMessage('Progress must be an integer between 0 and 100'),
  
  body('complete')
    .notEmpty().withMessage('Complete status is required')
    .isBoolean().withMessage('Complete must be true or false')
];

/**
 * Validation for archive creation
 */
export const archiveValidation = [
  body('shift')
    .notEmpty().withMessage('Shift is required')
    .isIn(['1st', '2nd', '3rd']).withMessage('Shift must be 1st, 2nd, or 3rd'),
  
  body('aircraft_tail')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('Aircraft tail must be less than 20 characters'),
  
  body('cutoff_date')
    .optional()
    .isISO8601().withMessage('Cutoff date must be in ISO 8601 format (YYYY-MM-DD)')
];

/**
 * Validation for archive schedule creation/update
 */
export const archiveScheduleValidation = [
  body('schedule_time')
    .trim()
    .notEmpty().withMessage('Schedule time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Schedule time must be in HH:MM:SS format (24-hour)'),
  
  body('shift')
    .notEmpty().withMessage('Shift is required')
    .isIn(['1st', '2nd', '3rd']).withMessage('Shift must be 1st, 2nd, or 3rd'),
  
  body('enabled')
    .optional()
    .isBoolean().withMessage('Enabled must be true or false')
];

/**
 * Validation for manual archive request
 */
export const manualArchiveValidation = [
  body('shift')
    .notEmpty().withMessage('Shift is required')
    .isIn(['1st', '2nd', '3rd']).withMessage('Shift must be 1st, 2nd, or 3rd')
];

/**
 * Validation for ID parameters
 */
export const idParamValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID must be a positive integer')
];
