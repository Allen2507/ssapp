import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/TeacherProfileView.module.css';

const TeacherView = () => {
  const [teacherProfiles, setTeacherProfiles] = useState([]);
  const navigate = useNavigate();

  // Fetch teacher profiles from the backend
  useEffect(() => {
    const fetchTeacherProfiles = async () => {
      try {
        const response = await fetch('http://localhost:3001/teacher_profile_view');
        const data = await response.json();
        setTeacherProfiles(data.data || []); 
      } catch (error) {
        console.error('Error fetching teacher profiles:', error);
      }
    };

    fetchTeacherProfiles(); // Fetch the data when the component is mounted
  }, []);

  const viewProfile=(teacherId)=>{
    navigate(`/view-teacher-profile/${teacherId}`);
  }

  return (
    <div className={styles.teacherProfilesContainer}>
      <h2>Teacher Profiles</h2>
      {teacherProfiles.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              {/* <th>Age</th>
              <th>Address</th>
              <th>Mobile Number 1</th>
              <th>Mobile Number 2</th>
              <th>Baptism Date</th>
              <th>Holy Spirit Date</th> */}
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {teacherProfiles.map((teacher, index) => (
              <tr key={index}>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                {/* <td>{teacher.age}</td>
                <td>{teacher.address}</td>
                <td>{teacher.mobile_1}</td>
                <td>{teacher.mobile_2}</td>
                <td>{formatDate(teacher.baptism_date)}</td>
                <td>{formatDate(teacher.holy_spirit_date)}</td> */}
                <td>
                  <button 
                    className={styles.viewButton} 
                    onClick={() => viewProfile(teacher.id)}
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noProfiles}>No teacher profiles available.</p>
      )}
    </div>
  );
};

export default TeacherView;
