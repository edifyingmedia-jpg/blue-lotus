import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user from token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('bluelotus_token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const text = await response.text();
            if (text) {
              const userData = JSON.parse(text);
              setUser(userData);
            }
          } else {
            localStorage.removeItem('bluelotus_token');
          }
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('bluelotus_token');
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Read response as text first to avoid "body stream already read" error
    const text = await response.text();
    
    if (!text) {
      throw new Error('Empty response from server');
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      const errorMessage = data.detail || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    // Store token and user
    localStorage.setItem('bluelotus_token', data.access_token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    setError(null);
    
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    // Read response as text first
    const text = await response.text();
    
    if (!text) {
      throw new Error('Empty response from server');
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      const errorMessage = data.detail || 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    // Store token and user
    localStorage.setItem('bluelotus_token', data.access_token);
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogle = async () => {
    setError('Google login is not yet implemented');
    throw new Error('Google login is not yet implemented');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bluelotus_token');
  };

  const updateUser = async (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    return updatedUser;
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('bluelotus_token');
    if (!token) return null;
    
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const text = await response.text();
        if (text) {
          const userData = JSON.parse(text);
          setUser(userData);
          return userData;
        }
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
    return null;
  };

  const getAuthToken = () => {
    return localStorage.getItem('bluelotus_token');
  };

  const authFetch = async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
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
  };

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
        isAuthenticated: !!user,
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
