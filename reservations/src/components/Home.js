import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../home.css';

function Home() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost/reactapp2/blog_server/api/get-reservations.php')
      .then((res) => setReservations(res.data))
      .catch((err) => console.error('Error fetching reservations:', err));
  }, []);

  return (
    <div className="home-container">
      <h2 className="home-title">Reservations</h2>

      {reservations.length === 0 ? (
        <p className="no-reservations">No reservations yet. Create one!</p>
      ) : (
        <div className="cards-container">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <h3 className="card-title">{reservation.area_name}</h3>
              <p className="card-text">
                <strong>Time Slot:</strong> {reservation.slot_time}
              </p>
              <p className="card-text">
                <strong>Status:</strong> {reservation.is_booked ? 'Booked' : 'Available'}
              </p>
              <Link to={`/reservation/${reservation.id}`} className="read-more-btn">
                Read More
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
