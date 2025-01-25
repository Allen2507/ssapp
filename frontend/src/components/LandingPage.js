import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/LandingPage.module.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCreateChildProfile = () => {
    navigate('/child-profile');
  };

  const handleCreateTeacherProfile = () => {
    navigate('/teacher-profile');
  };

  const handleViewChildProfile = () => {
    navigate('/view-child-profiles');
  };

  const handleViewTeacherProfile = () => {
    navigate('/teacher_profile_view');
  };

  const handleAssignTeacher = () => {
    navigate('/assign-teacher');
  };


  // UI Source Start
  return (
    <div className={styles.container}>
      <h2>Welcome to the Admin Dashboard</h2>
      <p>Select an option below:</p>
      <button onClick={handleCreateChildProfile}>Create Child Profile</button><br/>
      <button onClick={handleCreateTeacherProfile}>Create Teacher Profile</button><br/>
      <button onClick={handleViewChildProfile}>View Child Profiles</button><br/>
      <button onClick={handleViewTeacherProfile}>View Teacher Profiles</button><br/>
      <button onClick={handleAssignTeacher}>Assign Teachers</button> 
    </div>
  );
  // UI Source End
};

export default LandingPage;
