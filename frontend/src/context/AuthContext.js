import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AuthContext = createContext(null);

// Safe JSON parse helper
const safeParseJSON = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initRef = useRef(false);
  const loginInProgress = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initAuth = async () => {
      const token = localStorage.getItem('bluelotus_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await safeParseJSON(response);
          if (userData) setUser(userData);
        } else {
          localStorage.removeItem('bluelotus_token');
        }
      } catch (err) {
        console.error('Auth init failed:', err);
        localStorage.removeItem('bluelotus_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    if (loginInProgress.current) {
      return null;
    }
    loginInProgress.current = true;
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await safeParseJSON(response);

      if (!response.ok) {
        const errorMsg = data?.detail || 'Login failed';
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      if (data?.access_token) {
        localStorage.setItem('bluelotus_token', data.access_token);
        setUser(data.user);
        return data.user;
      }
      
      throw new Error('Invalid response from server');
    } finally {
      loginInProgress.current = false;
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await safeParseJSON(response);

      if (!response.ok) {
        const errorMsg = data?.detail || 'Signup failed';
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      if (data?.access_token) {
        localStorage.setItem('bluelotus_token', data.access_token);
        setUser(data.user);
        return data.user;
      }

      throw new Error('Invalid response from server');
    } catch (err) {
      throw err;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError('Google login is not yet implemented');
    throw new Error('Google login is not yet implemented');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('bluelotus_token');
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('bluelotus_token');
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await safeParseJSON(response);
        if (userData) {
          setUser(userData);
          return userData;
        }
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
    return null;
  }, []);

  const getAuthToken = useCallback(() => {
    return localStorage.getItem('bluelotus_token');
  }, []);

  const authFetch = useCallback(async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please login again.');
    }

    return response;
  }, [getAuthToken, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUser,
        refreshUser,
        getAuthToken,
        authFetch,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
