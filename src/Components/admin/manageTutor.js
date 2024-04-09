import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../Partials/adminsidebar'; 

const ManageTutor = () => {
  const [tutors, setTutors] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false); 
  const [showEditForm, setShowEditForm] = useState(false); 
  const [formData, setFormData] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '', 
    password: '',
    collegeId: '',
    languages: '',
    courses: '',
    profilePic: null
  });

  useEffect(() => {
    // Fetch all tutors when the component mounts
    fetchTutors();
  }, []);

  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    // Fetch colleges from backend API
    const fetchColleges = async () => {
      try {
        const response = await axios.get('https://etutor-back.onrender.com/api/college');
        setColleges(response.data);
        console.log('Fetched Tutors:', response.data.tutors);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, []); // Empty dependency array to run only once on component mount

  const fetchTutors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://etutor-back.onrender.com/api/admin/tutors', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTutors(response.data.tutors);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    }
  };

  const handleDelete = async (tutorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://etutor-back.onrender.com/api/admin/tutors/${tutorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Fetch tutors again to update the list
      fetchTutors();
    } catch (error) {
      console.error('Error deleting tutor:', error);
    }
  };

  const handleEditTutor = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(`https://etutor-back.onrender.com/api/admin/tutors/${formData._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Fetch tutors again to update the list
      fetchTutors();
      // Clear form data after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        collegeId: '',
        profilePic: null
      });
      // Close the edit form
      setShowEditForm(false);
    } catch (error) {
      console.error('Error editing tutor profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({ ...prevState, profilePic: e.target.files[0] }));
  };

  const handleCloseButtonClick = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleAddTutor = async (e) => {
    try {
      e.preventDefault();
      const submissionData = new FormData();
      submissionData.append('firstName', formData.firstName);
      submissionData.append('lastName', formData.lastName);
      submissionData.append('email', formData.email);
      submissionData.append('phoneNumber', formData.phoneNumber); // Changed from 'phone' to 'phoneNumber'
      submissionData.append('password', formData.password);
      submissionData.append('collegeId', formData.collegeId);
      submissionData.append('languages', formData.languages);
      submissionData.append('courses', formData.courses);
      if (formData.profilePic) {
        submissionData.append('profilePicture', formData.profilePic);
      }
      const response = await axios.post('https://etutor-back.onrender.com/api/tutor/register', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Clear form data after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        collegeId: '',
        languages: '',
        courses: '',
        profilePic: null
      });

      console.log(response.data);
      // Fetch tutors again to update the list
      fetchTutors();
      // Hide the form after successful submission
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding tutor:', error);
    }
  };

  const handleAddButtonClick = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      collegeId: '',
      languages: '',
      courses: '',
      profilePic: null
    });
    setShowEditForm(false)
    setShowAddForm(true);
  };

  const handleEditClick = (tutor) => {
    setShowAddForm(false);
    setShowEditForm(true);
    setFormData({
      _id: tutor._id,
      firstName: tutor.firstName,
      lastName: tutor.lastName,
      email: tutor.email,
      phoneNumber: tutor.phoneNumber, // Corrected field name to match formData state
      collegeId: tutor.college._id,
      languages: tutor.languages,
      courses: tutor.courses
    });
  };

  return (
    <div className="dashboard-container">
      <aside>
        <AdminSidebar />
      </aside>
      <main className='main-content'>
        <h1>Manage Tutors</h1>
        
        <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>First Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Last Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Phone Number</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>College</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Languages</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Courses</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map(tutor => (
              <tr key={tutor._id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tutor.firstName}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tutor.lastName}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tutor.email}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tutor.phoneNumber}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tutor.college?.collegeName}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tutor.languages}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tutor.courses}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  <button onClick={() => handleEditClick(tutor)} style={{ backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(tutor._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button style={{ backgroundColor: '#28a745', color: 'white', border: '1px solid #28a745', width: '200px', height:'30px', float: 'right', margin:'20px 0', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', ':hover': { backgroundColor: '#218838' } }} onClick={() => handleAddButtonClick()}>+ Add New Tutor</button>
        {showAddForm && (
          <div style={{ marginTop: '80px', border: '1px solid black', padding: '10px', position: 'relative', width: 'fit-content' }}>
            <button style={{ backgroundColor: 'red', color: 'white', border: '1px solid #28a745', width: '200px', height:'30px', float: 'right', margin:'20px 0', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', ':hover': { backgroundColor: '#218838' } }} onClick={handleCloseButtonClick}>Close form</button>
            <h2 style={{ marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Add new Tutor</h2>
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
            <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required /> {/* Changed from 'phone' to 'phoneNumber' */}
            <input style={{marginTop:'10px'}} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
            <div style={{ display: 'flex', alignItems: 'center', marginTop:'20px', marginBottom: '30px' }}>
              <label htmlFor="collegeSelect" style={{ marginRight: '10px' }}>Select College:</label>
              <select id="collegeSelect" name="collegeId" value={formData.collegeId} onChange={handleInputChange} required style={{ width: '60%', padding: '8px', borderRadius: '5px' }}>
                <option value="">Select College</option>
                {colleges.map(college => (
                  <option key={college._id} value={college._id}>{college.collegeName}</option>
                ))}
              </select>
            </div>
            <input type="text" name="languages" placeholder="Languages" value={formData.languages} onChange={handleInputChange} required />
            <input type="text" name="courses" placeholder="Courses" value={formData.courses} onChange={handleInputChange} required />
            <label htmlFor="profile-pic-upload" className="profile-pic-label">
              Your picture
              <input type="file" id="profile-pic-upload" name="profilePic" onChange={handleFileChange} required />
            </label>
            <button style={{ backgroundColor: 'green', color: 'white' }} onClick={handleAddTutor}>Add Tutor</button>
          </div>
        )}
        {showEditForm && (
          <div style={{ marginTop: '80px', border: '1px solid black', padding: '10px', position: 'relative', width: 'fit-content' }}>
            <button style={{ backgroundColor: 'red', color: 'white', border: '1px solid #28a745', width: '200px', height:'30px', float: 'right', margin:'20px 0', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', ':hover': { backgroundColor: '#218838' } }} onClick={handleCloseButtonClick}>Close form</button>
            <h2 style={{ marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Edit Tutor</h2>
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
            <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required /> 
            <input type="text" name="languages" placeholder="Languages" value={formData.languages} onChange={handleInputChange} required />
            <input type="text" name="courses" placeholder="Courses" value={formData.courses} onChange={handleInputChange} required /> 
            <button style={{ backgroundColor: 'green', color: 'white', marginTop:'23px'}} onClick={handleEditTutor}>Update Details</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageTutor;
