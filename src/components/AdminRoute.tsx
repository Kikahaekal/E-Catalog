// src/components/AdminRoute.tsx
import { hasAdminSession, subscribeAuthSession } from '../utils/authSession';
import React, { useSyncExternalStore } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const authorized = useSyncExternalStore(subscribeAuthSession, hasAdminSession, () => false);

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
