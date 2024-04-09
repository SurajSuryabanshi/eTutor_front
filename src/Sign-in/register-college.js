import React, { useState } from 'react';
import '../css/RegisterCollege.css';
import { Link } from 'react-router-dom';

function RegisterCollege() {
  const [formData, setFormData] = useState({
    collegeName: '',
    location: '',
    email: '',
    phone: '',
    collegeDescription: ''
  });

  const [collegePics, setCollegePics] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCollegePics([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('collegeName', formData.collegeName);
    data.append('location', formData.location);
    data.append('email', formData.email);
    data.append('phoneNumber', formData.phone);
    data.append('description', formData.collegeDescription);
    collegePics.forEach((pic, index) => {
      data.append(`collegePics`, pic);
    });

    try {
      const response = await fetch('http://localhost:5000/api/college/register', {
        method: 'POST',
        body: data
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // Display success message
        alert('College applied successfully!');
      } else if (response.status === 400) {
        const result = await response.json();
        alert(result.message);
      } else {
        // Handle other errors
        console.error('Failed to register college:', response.statusText);
      }
    } catch (error) {
      console.error('Error registering college:', error);
    }
  };

  return (
    <div className="register-college-container">
      <form className="register-college-form" onSubmit={handleSubmit}>
        <Link to="/">BACK TO LOGIN</Link>
        <h2>Register your College</h2>
        <input type="text" name="collegeName" placeholder="College name" onChange={handleInputChange} required />
        <input type="text" name="location" placeholder="Location" onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" onChange={handleInputChange} required />
        <input type="file" name="collegePics" onChange={handleFileChange} multiple required />
        <textarea name="collegeDescription" placeholder="College Description" onChange={handleInputChange} required></textarea>
        <button type="submit">Apply College</button>
      </form>
    </div>
  );
}

export default RegisterCollege;
