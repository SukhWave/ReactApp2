import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import CreateReservations from './components/CreateReservations';
import ReservationList from './components/ReservationList';
import Reservation from './components/Reservation';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ReservationList />} />
          <Route path="/create-reservation" element={<CreateReservations />} />
          <Route path="/reservation/:id" element={<Reservation />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
