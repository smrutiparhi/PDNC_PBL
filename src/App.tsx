/// <reference types="vite/client" />
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Landing from './pages/Landing';
const Dashboard = lazy(() => import('./pages/Dashboard'));
import Login from './pages/Login';

// Requires VITE_GOOGLE_CLIENT_ID in .env or defaults to a mock for preview purposes
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1046187766205-1a2b3c4d5e6f7g8h9i0j.apps.googleusercontent.com';

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
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="min-h-screen bg-[#020202] text-zinc-500 flex items-center justify-center">Loading dashboard...</div>}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
