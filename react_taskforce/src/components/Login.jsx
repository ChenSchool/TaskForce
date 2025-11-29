/**
 * Login page component.
 * Provides user authentication form with username/password validation, error handling, and toast notifications.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, validateUsername } from '../utils/validation';
import { toast } from 'react-toastify';

/**
 * Login form component with real-time username validation and authentication.
 */
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Handle username input changes with real-time validation feedback.
   */
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    
    if (value) {
      const validation = validateUsername(value);
      setUsernameError(validation.isValid ? '' : validation.message);
    } else {
      setUsernameError('');
    }
  };

  /**
   * Handle form submission with validation and authentication.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUsernameError('');

    // Client-side validation
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      setUsernameError(usernameValidation.message);
      return;
    }

    setLoading(true);

    try {
      await login(username, password, rememberMe);
      toast.success('Login successful! Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(`Login failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card login-card">
              <div className="card-body">
                <div className="login-icon">
                  <i className="bi bi-person-circle"></i>
                </div>
                <h2 className="text-center mb-4" style={{color: 'white'}}>TaskForce Login</h2>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label" style={{color: 'white'}}>Username</label>
                    <input
                      type="text"
                      className={`form-control ${usernameError ? 'is-invalid' : ''}`}
                      id="username"
                      value={username}
                      onChange={handleUsernameChange}
                      required
                      autoFocus
                      placeholder="Enter username"
                    />
                    {usernameError && (
                      <div className="invalid-feedback">{usernameError}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label" style={{color: 'white'}}>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter password"
                    />
                  </div>

                  <div className="mb-4 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe" style={{color: 'white'}}>
                      Remember me (stay logged in)
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <small style={{color: 'rgba(255,255,255,0.8)'}}>
                    Need an Account? Request from Admin
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
