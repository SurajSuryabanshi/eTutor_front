import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import StudentSidebar from '../../Partials/studentsidebar';
import '../../css/tutorpage.css';

const CollegeTutors = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [tutors, setTutors] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [collegeId, setCollegeId] = useState(null); // State to store college ID
  const [collegeName, setCollegeName] = useState(''); // State to store college name
  const [currentPage, setCurrentPage] = useState('my-college'); // New state for active page

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/student/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.data.student.college) {
          throw new Error('College ID is undefined');
        }
        setCollegeId(response.data.student.college);
        const collegeResponse = await axios.get(`http://localhost:5000/api/college/${response.data.student.college}`);
        setCollegeName(collegeResponse.data.collegeName); // Set college name
      } catch (error) {
        console.error('Error fetching college details:', error);
      }
    };

    fetchCollegeDetails();
  }, []);

  useEffect(() => {
    const fetchCollegeTutors = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/college/${collegeId}/tutors`);
        setTutors(response.data);
      } catch (error) {
        console.error('Error fetching college tutors:', error);
      }
    };
    if (collegeId) {
      fetchCollegeTutors();
    }
  }, [collegeId]); // Fetch tutors when collegeId changes
  const handleBookTutor = async (tutorId) => {
    localStorage.setItem('selectedTutor', JSON.stringify(tutorId));
    navigate('/Book-Tutor');      };

  return (
    <div className="page-container">
      <aside>
        <StudentSidebar selectedPage={currentPage} />
      </aside>
      <main className='main-content'>
            <u><h1 style={{ textAlign: 'center' }}>{collegeName} Tutors</h1></u>
        {feedback && <p>{feedback}</p>}
        <div className="tutor-container">
          {tutors.map((tutor) => (
            <div key={tutor._id} className="tutor-card">
              <div className="tutor-details">
                <h2>{`${tutor.firstName} ${tutor.lastName}`}</h2>
                <p>Email: {tutor.email}</p>
                <p>Languages: {tutor.languages}</p>
                <p>Courses: {tutor.courses}</p>
                <button className="tutor-book-button" onClick={() => handleBookTutor(tutor._id)}>Book</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CollegeTutors;
