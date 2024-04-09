import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../Partials/adminsidebar'; 

const ManageStudent = () => {
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '', 
    password: '',
    collegeId: '',
    profilePic: null
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const [colleges, setColleges] = useState([]);

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

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://etutor-back.onrender.com/api/admin/students', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleDelete = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://etutor-back.onrender.com/api/admin/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleEditStudent = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://etutor-back.onrender.com/api/admin/students/${formData._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchStudents();
      setShowEditForm(false);
    } catch (error) {
      console.error('Error editing student:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddButtonClick = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '', // Changed from 'phone' to 'phoneNumber'
      password: '',
      collegeId: '',
      profilePic: null
    });
    setShowEditForm(false);
    setShowAddForm(true);
  };

  const handleEditButtonClick = async (student) => {
    setShowAddForm(false);
    setShowEditForm(true);
    setFormData({
      _id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber, // Changed from 'phone' to 'phoneNumber'
      collegeId: student.collegeId,
      profilePic: null
    });
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({ ...prevState, profilePic: e.target.files[0] }));
  };

  const handleCloseButtonClick = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleAddStudent = async (e) => {
    try {
      e.preventDefault();
      const submissionData = new FormData();
      submissionData.append('firstName', formData.firstName);
      submissionData.append('lastName', formData.lastName);
      submissionData.append('email', formData.email);
      submissionData.append('phoneNumber', formData.phoneNumber); // Changed from 'phone' to 'phoneNumber'
      submissionData.append('password', formData.password);
      submissionData.append('collegeId', formData.collegeId);
      if (formData.profilePic) {
        submissionData.append('profilePicture', formData.profilePic);
      }
      await axios.post('http://localhost:5000/api/student/register', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '', // Changed from 'phone' to 'phoneNumber'
        password: '',
        collegeId: '',
        profilePic: null
      });
      fetchStudents();
      setShowAddForm(false);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data && error.response.data.message === 'A student with this email already exists') {
        alert('A student with this email already exists. Please provide a different email address.');
      } else {
        console.error('Error adding student:', error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <aside>
        <AdminSidebar />
      </aside>
      <main className='main-content'>
        <h1>Manage Students</h1>
        
        <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>First Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Last Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Phone Number</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>College</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{student.firstName}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{student.lastName}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{student.email}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{student.phoneNumber}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{student.college?.collegeName}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  <button onClick={() => handleEditButtonClick(student)} style={{ backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(student._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button style={{ backgroundColor: '#28a745', color: 'white', border: '1px solid #28a745', width: '200px', height:'30px', float: 'right', margin:'20px 0', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', ':hover': { backgroundColor: '#218838' } }} onClick={handleAddButtonClick}>+ Add New Student</button>
        {showAddForm && (
          <div style={{ marginTop: '80px', border: '1px solid black', padding: '10px', position: 'relative', width: 'fit-content' }}>
            <button style={{ backgroundColor: 'red', color: 'white', border: '1px solid #28a745', width: '200px', height:'30px', float: 'right', margin:'20px 0', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', ':hover': { backgroundColor: '#218838' } }} onClick={handleCloseButtonClick}>Close form</button>
            <h2 style={{ marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Add new Student</h2>
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
            <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required style={{marginTop:'10px'}}/>
            <div style={{ display: 'flex', alignItems: 'center', marginTop:'20px', marginBottom: '30px' }}>
              <label htmlFor="collegeSelect" style={{ marginRight: '10px' }}>Select College:</label>
              <select id="collegeSelect" name="collegeId" value={formData.collegeId} onChange={handleInputChange} required style={{ width: '60%', padding: '8px', borderRadius: '5px' }}>
                <option value="">Select College</option>
                {colleges.map(college => (
                  <option key={college._id} value={college._id}>{college.collegeName}</option>
                ))}
              </select>
            </div>
            <label htmlFor="profile-pic-upload" className="profile-pic-label">
                Your picture
                <input type="file" id="profile-pic-upload" name="profilePic" onChange={handleFileChange} required />
              </label>
            <button style={{ backgroundColor: 'green', color: 'white' }} onClick={handleAddStudent}>Add Student</button>
          </div>
        )}
        {showEditForm && (
          <div style={{ marginTop: '80px', border: '1px solid black', padding: '10px', position: 'relative', width: 'fit-content' }}>
            <button style={{ backgroundColor: 'red', color: 'white', border: '1px solid #28a745', width: '200px', height:'30px', float: 'right', margin:'20px 0', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', ':hover': { backgroundColor: '#218838' } }} onClick={handleCloseButtonClick}>Close form</button>
            <h2 style={{ marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Edit Student</h2>
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
            <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
            <button style={{ backgroundColor: 'green', color: 'white', marginTop:'23px'}} onClick={handleEditStudent}>Update Details</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageStudent;
