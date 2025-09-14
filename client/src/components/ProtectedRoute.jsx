import React from "react";
import { useRecoilValue } from "recoil";
import { Navigate, useLocation } from "react-router-dom";
import { userState } from "../state/atoms";

const ProtectedRoute = ({ children, requireRole = null }) => {
  const user = useRecoilValue(userState);
  const location = useLocation();

  if (!user.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireRole && user.user?.role !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
