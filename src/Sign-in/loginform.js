import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/LoginForm.css'; // Import the LoginForm.css file

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student'); // Default to student login
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`https://etutor-back.onrender.com/api/${userType}/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      
      // Redirect user to appropriate page based on userType
      switch(userType) {
        case 'student':
          navigate('/tutor-search');
          break;
        case 'tutor':
          navigate('/tutor-dashboard');
          break;
        case 'admin': // Add case for admin login
          navigate('/manage-student');
          break;
        default:
          navigate('/'); // Handle default case
      }
    } catch (error) {
      alert('Login failed: Incorrect credentials');
      console.error('Login failed:', error.response?.data?.message || error.message);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 style={{ color: 'blue', marginTop:10}}> Welcome Back!</h2>
  <b style={{ color: 'green', marginTop:10}}>Please log in to continue.</b>
      <div style={{marginTop:20}}>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="userType">Login As:</label>
        <select
          id="userType"
          name="userType"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
          <option value="admin">Admin</option> {/* Add option for admin login */}
        </select>
      </div>
      <button type="submit">Login</button>
      <div className="register-buttons">
        <button type="button" onClick={() => navigateTo('/register-student')}>Register Student</button>
        <button type="button" onClick={() => navigateTo('/register-tutor')}>Register Tutor</button>
        <button type="button" onClick={() => navigateTo('/register-college')}>Register College</button>
      </div>
    </form>
  );
}

export default LoginForm;
