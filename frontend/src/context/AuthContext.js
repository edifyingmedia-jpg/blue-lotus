import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '../data/mock';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem('bluelotus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - in production, this would call the backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const userData = { ...mockUser, email };
          setUser(userData);
          localStorage.setItem('bluelotus_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const signup = async (name, email, password) => {
    // Mock signup
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const userData = { ...mockUser, name, email };
          setUser(userData);
          localStorage.setItem('bluelotus_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Please fill all fields'));
        }
      }, 500);
    });
  };

  const loginWithGoogle = async () => {
    // Mock Google login
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = mockUser;
        setUser(userData);
        localStorage.setItem('bluelotus_user', JSON.stringify(userData));
        resolve(userData);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bluelotus_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('bluelotus_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUser,
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
