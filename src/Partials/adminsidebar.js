import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import auth, { logout } from './logout'; 
import '../css/sidebar.css'; 
import logo from '../css/logo.png'; // Import the logo image

const AdminSidebar = () => {
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
      <div className="sidebar-header">
      <div className="sidebar-logo">
    <img src={logo} alt="Logo" />
  </div>      
  </div>
      <nav>
        <ul>
          <li className={location.pathname === '/manage-student' ? 'active' : ''}>
            <Link to="/manage-student">Manage Student</Link>
          </li>
          <li className={location.pathname === '/manage-tutor' ? 'active' : ''}>
            <Link to="/manage-tutor">Manage Tutor</Link>
          </li>
          <li className={location.pathname === '/manage-college' ? 'active' : ''}>
            <Link to="/manage-college">Manage College</Link>
          </li>
          <li className={location.pathname === '/manage-bookings' ? 'active' : ''}>
            <Link to="/manage-bookings">Manage Bookings</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
