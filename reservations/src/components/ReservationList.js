import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../home.css';
import { useAuth } from '../context/AuthContext';

function ReservationList() {
  const { user } = useAuth(); // Get logged-in user
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 4;

  useEffect(() => {
    axios
      .get('http://localhost/reactapp2/blog_server/api/get-reservations.php', { withCredentials: true })
      .then(res => setReservations(res.data))
      .catch(err => console.error('Error fetching reservations:', err));
  }, []);

  // Pagination calculations
  const indexOfLast = currentPage * reservationsPerPage;
  const indexOfFirst = indexOfLast - reservationsPerPage;
  const currentReservations = reservations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reservations.length / reservationsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;

    try {
      const res = await axios.post(
        'http://localhost/reactapp2/blog_server/api/delete-reservations.php',
        { id },
        { withCredentials: true }
      );
      if (res.data.success) {
        setReservations(prev => prev.filter(r => r.id !== id));
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete reservation.');
    }
  };

  return (
    <div className="home-container">
      <h2 className="home-title">Reservations</h2>

      {reservations.length === 0 ? (
        <p className="no-reservations">No reservations yet. Create one!</p>
      ) : (
        <>
          <div className="cards-container">
            {currentReservations.map(reservation => (
              <div key={reservation.id} className="reservation-card">
                <h3 className="card-title">{reservation.area_name}</h3>
                <p className="card-text"><strong>Time Slot:</strong> {reservation.slot_time}</p>

                <Link to={`/reservation/${reservation.id}`} className="read-more-btn">
                  Read More
                </Link>

                {/* Admin-only buttons */}
                {user?.role === 'admin' && (
                  <div className="admin-buttons mt-2">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit-reservation/${reservation.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(reservation.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="pagination">
            <button
              onClick={handlePrev}
              className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
              <button
                key={page}
                className={`page-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              onClick={handleNext}
              className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ReservationList;
