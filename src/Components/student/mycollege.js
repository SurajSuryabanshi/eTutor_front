import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StudentSidebar from '../../Partials/studentsidebar';
import defaultCollegeImage from "../../css/college.jpg";

const MyCollegePage = () => {
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/student/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch student profile');
        }
        const data = await response.json();
        const collegeId = data.student.college;
        if (!collegeId) {
          throw new Error('College ID is undefined');
        }
        const collegeResponse = await fetch(`http://localhost:5000/api/college/${collegeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!collegeResponse.ok) {
          throw new Error('Failed to fetch college details');
        }

        const collegeData = await collegeResponse.json();
        setCollege(collegeData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching college details:', error);
        setLoading(false);
      }
    };

    fetchCollegeDetails();
  }, []);

  return (
    <div className="page-container">
      <aside>
        <StudentSidebar />
      </aside>
      <main style={{ marginLeft: 'auto', marginRight: 0 }}>
        <div>
          <u><h1 style={{ textAlign: 'center' }}>My College</h1></u>
          {loading && <p>Loading...</p>}
          {!loading && !college && (
            <p style={{ color: 'red', fontSize: '18px' }}>You need to be enrolled in a financial institution while registering to view this page.</p>
          )}
          {college && (
            <div style={{ border: '1px solid black', padding: '20px', textAlign: 'center' }}>
              <h2>{college.collegeName}</h2>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {/* Use the stored image path or default image */}
                <img src={college.picture || defaultCollegeImage} alt="College" style={{ maxWidth: '100%', maxHeight: '100%', margin: '10px' }} />
              </div>
              <div>
                <p><strong>Location:</strong> {college.location}</p>
                <p><strong>Email:</strong> {college.email}</p>
                <p><strong>Phone:</strong> {college.phoneNumber}</p>
              </div>
              <div style={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
                <h3>Description</h3>
                <p>{college.description}</p>
              </div>
              <Link to="/college-tutors" style={{ marginTop: '20px', display: 'block', textAlign: 'center' }}>View College Tutors</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyCollegePage;
