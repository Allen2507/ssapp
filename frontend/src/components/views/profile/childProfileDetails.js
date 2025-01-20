import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/childProfileDetails.module.css';

const ChildProfileDetails = () => {
  const { childId } = useParams();
  const [childProfile, setChildProfile] = useState(null);

  useEffect(() => {
    // Fetch the details of the child from the backend based on admission number (childId)
    const fetchChildProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/child_profile/${childId}`);
        const data = await response.json();
        setChildProfile(data.data);
      } catch (error) {
        console.error('Error fetching child profile:', error);
      }
    };

    fetchChildProfile();
  }, [childId]);

const formatDate = (date) => {
  const formatDate = new Date(date);
  return formatDate.toLocaleDateString('en-GB');
};

  if (!childProfile) {
    return <p>Loading child profile...</p>;
  }

  return (
    <div className="child-profile-details">
      <h2>{childProfile.name}'s Profile</h2>
      <div className="profile-section">
        <h3>Personal Details</h3>
        <p>Name: {childProfile.name}</p>
        <p>Gender: {childProfile.gender}</p>
        <p>DOB: {formatDate(childProfile.dob)}</p>
        <p>Religion: {childProfile.religion}</p>
        <p>Denomination: {childProfile.denomination}</p>
        <p>Baptism Date: {formatDate(childProfile.baptism_date)}</p>
        <p>Holy Spirit Date: {formatDate(childProfile.holy_spirit_date)}</p>
      </div>
      <div className="profile-section">
        <h3>Contact Details</h3>
        <p>Address: {childProfile.address}</p>
        <p>Mobile 1: {childProfile.student_mobile_1}</p>
        <p>Mobile 2: {childProfile.student_mobile_2}</p>
      </div>
      <div className="profile-section">
        <h3>Academic Details</h3>
        <p>Standard: {childProfile.standard}</p>
        <p>Medium: {childProfile.medium}</p>
        <p>Admission Number: {childProfile.admission_number}</p>
        <p>Location: {childProfile.location}</p>
      </div>
      <div className="profile-section">
        <h3>Father's Details</h3>
        <p>Name: {childProfile.father_name}</p>
        <p>Mobile: {childProfile.father_mobile}</p>
      </div>
      <div className="profile-section">
        <h3>Mother's Details</h3>
        <p>Name: {childProfile.mother_name}</p>
        <p>Mobile: {childProfile.mother_mobile}</p>
      </div>
    </div>
  );
};

export default ChildProfileDetails;
