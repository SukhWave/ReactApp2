 // src/components/EditReservations.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditReservations = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [areaId, setAreaId] = useState("");
  const [timeSlotId, setTimeSlotId] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [image, setImage] = useState(null); // file or URL
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [areas, setAreas] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  // Fetch reservation details + dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservationRes, areasRes, slotsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-reservation.php?id=${id}`, { withCredentials: true }),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/conservation-areas.php`, { withCredentials: true }),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/time-slots.php`, { withCredentials: true })
        ]);

        const reservation = reservationRes.data;
        setAreaId(reservation.area_id);
        setTimeSlotId(reservation.time_slot_id);
        setIsBooked(Boolean(reservation.is_booked));
        setImage(reservation.imageName);

        setAreas(areasRes.data);
        setTimeSlots(slotsRes.data);
      } catch (err) {
        setError("Failed to fetch reservation details.");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("area_id", areaId);
      formData.append("time_slot_id", timeSlotId);
      formData.append("is_booked", isBooked ? 1 : 0);

      if (image && typeof image !== "string") {
        // only append if it's a new uploaded file
        formData.append("image", image);
      }

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/update-reservation.php`,
        formData,
        { withCredentials: true }
      );

      navigate("/reservations");
    } catch (err) {
      setError("Failed to update reservation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4 p-4 bg-light rounded shadow-lg border-0">
      <h2 className="mb-5">Edit Reservation</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Area Selection */}
        <div className="row mb-3 align-items-center">
          <label htmlFor="area" className="col-sm-2 col-form-label fw-semibold">Area</label>
          <div className="col-sm-10">
            <select
              id="area"
              className="form-control w-50"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              required
            >
              <option value="">Select Area</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Slot Selection */}
        <div className="row mb-3 align-items-center">
          <label htmlFor="timeSlot" className="col-sm-2 col-form-label fw-semibold">Time Slot</label>
          <div className="col-sm-10">
            <select
              id="timeSlot"
              className="form-control w-50"
              value={timeSlotId}
              onChange={(e) => setTimeSlotId(e.target.value)}
              required
            >
              <option value="">Select Time Slot</option>
              {timeSlots.map(slot => (
                <option key={slot.id} value={slot.id}>{slot.slot_time}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Is Booked */}
        <div className="row mb-3 align-items-center">
          <label htmlFor="isBooked" className="col-sm-2 col-form-label fw-semibold">Booked</label>
          <div className="col-sm-10">
            <input
              type="checkbox"
              id="isBooked"
              checked={isBooked}
              onChange={(e) => setIsBooked(e.target.checked)}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="row mb-3 align-items-center">
          <label htmlFor="image" className="col-sm-2 col-form-label fw-semibold">Reservation Image</label>
          <div className="col-sm-10">
            <input
              type="file"
              className="form-control w-50"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {image && (
              <img
                src={
                  typeof image === "string"
                    ? `${process.env.REACT_APP_API_BASE_URL}/uploads/${image}`
                    : URL.createObjectURL(image)
                }
                alt="Preview"
                className="img-thumbnail mt-2"
                style={{ maxWidth: "150px" }}
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="text-end">
          <button type="submit" className="btn btn-dark me-2" disabled={isLoading}>
            {isLoading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving changes...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/reservations")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReservations;
