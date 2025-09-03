import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateReservations() {
  const [areas, setAreas] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [imageFile, setImageFile] = useState(null); // <-- for image
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost/reactapp2/blog_server/api/get-areas.php')
      .then(res => setAreas(res.data))
      .catch(err => console.error('Error fetching areas:', err));

    axios.get('http://localhost/reactapp2/blog_server/api/get-timeslots.php')
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
      const formData = new FormData();
      formData.append('area_id', selectedArea);
      formData.append('time_slot_id', selectedTimeSlot);
      formData.append('is_booked', isBooked ? 1 : 0);
      if (imageFile) {
        formData.append('image', imageFile);
      }

  const response = await axios.post(
    'http://localhost/reactapp2/blog_server/api/create-reservations.php',
    {
      area_id: parseInt(selectedArea),
      time_slot_id: parseInt(selectedTimeSlot),
      is_booked: isBooked ? 1 : 0
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

      setMessage(response.data.message || 'Reservation created successfully!');
      setSelectedArea('');
      setSelectedTimeSlot('');
      setIsBooked(false);
      setImageFile(null);
    } catch (error) {
      setMessage('Error creating reservation');
      console.error('Create reservation error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Create a New Reservation</h2>
        </div>
        <div className="card-body">
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
                <option value="">-- Select Area --</option>
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
                <option value="">-- Select Time Slot --</option>
                {timeSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>{slot.slot_time}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">Choose Image</label>
              <input
                type="file"
                id="image"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="isBooked"
                checked={isBooked}
                onChange={() => setIsBooked(!isBooked)}
              />
              <label className="form-check-label" htmlFor="isBooked">
                Mark as Booked
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Reservation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateReservations;
