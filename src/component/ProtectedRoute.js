import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles, userRole }) => {
  // 사용자 역할이 아직 설정되지 않았다면 로딩 중임을 고려하여 처리
  if (!userRole) {
    return null; // 또는 로딩 스피너를 표시할 수 있음
  }
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/notfound" />;
  }

  return element;
};

export default ProtectedRoute;
