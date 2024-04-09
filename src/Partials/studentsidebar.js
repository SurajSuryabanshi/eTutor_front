import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import axios for making HTTP requests
import auth, { logout } from './logout'; // Import both logout function and auth object
import '../css/sidebar.css' 
import logo from '../css/logo.png'; // Import the logo image

const StudentSidebar = ({ selectedPage }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logout();
      auth.clearJWT(() => { // Clear JWT token and redirect to login page
        navigate('/');
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <aside className='sidebar'>
      <div className="sidebar-logo">
    <img src={logo} alt="Logo" />
  </div> 
      <nav>
        <ul>
          <li className={location.pathname === '/tutor-search' ? 'active' : ''}>
            <Link to="/tutor-search">Search</Link>
          </li>
          <li className={location.pathname === '/booking-page' ? 'active' : ''}>
            <Link to="/booking-page">Booking Page</Link>
          </li>
          <li className={location.pathname === '/my-college' || selectedPage === 'my-college' ? 'active' : ''}>
            <Link to="/my-college">My College</Link>
          </li>
          <li className={location.pathname === '/tutors' ? 'active' : ''}>
            <Link to="/tutors">Tutors</Link>
          </li>
          <li className={location.pathname === '/studentprofile' ? 'active' : ''}>
            <Link to="/studentprofile">Profile Page</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default StudentSidebar;
