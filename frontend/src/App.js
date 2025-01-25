import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import ProtectedRoute from './components/ProtectedRoute';

import Login from './components/Login';
import LandingPage from './components/LandingPage'; 

import ChildProfileForm from './components/forms/ChildProfileForm.js';
import TeacherProfileForm from './components/forms/TeacherProfileForm.js';

import ChildrenProfileView from './components/views/ChildrenView.js';
import ChildProfileDetails from './components/views/profile/childProfileDetails.js';
import EditChildProfile from './components/forms/EditChildprofile.js';
import AssignTeacher from './components/forms/AssignTeacher.js';

import TeacherView from './components/views/TeacherView.js';
import TeacherProfileDetails from './components/views/profile/teacherProfileDetails.js';

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
        <Route path="/edit-child-profiles/:childId" element={<ProtectedRoute component={EditChildProfile} />} />
        <Route path="/assign-teacher" element={<ProtectedRoute component={AssignTeacher} />} />
        
        <Route path="/teacher_profile_view" element={<ProtectedRoute component={TeacherView} />} />
        <Route path="/view-teacher-profile/:teacherId" element={<ProtectedRoute component={TeacherProfileDetails} />} />
      </Routes>
    </Router>
  );
}

export default App;
