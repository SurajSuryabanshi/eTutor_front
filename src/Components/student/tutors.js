import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentSidebar from '../../Partials/studentsidebar';
import '../../css/tutorpage.css';
import { useNavigate }from 'react-router-dom'; // Import useNavigate


const StudentTutorsPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [tutors, setTutors] = useState([]);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await axios.get('https://etutor-back.onrender.com/api/tutor/tutors');
                setTutors(response.data);
            } catch (error) {
                console.error('Error fetching tutors:', error);
            }
        };
        fetchTutors();
    }, []);

    const handleBookTutor = async (tutorId) => {
        localStorage.setItem('selectedTutor', JSON.stringify(tutorId));
        navigate('/Book-Tutor');     };

    return (
        <div className="page-container">
            <aside>
                <StudentSidebar />
            </aside>
            <main className='main-content'>
                <u><h1 style={{ textAlign: 'center' }}>Tutors</h1></u>
                {feedback && <p>{feedback}</p>}
                <div className="tutor-container">
                    {tutors.map((tutor) => (
                        <div key={tutor._id} className="tutor-card">

                            <div className="tutor-details">
                                <h2>{`${tutor.firstName} ${tutor.lastName}`}</h2>
                                <p>Email: {tutor.email}</p>
                                <p>Languages: {tutor.languages}</p>
                                <p>Courses: {tutor.courses}</p>
                                {tutor.college ? (
                                    <p>College: {tutor.college.collegeName}</p>
                                ) : (
                                    <p>College:Not specified</p>
                                )}
                                <button className="tutor-book-button" onClick={() => handleBookTutor(tutor._id)}>Book</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default StudentTutorsPage;
