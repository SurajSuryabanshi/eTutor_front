import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentSidebar from '../../Partials/studentsidebar'; 
const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
      const fetchBookings = async () => {
          try {
              const token = localStorage.getItem('token');
              const response = await axios.get('http://localhost:5000/api/student/bookings', {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
              setBookings(response.data.bookings);
          } catch (error) {
              console.error('Error fetching bookings:', error);
              setError('Error fetching bookings. Please try again.');
          }
      };
      fetchBookings();
  }, []);

  return (
    <div className="dashboard-container">
      <aside>
        <StudentSidebar />
      </aside>
      <main className='main-content'>
        <u><h1 style={{ textAlign: 'center' }}>Student Dashboard</h1></u>
        <table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Tutor Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Session Date</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Start Time</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>End Time</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Length (minutes)</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{`${booking.tutor.firstName} ${booking.tutor.lastName}`}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(booking.sessionDate).toDateString()}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(booking.startTime).toLocaleTimeString()}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(booking.endTime).toLocaleTimeString()}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{booking.sessionLength}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default BookingsPage;