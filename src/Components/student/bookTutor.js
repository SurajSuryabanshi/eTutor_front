import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import jwt_decode from 'jwt-decode';

import StudentSidebar from '../../Partials/studentsidebar';

const BookTutor = () => {
  const token = localStorage.getItem('token');
  const storedTutorId = JSON.parse(localStorage.getItem('selectedTutor'));
  const [tutor, setTutor] = useState(null);
  const [availabilities, setAvailabilities] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookingDuration, setBookingDuration] = useState('30');

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tutor/tutor/${storedTutorId}`);
        setTutor(response.data);
      } catch (error) {
        console.error('Error fetching tutor details:', error);
      }
    };

    if (storedTutorId) {
      fetchTutorDetails();
    }
  }, [storedTutorId]);

  const fetchTutorAvailabilities = async (tutorId, selectedDate) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/availability/tutor/${tutorId}?date=${selectedDate}`);
      setAvailabilities(response.data);
    } catch (error) {
      console.error('Error fetching tutor availabilities:', error);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    if (storedTutorId) {
      fetchTutorAvailabilities(storedTutorId, event.target.value);
    }
  };

  const handleSlotSelection = (session) => {
    setSelectedSlots([session]);
  };
  

  const handleBookingDurationChange = (event) => {
    setBookingDuration(event.target.value);
  };



  const handleSubmitBooking = async () => {
    if (selectedSlots.length === 0) {
      alert('Please select at least one time slot.');
      return;
    }

    try {
      const tokenParts = token.split('.');
      const decodedPayload = JSON.parse(atob(tokenParts[1]));
      const studentId = decodedPayload.studentId; // Extract student ID from the decoded payload
      const session = selectedSlots[0]; // Assuming only one session is selected

      await axios.post('http://localhost:5000/api/booking/book', {
        tutorId: storedTutorId,
        studentId: studentId, // Use the extracted student ID
        sessionDate: selectedDate,
        sessionLength: bookingDuration,
        startTime: session.startTime, // Include start time
        endTime: session.endTime 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Booking successful!');
      setSelectedSlots([]);
    } catch (error) {
      console.error('Error booking tutor:', error);
      alert(' BOOKING FAILED. \n Either tutor or student already has booking\n Please try a different time slot.');
    }
  };

  const getSessions = (startTime, endTime) => {
    const sessions = [];
    const durationInMinutes = parseInt(bookingDuration);

    let currentTime = new Date(startTime);
    const endTimeObj = new Date(endTime);

    while (currentTime < endTimeObj) {
      const endTimeSession = new Date(currentTime);
      endTimeSession.setMinutes(endTimeSession.getMinutes() + durationInMinutes);
      sessions.push({ startTime: new Date(currentTime), endTime: new Date(endTimeSession) });
      currentTime = endTimeSession;
    }

    return sessions;
  };
  const currentDate = moment().format('YYYY-MM-DD');

  return (
    <div className="container">
      <aside>
        <StudentSidebar />
      </aside>
      <div className="main-content">
        <h1 style={{ textAlign: 'center', textDecoration: 'underline' }}>Book Your Tutor</h1>
        {tutor && (
          <div>
            <p><strong>Tutor Name:</strong> {`${tutor.firstName} ${tutor.lastName}`}</p>
          </div>
        )}
        <div>
          <label htmlFor="duration">Select booking duration:</label>
          <select id="duration" value={bookingDuration} onChange={handleBookingDurationChange}>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
        <div>
          <label htmlFor="date">Select date:</label>
          <input type="date" id="date" onChange={handleDateChange} min={currentDate} />
        </div>
  
        {selectedDate && availabilities && availabilities.length > 0 ? (
          availabilities.map((availability) => (
            <div key={availability._id}>
              <h2>{`Availability on ${moment(selectedDate).format('dddd')} - ${selectedDate}`}</h2>
              {getSessions(availability.startTime, availability.endTime).map((session, index) => (
                <div key={index}>
                  <button
                    onClick={() => handleSlotSelection(session)}
                    style={{
                      backgroundColor: selectedSlots.length > 0 && session.startTime.getTime() === selectedSlots[0].startTime.getTime() && session.endTime.getTime() === selectedSlots[0].endTime.getTime() ? 'green' : 'white',
                      border: '1px solid #ccc',
                      margin: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    {`${session.startTime.toLocaleTimeString()} - ${session.endTime.toLocaleTimeString()}`}
                  </button>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px', marginTop: '30px' }}>
            <p style={{ color: 'black', textAlign: 'center' }}>No Results available</p>
          </div>
        )}
  
        <button style={{ backgroundColor: 'lightblue', color: 'black', display: 'block', margin: '20px auto', width: '200px', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s, color 0.3s', ':hover': { backgroundColor: 'red', color: 'white' } }} onClick={handleSubmitBooking}>
          Book Tutor
        </button>
      </div>
    </div>
  );
        }

export default BookTutor;
