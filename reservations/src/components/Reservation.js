import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Reservation() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost/reservations_blog_api/get-reservations.php?id=${id}`)
      .then(res => setReservation(res.data))
      .catch(err => console.error('Error fetching reservation:', err));
  }, [id]);

  if (!reservation) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>{reservation.area_name}</h2>
      <p><strong>Location:</strong> {reservation.location}</p>
      <p><strong>Description:</strong> {reservation.description}</p>
      <p><strong>Time Slot:</strong> {reservation.slot_time}</p>
      <p><strong>Status:</strong> {reservation.is_booked ? "Booked" : "Not Booked"}</p>
    </div>
  );
}

export default Reservation;
