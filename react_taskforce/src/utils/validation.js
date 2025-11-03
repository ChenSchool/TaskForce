/**
 * Display validation errors from backend API
 * @param {Object} error - Error object from API response
 * @returns {String} - Formatted error message
 */
export const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    
    // Handle validation errors
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map(err => err.message).join(', ');
    }
    
    // Handle single message
    if (data.message) {
      return data.message;
    }
  }
  
  // Fallback
  return error.message || 'An error occurred';
};

/**
 * Validate required fields before submission
 * @param {Object} data - Form data
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - {isValid: boolean, errors: Object}
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')} is required`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate email format
 * @param {String} email
 * @returns {Boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {String} password
 * @returns {Object} - {isValid: boolean, message: string}
 */
export const validatePassword = (password) => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate username format
 * @param {String} username
 * @returns {Object} - {isValid: boolean, message: string}
 */
export const validateUsername = (username) => {
  if (username.length < 3 || username.length > 50) {
    return { isValid: false, message: 'Username must be between 3 and 50 characters' };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  
  return { isValid: true, message: '' };
};
