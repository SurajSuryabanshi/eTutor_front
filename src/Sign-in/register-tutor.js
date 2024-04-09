import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/RegisterTutor.css';
import { Link } from 'react-router-dom';

function RegisterTutor() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    collegeId: '', 
    languages: '',
    courses: '',
    profilePic: null
  });

  const [colleges, setColleges] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get('https://etutor-back.onrender.com/api/college');
        setColleges(response.data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, []); 

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
    submissionData.append('collegeId', formData.collegeId); // Sending collegeId
    submissionData.append('languages', formData.languages);
    submissionData.append('courses', formData.courses);
    if (formData.profilePic) {
      submissionData.append('profilePicture', formData.profilePic);
    }
    try {
      const response = await axios.post('https://etutor-back.onrender.com/api/tutor/register', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Account created successfully!'); 
      console.log(response.data);
    } catch (error) {
      setMessage('Failed to create account.'); 
      console.error(error.response.data);
    }
  };

  return (
    <div className="register-tutor-container">
      <form className="register-tutor-form" onSubmit={handleSubmit}>
        <Link to="/">BACK TO LOGIN</Link> 
        <h2>Register your Tutor Account</h2>
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
        <input type="text" name="languages" placeholder="Languages" onChange={handleInputChange} required />
        <input type="text" name="courses" placeholder="Courses" onChange={handleInputChange} required />
        <input type="file" id="profile-pic-upload" name="profilePic" onChange={handleFileChange} required />
        <label htmlFor="profile-pic-upload" className="profile-pic-label">Upload your picture</label>
        <button type="submit">Create account</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default RegisterTutor;
