import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Reservation() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchReservation = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost/reactapp2/blog_server/api/get-reservation.php?id=${id}`);
      setReservation(res.data);
    } catch (err) {
      console.error('Error fetching reservation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservation();
  }, [id]);

  const handleAction = async (action) => {
    if (updating) return;
    setUpdating(true);

    try {
      const res = await axios.post(
        'http://localhost/reactapp2/blog_server/api/update-book-count.php',
        { reservation_id: id, action },
        { headers: { 'Content-Type': 'application/json' } } // ensures PHP reads JSON
      );

      if (res.data.success) {
        // Update the reservation counts locally without waiting for a full fetch
        setReservation(prev => ({
          ...prev,
          book_count: action === 'book' ? 1 : 0,
          unbook_count: action === 'unbook' ? 1 : 0,
          is_booked: action === 'book' ? 1 : 0
        }));
      } else {
        console.error('Server error:', res.data.message);
      }
    } catch (err) {
      console.error('Error updating reservation:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading reservation...</p>;
  if (!reservation) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Reservation not found.</p>;

  return (
    <div style={{
      maxWidth: '700px',
      margin: '50px auto',
      padding: '25px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
      backgroundColor: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>{reservation.area_name}</h2>
      <hr style={{ margin: '20px 0' }} />
      <p><strong>Time Slot:</strong> {reservation.slot_time}</p>
      <p style={{ marginTop: '15px', lineHeight: '1.6', color: '#555' }}>{reservation.description}</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <button
          onClick={() => handleAction('book')}
          disabled={updating || reservation.book_count === 1}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: reservation.book_count === 1 ? '#ccc' : '#4CAF50',
            color: 'white',
            cursor: reservation.book_count === 1 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.3s'
          }}
        >
          Book ({reservation.book_count})
        </button>

        <button
          onClick={() => handleAction('unbook')}
          disabled={updating || reservation.unbook_count === 1}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: reservation.unbook_count === 1 ? '#ccc' : '#f44336',
            color: 'white',
            cursor: reservation.unbook_count === 1 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.3s'
          }}
        >
          Unbook ({reservation.unbook_count})
        </button>
      </div>
    </div>
  );
}

export default Reservation;