/// <reference types="vite/client" />
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Landing from './pages/Landing';
const Dashboard = lazy(() => import('./pages/Dashboard'));
import Login from './pages/Login';

// Real Google OAuth is enabled only when both flag and client ID are present.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_AUTH_ENABLED = import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true';
const useGoogleAuth = GOOGLE_AUTH_ENABLED && GOOGLE_CLIENT_ID.trim().length > 0;

// Auth Guard component to protect the dashboard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    // Redirect to the login page if they haven't verified through Google
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  const appRoutes = (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
  );

  if (!useGoogleAuth) {
    return appRoutes;
  }

  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{appRoutes}</GoogleOAuthProvider>;
}
