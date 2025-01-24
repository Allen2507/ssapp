import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../css/teacherProfileDetails.module.css';

const TeacherProfileDetails = () => {
  const [teacherProfile, setTeacherProfile] = useState(null);
  const { teacherId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/view-teacher-profile/${teacherId}`);
        const data = await response.json();
        setTeacherProfile(data.data);
      } catch (error) {
        console.error('Error fetching teacher profile:', error);
      }
    };

    fetchTeacherProfile();
  }, [teacherId]);

  if (!teacherProfile) {
    return <p>Teacher profile not found.</p>;
  }

  const formatDate = (date) => {
    const rawDate = new Date(date);
    const formattedDate = rawDate.toLocaleDateString('en-GB');
    return formattedDate;
  };

  return (
    <div className={styles.teacherProfileContainer}>
      <h2>{teacherProfile.name}'s Profile</h2>
      <table className={styles.profileTable}>
          <thead>
            <th colSpan="2">Personal Details</th>
          </thead>
          <tbody>
          <tr>
            <td><strong>Name:</strong></td>
            <td>{teacherProfile.name}</td>
          </tr>
          <tr>
            <td><strong>Age:</strong></td>
            <td>{teacherProfile.age}</td>
          </tr>
          <tr>
            <td><strong>Address:</strong></td>
            <td>{teacherProfile.address}</td>
          </tr>
          </tbody>
          <thead>
          <tr>
            <th colSpan="2">Contact Details</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><strong>Mobile 1:</strong></td>
            <td>{teacherProfile.mobile_1}</td>
          </tr>
          <tr>
            <td><strong>Mobile 2:</strong></td>
            <td>{teacherProfile.mobile_2}</td>
          </tr>
        </tbody>
          <thead>
          <tr>
            <th colSpan="2">Spiritual Details</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><strong>Baptism Date:</strong></td>
            <td>{formatDate(teacherProfile.baptism_date)}</td>
          </tr>
          <tr>
            <td><strong>Holy Spirit Date:</strong></td>
            <td>{formatDate(teacherProfile.holy_spirit_date)}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => navigate('/teacher_profile_view')} className={styles.backButton}>Back to List</button>
    </div>
  );
};

export default TeacherProfileDetails;
