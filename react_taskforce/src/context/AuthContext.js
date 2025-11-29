/**
 * Authentication Context
 * Manages user authentication state, tokens, and dark mode preferences
 * Provides login, logout, and role-based authorization throughout the app
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser, refreshToken } from '../api/auth';
import { updateDarkMode as apiUpdateDarkMode } from '../api/users';

const AuthContext = createContext(null);

/**
 * Custom hook to access authentication context
 * Must be used within AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider component
 * Wraps the application to provide authentication context
 */
export const AuthProvider = ({ children }) => {
  // User and token state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshTokenValue, setRefreshTokenValue] = useState(localStorage.getItem('refreshToken'));
  
  // Dark mode preference state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  /**
   * Check authentication status on component mount
   * Validates stored tokens and refreshes if needed
   */
  useEffect(() => {
    const checkAuth = async () => {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (storedAccessToken) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          // Sync dark mode from user data
          if (userData.dark_mode !== undefined) {
            setDarkMode(userData.dark_mode);
            localStorage.setItem('darkMode', JSON.stringify(userData.dark_mode));
          }
        } catch (error) {
          // Token might be expired, try to refresh
          if (storedRefreshToken) {
            try {
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshToken(storedRefreshToken);
              localStorage.setItem('accessToken', newAccessToken);
              localStorage.setItem('refreshToken', newRefreshToken);
              setAccessToken(newAccessToken);
              setRefreshTokenValue(newRefreshToken);
              
              const userData = await getCurrentUser();
              setUser(userData);
              // Sync dark mode from user data
              if (userData.dark_mode !== undefined) {
                setDarkMode(userData.dark_mode);
                localStorage.setItem('darkMode', JSON.stringify(userData.dark_mode));
              }
            } catch (refreshError) {
              // Refresh failed, clear everything
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              setAccessToken(null);
              setRefreshTokenValue(null);
              setUser(null);
            }
          } else {
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Login user with credentials
   * Stores tokens and user data in state and localStorage
   */
  const login = async (username, password) => {
    const data = await apiLogin(username, password);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setAccessToken(data.accessToken);
    setRefreshTokenValue(data.refreshToken);
    setUser(data.user);
    // Sync dark mode from user data
    if (data.user.dark_mode !== undefined) {
      setDarkMode(data.user.dark_mode);
      localStorage.setItem('darkMode', JSON.stringify(data.user.dark_mode));
    }
    return data;
  };

  /**
   * Logout user and clear all auth data
   */
  const logout = async () => {
    try {
      await apiLogout(refreshTokenValue);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setRefreshTokenValue(null);
      setUser(null);
    }
  };

  /**
   * Check if current user has required role(s)
   * @param {string|string[]} roles - Single role or array of roles
   */
  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') {
      return user.role === roles;
    }
    return roles.includes(user.role);
  };

  /**
   * Toggle dark mode and persist to backend
   */
  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    
    // Save to backend if user is logged in
    if (user?.id) {
      try {
        await apiUpdateDarkMode(user.id, newMode);
      } catch (error) {
        console.error('Failed to save dark mode preference:', error);
        // Preference is still saved locally, so we don't revert
      }
    }
  };

  /**
   * Apply dark mode theme to document when preference changes
   */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const value = {
    user,
    loading,
    accessToken,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user,
    darkMode,
    toggleDarkMode
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
