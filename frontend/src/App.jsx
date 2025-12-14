import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeProvider';

import Dashboard from './pages/Dashboard';
import AllTrips from './pages/AllTrips';
import PlanTrip from './pages/PlanTrip';
import AddDestination from './pages/AddDestination';
import TripDetail from './pages/TripDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Route yang aman
const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
  }, []);

  if (isAuth === null) return <div>Loading...</div>; // sementara cek token
  return isAuth ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-destination"
            element={
              <ProtectedRoute>
                <AddDestination />
              </ProtectedRoute>
            }
          />
          {/* ALL TRIPS */}
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <AllTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:category"
            element={
              <ProtectedRoute>
                <AllTrips />
              </ProtectedRoute>
            }
          />
          
          {/* TRIP DETAIL */}
          <Route
            path="/trip/:id"
            element={
              <ProtectedRoute>
                <TripDetail />
              </ProtectedRoute>
            }
          />
          
          {/* PLAN TRIP */}
          <Route
            path="/plan-trip/:id"
            element={
              <ProtectedRoute>
                <PlanTrip />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT / FALLBACK */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;