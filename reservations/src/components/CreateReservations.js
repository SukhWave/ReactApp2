import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateReservations() {
  const [areas, setAreas] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost/reservations_blog_api/get-areas.php')
      .then(res => setAreas(res.data))
      .catch(err => console.error('Error fetching areas:', err));

    axios.get('http://localhost/reservations_blog_api/get-timeslots.php')
      .then(res => setTimeSlots(res.data))
      .catch(err => console.error('Error fetching time slots:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedArea || !selectedTimeSlot) {
      setMessage('Please select area and time slot.');
      return;
    }

    try {
      const response = await axios.post('http://localhost/reservations_blog_api/create-reservations.php', {
        area_id: parseInt(selectedArea),
        time_slot_id: parseInt(selectedTimeSlot),
        is_booked: isBooked
      });

      setMessage(response.data.message || 'Reservation created successfully!');
    } catch (error) {
      setMessage('Error creating reservation');
      console.error('Create reservation error:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create a New Reservation</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="area" className="form-label">Conservation Area</label>
          <select
            id="area"
            className="form-select"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            required
          >
            <option value="">Select an area</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="timeSlot" className="form-label">Time Slot</label>
          <select
            id="timeSlot"
            className="form-select"
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            required
          >
            <option value="">Select a time slot</option>
            {timeSlots.map(slot => (
              <option key={slot.id} value={slot.id}>{slot.slot_time}</option>
            ))}
          </select>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isBooked}
            onChange={() => setIsBooked(!isBooked)}
            id="isBooked"
          />
          <label className="form-check-label" htmlFor="isBooked">
            Mark as Booked
          </label>
        </div>

        <button type="submit" className="btn btn-primary">Create Reservation</button>
      </form>
    </div>
  );
}

export default CreateReservations;
