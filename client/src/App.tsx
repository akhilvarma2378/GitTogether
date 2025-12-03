import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ManageProject from './pages/ManageProject';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Navbar />
          <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
              <Route path="/chats" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
              <Route path="/chat/:projectId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
              <Route path="/project/:projectId/manage" element={<ProtectedRoute><ManageProject /></ProtectedRoute>} />
              
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;