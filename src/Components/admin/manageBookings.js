import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../Partials/adminsidebar';
import { format } from 'date-fns';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
  
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
  
        if (!token) {
          throw new Error('Token not found in localStorage');
        }
  
        const response = await axios.get('http://localhost:5000/api/admin/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Format session dates before setting the bookings state
        const formattedBookings = response.data.bookings.map(booking => ({
          ...booking,
          sessionDate: format(new Date(booking.sessionDate), 'yyyy-MM-dd'),
          startTime: format(new Date(booking.startTime), 'HH:mm:ss'),
          endTime: format(new Date(booking.endTime), 'HH:mm:ss'),
        }));
  
        setBookings(formattedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
  
    useEffect(() => {
      // Call fetchBookings inside useEffect
      fetchBookings();
    }, []); // Run only once on component mount
  
    const handleDelete = async (bookingId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this booking?');
    
        if (!confirmDelete) {
          return; // If user cancels deletion, exit the function
        }
    
        try {
          const token = localStorage.getItem('token');
    
          if (!token) {
            throw new Error('Token not found in localStorage');
          }
    
          await axios.delete(`http://localhost:5000/api/admin/bookings/${bookingId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          // After successful deletion, fetch the updated list of bookings
          fetchBookings();
        } catch (error) {
          console.error('Error deleting booking:', error);
          // Handle errors as needed
        }
      };
      
  return (
    <div className="dashboard-container">
      <aside>
        <AdminSidebar />
      </aside>
      <main className='main-content'>
        <h1>Manage Bookings</h1>
        <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Booking ID</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Student Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Tutor Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Session Date</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Session Length</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Start Time</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>End Time</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>OPERATIONS</th>

            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{booking._id}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{`${booking.student.firstName} ${booking.student.lastName}`}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{`${booking.tutor.firstName} ${booking.tutor.lastName}`}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{booking.sessionDate}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{booking.sessionLength}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{booking.startTime}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{booking.endTime}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{booking.status}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {/* Delete button */}
                  <button onClick={() => handleDelete(booking._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ManageBookings;
