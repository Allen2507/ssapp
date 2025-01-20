import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Login from './components/Login';
import ChildProfileForm from './components/ChildProfileForm';
import TeacherProfileForm from './components/TeacherProfileForm';
import LandingPage from './components/LandingPage'; 
import ProtectedRoute from './components/ProtectedRoute';
import TeacherProfileView from './components/views/TeacherProfileView.js';
import ChildrenProfileView from './components/views/ChildrenProfile.js';
import ChildProfileDetails from './components/views/profile/childProfileDetails.js';
import ViewAttendance from './components/views/ViewAttendance.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/landing" element={<ProtectedRoute component={LandingPage} />} /> 
        <Route path="/child-profile" element={<ProtectedRoute component={ChildProfileForm} />} />
        <Route path="/teacher-profile" element={<ProtectedRoute component={TeacherProfileForm} />} />
        <Route path="/view-child-profiles" element={<ProtectedRoute component={ChildrenProfileView} />} />
        <Route path="/child-profile/:childId" element={<ProtectedRoute component={ChildProfileDetails} />} />
        <Route path="/teacher_profile_view" element={<ProtectedRoute component={TeacherProfileView} />} />
        <Route path="/view-attendance" element={<ProtectedRoute component={ViewAttendance} />} />
      </Routes>
    </Router>
  );
}

export default App;
