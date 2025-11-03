import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE } from '../dataSource';
import { 
  getErrorMessage, 
  validatePassword, 
  validateUsername, 
  isValidEmail 
} from '../utils/validation';

const createUser = async (userData) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData),
    credentials: 'include'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  
  return response.json();
};

export default function CreateUser() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    role: 'Task Viewer'
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation
    const newErrors = { ...fieldErrors };

    if (name === 'username' && value) {
      const validation = validateUsername(value);
      if (!validation.isValid) {
        newErrors.username = validation.message;
      } else {
        delete newErrors.username;
      }
    }

    if (name === 'email' && value) {
      if (!isValidEmail(value)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordStrength(validation.message);
      if (!validation.isValid) {
        newErrors.password = validation.message;
      } else {
        delete newErrors.password;
      }

      // Check password match
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    }

    if (name === 'confirmPassword' && value) {
      if (value !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setFieldErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    const errors = {};

    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.message;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

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
      await createUser({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        role: formData.role
      });

      setSuccess(`User "${formData.username}" created successfully!`);
      toast.success(`User "${formData.username}" created successfully!`);
      
      // Reset form
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        role: 'Task Viewer'
      });
      setFieldErrors({});
      setPasswordStrength('');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(`Failed to create user: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-5">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Create New User</h2>
              
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

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username *</label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.username && (
                    <div className="invalid-feedback">{fieldErrors.username}</div>
                  )}
                  <small className="form-text text-muted">
                    3-50 characters, letters, numbers, underscores, and hyphens only
                  </small>
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

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password *</label>
                  <input
                    type="password"
                    className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.password && (
                    <div className="invalid-feedback">{fieldErrors.password}</div>
                  )}
                  {passwordStrength && !fieldErrors.password && (
                    <div className="text-success small mt-1">✓ Password strength: Good</div>
                  )}
                  <small className="form-text text-muted">
                    At least 6 characters with uppercase, lowercase, and number
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    className={`form-control ${fieldErrors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.confirmPassword && (
                    <div className="invalid-feedback">{fieldErrors.confirmPassword}</div>
                  )}
                  {formData.confirmPassword && !fieldErrors.confirmPassword && (
                    <div className="text-success small mt-1">✓ Passwords match</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-2"
                  disabled={loading}
                >
                  {loading ? 'Creating User...' : 'Create User'}
                </button>
                
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => navigate('/users')}
                  disabled={loading}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
