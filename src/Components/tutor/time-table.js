import React, { useState, useEffect } from 'react';
import TutorSidebar from '../../Partials/tutorsidebar';

const AvailabilityForm = ({ onSubmit, fetchAvailabilities }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAvailabilities();
  }, [fetchAvailabilities]);

  const handleDayChange = (event) => {
    const { checked, value } = event.target;
    setSelectedDays(checked ? [...selectedDays, value] : selectedDays.filter((day) => day !== value));
  };

  const getTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
  
    return hours * 60 * 60 * 1000 + minutes * 60 * 1000;
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!startTime || !endTime) {
      setError('Please enter the start and end time.');
      return;
    }
    
    const formattedStartTime = new Date(`1970-01-01T${startTime}:00`).toISOString();
    const formattedEndTime = new Date(`1970-01-01T${endTime}:00`).toISOString();
   
    const startDateTime = new Date(formattedStartTime);
    const endDateTime = new Date(formattedEndTime);
    const minimumEndTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); 
      if (endDateTime <= minimumEndTime) {
      setError('End time must be at least 30 minutes after the start time.');
      return;
      }
    const formData = { days: selectedDays, startTime: formattedStartTime, endTime: formattedEndTime };
    try {
      await onSubmit(formData);
      setSelectedDays([]);
      setStartTime('');
      setEndTime('');
      setSuccessMessage('Availability recorded successfully.');
      fetchAvailabilities();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
      <u><h4 style={{textAlign: 'center'}}>Create/Update Availability</h4></u>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <label>
          Days:
          <br />
          {days.map((day) => (
            <div key={day}>
              <input
                type="checkbox"
                value={day}
                checked={selectedDays.includes(day)}
                onChange={handleDayChange}
              />{' '}
              {day}
              <br />
            </div>
          ))}
        </label>
        <br />
        <label>
          Start Time:
          <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
        </label>
        <br />
        <label>
          End Time:
          <input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
        </label>
        <br />
        <button type="submit">Submit Availability</button>
      </form>
    </div>
  );
};

const TutorTimetable = () => {
  const [error, setError] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/availability';

  const handleAvailabilitySubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to create availability');
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleDeleteAvailability = async (availabilityId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/${availabilityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete availability');
      }
      fetchAvailabilities();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAvailabilities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAvailabilities(data);
      } else {
        throw new Error('Failed to fetch availabilities');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch availabilities');
    }
  };

  return (
    <div>      <TutorSidebar />
      <div style={{ textAlign: 'center' }}>
      <u><h1>Timetable</h1></u>
      <AvailabilityForm onSubmit={handleAvailabilitySubmit} fetchAvailabilities={fetchAvailabilities} />
      <table style={{ margin: '0 auto', textAlign: 'left', borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Day</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Start Time</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>End Time</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {availabilities.map((availability) => (
            <tr key={availability._id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{availability.days.join(', ')}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(availability.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(availability.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => handleDeleteAvailability(availability._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>

  );
};

export default TutorTimetable;
