import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentSidebar from '../../Partials/studentsidebar';
import '../../css/search.css';
import '../../css/tutorpage.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const Search = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchName, setSearchName] = useState('');
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showSearchCriteria, setShowSearchCriteria] = useState(false); // State to track whether to show search criteria line

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/college/');
        setColleges(response.data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedColleges.length === 0) {
        response = await axios.get('http://localhost:5000/api/tutor/search', {
          params: {
            name: searchName,
          },
        });
      } else if (selectedColleges.length > 0 && searchName.trim() === '') {
        response = await axios.get('http://localhost:5000/api/tutor/search', {
          params: {
            colleges: selectedColleges,
          },
        });
      } else {
        response = await axios.get('http://localhost:5000/api/tutor/search', {
          params: {
            name: searchName,
            colleges: selectedColleges,
          },
        });
      }
      setSearchResults(response.data);
      setLoading(false);
      setShowSearchCriteria(true); // Set to true after search button is clicked
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setLoading(false);
    }
  };

  const handleBookTutor = async (tutorId) => {
    localStorage.setItem('selectedTutor', JSON.stringify(tutorId));
    navigate('/Book-Tutor');    
  };

  return (
    <div>
      <aside>
        <StudentSidebar />
      </aside>
      <div className='main-content'>
      <u><h1 style={{ textAlign: 'center' }}>Search</h1></u>
        <div className="search-container">
          <label htmlFor="searchName" className="bold-label">Tutor Name:</label>
          <input
            type="text"
            id="searchName"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search by Tutor's Name"
            className="search-input"
            style={{ width: '200px', marginRight: '10px' }}
          />
          <label htmlFor="collegeSelect" className="bold-label">College Name:</label>
          <select
            id="collegeSelect"
            value={selectedColleges}
            onChange={(e) => {
              if (e.target.value === '') {
                setSelectedColleges([]);
              } else {
                setSelectedColleges(Array.from(e.target.selectedOptions, option => option.value));
              }
            }}
            className="college-select"
            multiple
            style={{ width: '200px', height: '100px' }}
          >
            <option value="">Refresh selection</option>
            {colleges.map(college => (
              <option key={college._id} value={college._id}>{college.collegeName}</option>
            ))}
          </select>
          <button onClick={handleSearch} disabled={loading} className="search-button">Search</button>
        </div>

        {loading && <p>Loading...</p>}

        {showSearchCriteria && ( // Conditionally render the container for search results and lines
         <div className="search-results-container">
          <div className="search-results-line"></div>
          <div className="search-results-heading">Search Results</div>
           <div className="search-results-line"></div>
        </div>                
        )}

        <div className="tutor-container">
          {searchResults.map(tutor => (
            <div key={tutor._id} className="tutor-card">
              <div className="tutor-details">
                <h2>{`${tutor.firstName} ${tutor.lastName}`}</h2>
                <p>Email: {tutor.email}</p>
                <p>Languages: {tutor.languages}</p>
                <p>Courses: {tutor.courses}</p>
                {tutor.college ? (
                  <p>College: {tutor.college.collegeName}</p>
                ) : (
                  <p>College: Not specified</p>
                )}
                <button className="tutor-book-button" onClick={() => handleBookTutor(tutor._id)}>Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
