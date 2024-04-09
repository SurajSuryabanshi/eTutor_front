import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link} from 'react-router-dom';
import '../css/RegisterStudent.css';

function RegisterStudent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    collegeId: '',
    profilePic: null
  });
  const [colleges, setColleges] = useState([]);
  const [message, setMessage] = useState('');


  useEffect(() => {
    // Fetch colleges from backend API
    const fetchColleges = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/college');
        setColleges(response.data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, []); // Empty dependency array to run only once on component mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({ ...prevState, profilePic: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    submissionData.append('firstName', formData.firstName);
    submissionData.append('lastName', formData.lastName);
    submissionData.append('email', formData.email);
    submissionData.append('phoneNumber', formData.phone);
    submissionData.append('password', formData.password);
    submissionData.append('collegeId', formData.collegeId);
    if (formData.profilePic) {
      submissionData.append('profilePicture', formData.profilePic);
    }
    try {
      const response = await axios.post('http://localhost:5000/api/student/register', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Account created successfully!'); // Set success message
      console.log(response.data);
    } catch (error) {
      setMessage('Failed to create account.'); // Set error message
      console.error(error.response.data);
    }
  };
  

  return (
    <div className="register-student-container">
      <form className="register-student-form" onSubmit={handleSubmit}>
      <Link to="/">BACK TO LOGIN</Link> 
        <h2>Register your Student Account</h2>
        <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} required />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" onChange={handleInputChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleInputChange} required />
        <select name="collegeId" onChange={handleInputChange} required>
        <option value="">Select your college</option>
          {colleges.map(college => (
           <option key={college._id} value={college._id}>{college.collegeName}</option>
           ))}
        </select>

        <label htmlFor="profile-pic-upload" className="profile-pic-label">
          Your picture
          <input type="file" id="profile-pic-upload" name="profilePic" onChange={handleFileChange} required />
        </label>
        <button type="submit">Create account</button>
        {message && <p>{message}</p>}
      </form>
      
    </div>
  );
}

export default RegisterStudent;
