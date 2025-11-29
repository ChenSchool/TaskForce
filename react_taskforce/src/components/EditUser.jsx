import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserById, updateUser, changePassword } from '../api/users';
import { 
  getErrorMessage, 
  validatePassword, 
  isValidEmail 
} from '../utils/validation';

/**
 * EditUser component - Allows editing user profile information and changing passwords
 * Handles form validation, API calls, and user feedback
 */
export default function EditUser() {
  // Get user ID from URL parameters
  const { id } = useParams();
  
  // Form state for user information
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Task Viewer'
  });
  
  // Original user data from API
  const [userData, setUserData] = useState(null);
  
  // Error and success message states
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');
  
  // Loading states for async operations
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Password change form states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  
  const navigate = useNavigate();

  /**
   * Load user data on component mount
   * Fetches user details and populates the form
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoadingData(true);
        const user = await getUserById(id);
        setUserData(user);
        // Populate form with existing user data
        setFormData({
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'Task Viewer'
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoadingData(false);
      }
    };

    loadUser();
  }, [id]);

  /**
   * Handle changes to user information form fields
   * Performs real-time validation on email input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time email validation
    const newErrors = { ...fieldErrors };

    if (name === 'email' && value) {
      if (!isValidEmail(value)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }

    setFieldErrors(newErrors);
  };

  /**
   * Handle changes to password form fields
   * Validates password strength and confirms passwords match
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });

    const newErrors = { ...passwordErrors };

    // Validate new password strength
    if (name === 'newPassword') {
      const validation = validatePassword(value);
      setPasswordStrength(validation.message);
      if (!validation.isValid) {
        newErrors.newPassword = validation.message;
      } else {
        delete newErrors.newPassword;
      }

      // Check if passwords match when new password changes
      if (passwordData.confirmPassword && value !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    }

    // Validate password confirmation matches
    if (name === 'confirmPassword' && value) {
      if (value !== passwordData.newPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setPasswordErrors(newErrors);
  };

  /**
   * Handle user information form submission
   * Validates form data and updates user via API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate email format
    const errors = {};
    if (formData.email && !isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the validation errors before submitting');
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);

    try {
      // Update user information via API
      await updateUser(id, {
        name: formData.name,
        email: formData.email,
        role: formData.role
      });

      setSuccess('User updated successfully!');
      toast.success('User updated successfully!');

      // Redirect to users list after success
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(`Failed to update user: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle password change form submission
   * Validates all password fields and updates via API
   */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all password fields
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      errors.newPassword = passwordValidation.message;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      setError('Please fix the validation errors before submitting');
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);

    try {
      // Change password via API
      await changePassword(id, passwordData.currentPassword, passwordData.newPassword);

      setSuccess('Password changed successfully!');
      toast.success('Password changed successfully!');
      
      // Reset password form after successful change
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
      setPasswordStrength('');
      setShowPasswordChange(false);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(`Failed to change password: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching user data
  if (loadingData) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show error if user not found
  if (!userData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          User not found
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/users')}>
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8 col-lg-7">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="bi bi-person-gear me-2"></i>
                Edit User
              </h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              {/* User Information Form */}
              <form onSubmit={handleSubmit}>
                <h5 className="mb-3">User Information</h5>
                
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={userData.username}
                    disabled
                    readOnly
                  />
                  <small className="form-text text-muted">Username cannot be changed</small>
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {fieldErrors.email && (
                    <div className="invalid-feedback">{fieldErrors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Task Viewer">Task Viewer</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Manager">Manager</option>
                    <option value="Production Lead">Production Lead</option>
                  </select>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <i className="bi bi-save me-2"></i>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>

              {/* Password Change Section - Toggle between button and form */}
              <hr className="my-4" />
              
              {!showPasswordChange ? (
                <div className="text-center">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPasswordChange(true)}
                    disabled={loading}
                  >
                    <i className="bi bi-key me-2"></i>
                    Change Password
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit}>
                  <h5 className="mb-3">Change Password</h5>
                  
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password *</label>
                    <input
                      type="password"
                      className={`form-control ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    {passwordErrors.currentPassword && (
                      <div className="invalid-feedback">{passwordErrors.currentPassword}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password *</label>
                    <input
                      type="password"
                      className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    {passwordErrors.newPassword && (
                      <div className="invalid-feedback">{passwordErrors.newPassword}</div>
                    )}
                    {passwordStrength && !passwordErrors.newPassword && (
                      <div className="text-success small mt-1">Password strength: Good</div>
                    )}
                    <small className="form-text text-muted">
                      At least 6 characters with uppercase, lowercase, and number
                    </small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password *</label>
                    <input
                      type="password"
                      className={`form-control ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    {passwordErrors.confirmPassword && (
                      <div className="invalid-feedback">{passwordErrors.confirmPassword}</div>
                    )}
                    {passwordData.confirmPassword && !passwordErrors.confirmPassword && (
                      <div className="text-success small mt-1">Passwords match</div>
                    )}
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      <i className="bi bi-key me-2"></i>
                      {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        // Reset password form and hide section
                        setShowPasswordChange(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setPasswordErrors({});
                        setPasswordStrength('');
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Action Buttons */}
              <hr className="my-4" />
              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/users')}
                  disabled={loading}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Users
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
