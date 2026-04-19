import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MemberList from './pages/MemberList';
import MemberForm from './pages/MemberForm';
import PrayerWall from './pages/PrayerWall';
import Events from './pages/Events';
import Mentorship from './pages/Mentorship';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-950 text-orthodox-gold">Initializing...</div>;
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-orthodox-gold selection:text-black">
          <Navbar />
          
          <main className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/members" element={
                <PrivateRoute>
                  <MemberList />
                </PrivateRoute>
              } />

              <Route path="/prayers" element={
                <PrivateRoute>
                  <PrayerWall />
                </PrivateRoute>
              } />

              <Route path="/events" element={
                <PrivateRoute>
                  <Events />
                </PrivateRoute>
              } />

              <Route path="/mentorship" element={
                <PrivateRoute>
                  <Mentorship />
                </PrivateRoute>
              } />

              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />
              
              <Route path="/add-member" element={
                <PrivateRoute>
                  <MemberForm />
                </PrivateRoute>
              } />
              
              <Route path="/edit-member/:id" element={
                <PrivateRoute>
                  <MemberForm />
                </PrivateRoute>
              } />
            </Routes>
          </main>

          <footer className="mt-12 py-8 bg-black border-t border-zinc-900 text-center">
            <p className="text-zinc-600 text-xs">
              &copy; {new Date().getFullYear()} Orthodox Tewahedo Fellowship - Hawassa University
            </p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
