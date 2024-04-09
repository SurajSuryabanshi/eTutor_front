import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import auth, { logout } from './logout'; 
import '../css/sidebar.css' 
import logo from '../css/logo.png'; // Import the logo image


const TutorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logout(); // Call logout function
      auth.clearJWT(() => {
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
          <li className={location.pathname === '/tutor-dashboard' ? 'active' : ''}>
            <Link to="/tutor-dashboard">Dashboard</Link>
          </li>
          <li className={location.pathname === '/tutor-timetable' ? 'active' : ''}>
            <Link to="/tutor-timetable">Time Table</Link>
          </li>
          <li className={location.pathname === '/tutorprofile' ? 'active' : ''}>
            <Link to="/tutorprofile">Profile Page</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default TutorSidebar;
