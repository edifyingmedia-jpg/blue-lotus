import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../runtime/auth';

export default function ProtectedRoute({ children }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to='/screen/login' replace />;
  }

  return children;
}

