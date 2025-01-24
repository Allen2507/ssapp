import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../css/childProfileDetails.module.css';

const ChildProfileDetails = () => {
  const { childId } = useParams();
  const [childProfile, setChildProfile] = useState(null);
  const navigate = useNavigate();
  const[isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchChildProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/child_profile/${childId}`);
        const data = await response.json();
        setChildProfile(data.data);
        console.log('Child Profile:', data.data);
      } catch (error) {
        console.error('Error fetching child profile:', error);
      }
    };

    fetchChildProfile();
  }, [childId]);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    handleDelete();
    setIsModalOpen(false);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
  
    try {
      const response = await fetch(`http://localhost:3001/child_profile/${childId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }
      alert('Profile deleted successfully!');
      navigate('/child-profiles'); // Redirect to the list of profiles
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('An error occurred while deleting the profile.');
    }
  };

const formatDate = (date) => {
  const formatDate = new Date(date);
  return formatDate.toLocaleDateString('en-GB');
};

  if (!childProfile) {
    return <p>Loading child profile...</p>;
  }

  return (
    <div className={styles.childProfileDetails}>
      <h2 className={styles.title}>{childProfile.name}'s Profile</h2>
      <div className={styles.buttonContainer}>
        <button className={styles.editButton} onClick={() => navigate(`/edit-child-profiles/${childId}`)}>Edit Profile</button>
        <button className={styles.deleteButton} onClick={handleDeleteClick}>Delete Profile</button>
      </div>
      <table className={styles.profileTable}>
        <thead>
          <tr>
            <th colSpan="2">Personal Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{childProfile.name}</td>
          </tr>
          <tr>
            <td>Gender</td>
            <td>{childProfile.gender}</td>
          </tr>
          <tr>
            <td>DOB</td>
            <td>{formatDate(childProfile.dob)}</td>
          </tr>
          <tr>
            <td>Age</td>
            <td>{childProfile.age}</td>
          </tr>
          <tr>
            <td>Religion</td>
            <td>{childProfile.religion}</td>
          </tr>
          <tr>
            <td>Denomination</td>
            <td>{childProfile.denomination}</td>
          </tr>
          <tr>
            <td>Baptism Date</td>
            <td>{formatDate(childProfile.baptism_date)}</td>
          </tr>
          <tr>
            <td>Holy Spirit Date</td>
            <td>{formatDate(childProfile.holy_spirit_date)}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th colSpan="2">Contact Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Address</td>
            <td>{childProfile.address}</td>
          </tr>
          <tr>
            <td>Mobile 1</td>
            <td>{childProfile.student_mobile_1}</td>
          </tr>
          <tr>
            <td>Mobile 2</td>
            <td>{childProfile.student_mobile_2}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th colSpan="2">Academic Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Standard</td>
            <td>{childProfile.standard}</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>{childProfile.medium}</td>
          </tr>
          <tr>
            <td>Admission Number</td>
            <td>{childProfile.admission_number}</td>
          </tr>
          <tr>
            <td>Admission Date</td>
            <td>{formatDate(childProfile.doa)}</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>{childProfile.location}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th colSpan="2">Father's Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{childProfile.father_name}</td>
          </tr>
          <tr>
            <td>Mobile</td>
            <td>{childProfile.father_mobile}</td>
          </tr>
          <tr>
            <td>Religion</td>
            <td>{childProfile.father_religion}</td>
          </tr>
          <tr>
            <td>Denomination</td>
            <td>{childProfile.father_denomination}</td>
          </tr>
          <tr>
            <td>Baptism Date</td>
            <td>{formatDate(childProfile.father_baptism_date)}</td>
          </tr>
          <tr>
            <td>Holy Spirit Date</td>
            <td>{formatDate(childProfile.father_holy_spirit_date)}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th colSpan="2">Mother's Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{childProfile.mother_name}</td>
          </tr>
          <tr>
            <td>Mobile</td>
            <td>{childProfile.mother_mobile}</td>
          </tr>
          <tr>
            <td>Religion</td>
            <td>{childProfile.mother_religion}</td>
          </tr>
          <tr>
            <td>Denomination</td>
            <td>{childProfile.mother_denomination}</td>
          </tr>
          <tr>
            <td>Baptism Date</td>
            <td>{formatDate(childProfile.mother_baptism_date)}</td>
          </tr>
          <tr>
            <td>Holy Spirit Date</td>
            <td>{formatDate(childProfile.mother_holy_spirit_date)}</td>
          </tr>
        </tbody>
      </table>
      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this profile?</p>
            <div className={styles.modalButtonContainer}>
              <button className={styles.confirmButton} onClick={confirmDelete}>
                Delete
              </button>
              <button className={styles.cancelButton} onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildProfileDetails;
