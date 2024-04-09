import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../Partials/adminsidebar';

const ManageCollege = () => {
  const [colleges, setColleges] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [collegePics, setCollegePics] = useState([]);

  const [formData, setFormData] = useState({
    collegeName: '',
    location: '',
    email: '',
    phoneNumber: '',
    description: '',
    picture: null
  });

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/colleges', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setColleges(response.data.colleges);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const handleDelete = async (collegeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/colleges/${collegeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchColleges();
    } catch (error) {
      console.error('Error deleting college:', error);
    }
  };

  const handleEditCollege = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/colleges/${formData._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchColleges();
      setShowEditForm(false);
    } catch (error) {
      console.error('Error editing college:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddButtonClick = () => {
    setFormData({
      collegeName: '',
      location: '',
      email: '',
      phoneNumber: '',
      description: '',
      picture: null
    });
    setShowEditForm(false);
    setShowAddForm(true);
  };

  const handleCloseButtonClick = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

 // Adjust the handleAddCollege function to send FormData with the picture
const handleAddCollege = async (e) => {
  try {
      e.preventDefault();
      const submissionData = new FormData();
      submissionData.append('collegeName', formData.collegeName);
      submissionData.append('location', formData.location);
      submissionData.append('email', formData.email);
      submissionData.append('phoneNumber', formData.phoneNumber);
      submissionData.append('description', formData.description);
      
      // Append the picture(s) to the FormData
      if (formData.picture) {
          formData.picture.forEach((file, index) => {
              submissionData.append(`picture${index}`, file);
          });
      }
      
      const response = await fetch('http://localhost:5000/api/college/register', {
          method: 'POST',
          body: submissionData
      });
      if (response.status === 400) {
        const result = await response.json();
        alert(result.message);}
      setFormData({
          collegeName: '',
          location: '',
          email: '',
          phoneNumber: '',
          description: '',
          picture: null
      });
      fetchColleges();
      setShowAddForm(false);
      
  } catch (error) {
      console.error('Error adding college:', error);
  }
};

  
  const handleEditButtonClick = async (college) => {
    setShowAddForm(false);
    setShowEditForm(true);
    setFormData({
      _id: college._id,
      collegeName: college.collegeName,
      location: college.location,
      email: college.email,
      phoneNumber: college.phoneNumber,
      description: college.description,
      picture: null
    });
  };

  const handleFileChange = (e) => {
    setCollegePics([...e.target.files]);
  };
  return (
    <div className="dashboard-container">
      <aside>
        <AdminSidebar />
      </aside>
      <main className='main-content'>
        <h1>Manage Colleges</h1>
        
        <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>College Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Location</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Phone Number</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {colleges.map(college => (
              <tr key={college._id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{college.collegeName}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{college.location}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{college.email}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{college.phoneNumber}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{college.description}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  <button onClick={() => handleEditButtonClick(college)} style={{ backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(college._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button style={{ backgroundColor: '#28a745', color: 'white', border: '1px solid #28a745', width: '200px', height:'30px', float: 'right', margin:'20px 0', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', ':hover': { backgroundColor: '#218838' } }} onClick={handleAddButtonClick}>+ Add New College</button>
        {showAddForm && (
          <div style={{ marginTop: '80px', border: '1px solid black', padding: '10px', position: 'relative', width: 'fit-content' }}>
            <button style={{ backgroundColor: 'red', color: 'white', border: '1px solid #28a745', width: '200px', height:'30px', float: 'right', margin:'20px 0', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', ':hover': { backgroundColor: '#218838' } }} onClick={handleCloseButtonClick}>Close form</button>
            <h2 style={{ marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Add new College</h2>
            <input type="text" name="collegeName" placeholder="College Name" value={formData.collegeName} onChange={handleInputChange} required />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
            <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} style={{ marginTop: '10px', width: '100%', height: '100px' }} required />
            <label htmlFor="college-pic-upload" className="college-pic-label">
              College Picture
              <input type="file" id="college-pic-upload" name="collegePics" onChange={handleFileChange} multiple required />
            </label>
            <button style={{ backgroundColor: 'green', color: 'white' }} onClick={handleAddCollege}>Add College</button>
          </div>
        )}
        {showEditForm && (
          <div style={{ marginTop: '80px', border: '1px solid black', padding: '10px', position: 'relative', width: 'fit-content' }}>
            <button style={{ backgroundColor: 'red', color: 'white', border: '1px solid #28a745', width: '200px', height:'30px', float: 'right', margin:'20px 0', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', ':hover': { backgroundColor: '#218838' } }} onClick={handleCloseButtonClick}>Close form</button>
            <h2 style={{ marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Edit College</h2>
            <input type="text" name="collegeName" placeholder="College Name" value={formData.collegeName} onChange={handleInputChange} required />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
            <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} style={{ marginTop: '10px', width: '100%', height: '100px' }} required />
            <button style={{ backgroundColor: 'green', color: 'white', marginTop: '23px' }} onClick={handleEditCollege}>Update Details</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageCollege;
