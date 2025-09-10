import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from './components/Navbar';
import ReservationList from './components/ReservationList';
import CreateReservations from './components/CreateReservations';
import Reservation from './components/Reservation';
import EditReservations from './components/EditReservations';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default landing page */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ReservationList />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservation/:id"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Reservation />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-reservation"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <CreateReservations />
                </>
              </ProtectedRoute>
            }
          />

          {/* Edit reservation route */}
          <Route
            path="/edit-reservation/:id"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <EditReservations />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
