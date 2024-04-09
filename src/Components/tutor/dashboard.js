import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TutorSidebar from '../../Partials/tutorsidebar';

const TutorDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tutor/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tutor/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Remove the deleted booking from the local state
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <aside>
        <TutorSidebar />
      </aside>
      <main className='main-content'>
        <u><h1 style={{ textAlign: 'center' }}>Tutor Dashboard</h1></u>
        <table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Student Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Session Date</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Length (minutes)</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{`${booking.student.firstName} ${booking.student.lastName}`}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(booking.sessionDate).toDateString()}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{booking.sessionLength}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{booking.status}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  <button onClick={() => handleDeleteBooking(booking._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default TutorDashboard;
