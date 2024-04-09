import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import LoginForm from './Sign-in/loginform.js';
import RegisterCollege from './Sign-in/register-college.js';
import RegisterTutor from './Sign-in/register-tutor.js';
import RegisterStudent from './Sign-in/register-student.js';
import TutorProfile from './Components/tutor/profileTutor.js';
import TutorDashboard from './Components/tutor/dashboard.js'
import TutorTimetable from './Components/tutor/time-table.js'
import StudentSearch from './Components/student/searchTutor.js'; 
import Bookings from './Components/student/bookings.js';
import College from './Components/student/mycollege.js';
import CollegeTutors from './Components/student/collegetutors.js';
import TutorList from './Components/student/tutors.js';
import StudentProfile from './Components/student/profiletudent.js';
import BookTutor from './Components/student/bookTutor.js';
import ManageStudent from './Components/admin/manageStudent.js';
import ManageTutor from './Components/admin/manageTutor.js';
import ManageCollege from './Components/admin/manageCollege.js';
import ManageBookings from './Components/admin/manageBookings.js';
function App() {
  return (
    <Routes>
      {}
      <Route path="/" element={<LoginForm />} /> 
      <Route path="/register-college" element={<RegisterCollege />} />
      <Route path="/register-student" element={<RegisterStudent />} />
      <Route path="/register-tutor" element={<RegisterTutor />} />
      <Route path="/tutorprofile" element={<TutorProfile />} />
      <Route path="/tutor-search" element={<StudentSearch />} />
      <Route path="/tutor-dashboard" element={<TutorDashboard />} />
      <Route path="/tutor-timetable" element={<TutorTimetable />} />
      <Route path="/booking-page" element={<Bookings />} />
      <Route path="/my-college" element={<College/>} />
      <Route path="/tutors" element={<TutorList/>} />
      <Route path="/studentprofile" element={<StudentProfile />} />
      <Route path="/college-tutors" element={<CollegeTutors/>} />
      <Route path="/Book-Tutor" element={<BookTutor/>} />
      <Route path="/manage-bookings" element={<ManageBookings/>}/>
      <Route path="/manage-student" element={<ManageStudent/>}/>
      <Route path="/manage-tutor" element={<ManageTutor/>}/>
      <Route path="/manage-college" element={<ManageCollege/>}/>


    </Routes>
  );
}

export default App;

