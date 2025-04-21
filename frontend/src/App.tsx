import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import WorkoutPlans from './pages/WorkoutPlans';
import DietTracking from './pages/DietTracking';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workout-plans" element={<WorkoutPlans />} />
                <Route path="/diet-tracking" element={<DietTracking />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App