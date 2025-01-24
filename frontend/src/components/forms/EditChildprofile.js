import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../css/editChildProfile.module.css';

const EditChildProfile = () => {
  const { childId } = useParams(); // Get child ID from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    religion: '',
    denomination: '',
    baptismDate: '',
    holySpiritDate: '',
    address: '',
    studentMobile1: '',
    studentMobile2: '',
    standard: '',
    medium: '',
    admissionNumber: '',
    location: '',
    fatherName: '',
    fatherReligion: '',
    fatherDenomination: '',
    fatherBaptismDate: '',
    fatherHolySpiritDate: '',
    fatherMobile: '',
    motherName: '',
    motherReligion: '',
    motherDenomination: '',
    motherBaptismDate: '',
    motherHolySpiritDate: '',
    motherMobile: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch the existing child profile data
    const fetchChildProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/child_profile/${childId}`);
        const data = await response.json();
        console.log('Child Profile:', data.data);
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setFormData(data.data);
        }
      } catch (error) {
        setErrorMessage('Error fetching child profile');
        console.error(error);
      }
    };

    fetchChildProfile();
  }, [childId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      dob: formatDate(formData.dob),
      baptism_date: formatDate(formData.baptism_date),
      holy_spirit_date: formatDate(formData.holy_spirit_date),
    };
    try {
      const response = await fetch(`http://localhost:3001/edit-child-profile/${childId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Profile updated successfully!');
        setErrorMessage('');
        navigate(`/child-profile/${childId}`);
      } else {
        setErrorMessage(data.error || 'Failed to update profile');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the profile');
      console.error(error);
    }
  };

  //Format date to yyyy-mm-dd
  const formatDate = (date) => {
    const rawDate = new Date(date);
    const formatDate = new Date(rawDate.toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}));

    let year = formatDate.getFullYear();
    let month = ('0' + (formatDate.getMonth() + 1)).slice(-2);
    let day = ('0' + formatDate.getDate()).slice(-2);
    const fullDate = `${year}-${month}-${day}`;

    return fullDate;
  };

  return (
    <div className={styles.editProfileContainer}>
      <h2>Edit Child Profile</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Personal Details */}
        <div className={styles.section}>
          <h3>Personal Details</h3>
          <label>
            Name: <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Date of Birth: <input type="date" name="dob" value={formatDate(formData.dob)} onChange={handleChange} />
          </label>
          <label>
            Gender: 
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label>
            Religion: <input type="text" name="religion" value={formData.religion} onChange={handleChange} />
          </label>
          <label>
            Denomination: <input type="text" name="denomination" value={formData.denomination} onChange={handleChange} />
          </label>
          <label>
            Baptism Date: <input type="date" name="baptismDate" value={formatDate(formData.baptism_date)} onChange={handleChange} />
          </label>
          <label>
            Holy Spirit Date: <input type="date" name="holySpiritDate" value={formatDate(formData.holy_spirit_date)} onChange={handleChange} />
          </label>
        </div>

        {/* Contact Details */}
        <div className={styles.section}>
          <h3>Contact Details</h3>
          <label>
            Address: <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </label>
          <label>
            Student Mobile 1: <input type="tel" name="studentMobile1" value={formData.student_mobile_1} onChange={handleChange} />
          </label>
          <label>
            Student Mobile 2: <input type="tel" name="studentMobile2" value={formData.student_mobile_2} onChange={handleChange} />
          </label>
        </div>

        {/* Academic Details */}
        <div className={styles.section}>
          <h3>Academic Details</h3>
          <label> Standard:</label> 
          <select name="standard" value={formData.standard} onChange={handleChange}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="Senior 1st Year">Senior 1st Year</option>
            <option value="Senior 2nd Year">Senior 2nd Year</option>
          </select> 
          <label>
            Medium: <input type="text" name="medium" value={formData.medium} onChange={handleChange} />
          </label>
          <label>
            Admission Number: <input type="text" name="admissionNumber" value={formData.admission_number} onChange={handleChange} />
          </label>
          <label>
            Location: <input type="text" name="location" value={formData.location} onChange={handleChange} />
          </label>
        </div>

        {/* Parent Details */}
        <div className={styles.section}>
          <h3>Father's Details</h3>
          <label>
            Name <input type="text" name="fatherName" value={formData.father_name} onChange={handleChange} />
          </label>
          <label>
            Mobile <input type="tel" name="fatherMobile" value={formData.father_mobile} onChange={handleChange} />
          </label>
          <label>
            Religion <input type="text" name="fatherReligion" value={formData.father_religion} onChange={handleChange} />
          </label>
          <label>
            Denomination <input type="text" name="fatherDenomination" value={formData.father_denomination} onChange={handleChange} />
          </label>
          <label>
            Baptism Date <input type="date" name="fatherBaptismDate" value={formatDate(formData.father_baptism_date)} onChange={handleChange} />
          </label>
          <label>
            Holy Spirit Date <input type="date" name="fatherHolySpiritDate" value={formatDate(formData.father_holy_spirit_date)} onChange={handleChange} />
          </label>  
        </div>
        <div className={styles.section}>
          <h3>Mother's Details</h3>
          <label>
            Name <input type="text" name="motherName" value={formData.mother_name} onChange={handleChange} />
          </label>
          <label>
            Mobile <input type="tel" name="motherMobile" value={formData.mother_mobile} onChange={handleChange} />
          </label>
          <label>
            Religion <input type="text" name="motherReligion" value={formData.mother_religion} onChange={handleChange} />
          </label>
          <label>
            Denomination <input type="text" name="motherDenomination" value={formData.mother_denomination} onChange={handleChange} />
          </label>
          <label>
            Baptism Date <input type="date" name="motherBaptismDate" value={formatDate(formData.mother_baptism_date)} onChange={handleChange} />
          </label>
          <label>
            Holy Spirit Date <input type="date" name="motherHolySpiritDate" value={formatDate(formData.mother_holy_spirit_date)} onChange={handleChange} />
          </label>
        </div>
        <button type="submit" className={styles.submitButton}>Update Profile</button>
      </form>
    </div>
  );
};

export default EditChildProfile;
