import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isLoggedIn }) {

  if (isLoggedIn) {
    return children;
  } else {
    return <Navigate to='/login' replace />
  }

}

export default ProtectedRoute;
