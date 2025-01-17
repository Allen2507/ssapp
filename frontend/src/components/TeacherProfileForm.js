import React, { useState } from 'react';
import axios from 'axios';

const TeacherProfileForm = () => {
  const [formData, setFormData] = useState({ name: '', age: '',address: '',mobileNumber1: '',mobileNumber2: '',baptismDate: '',holySpiritDate: ''});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData,[name]: value,});
  };

  //Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Structuring Formdata
    const preparedData = {
        name: formData.name,
        age: parseInt(formData.age), 
        address: formData.address,
        mobile_1: formData.mobileNumber1, 
        mobile_2: formData.mobileNumber2,
        baptism_date: formData.baptismDate,
        holy_spirit_date: formData.holySpiritDate,
    };

    try {
        // Post data to the backend
        const response = await axios.post('http://localhost:3001/teacher_profiles', preparedData);
        // Check for success response
        if (response.status === 200) {
            setSuccessMessage('Teacher profile created successfully!');
            setErrorMessage('');
            // Reset form fields after successful submission
            setFormData({
                name: '',
                age: '',
                address: '',
                mobileNumber1: '',
                mobileNumber2: '',
                baptismDate: '',
                holySpiritDate: '',
            });
        }
    } catch (error) {
        // Display error message
        setErrorMessage('Error creating teacher profile. Please try again.');
        setSuccessMessage('');
        console.error('Error submitting form:', error);
    }
};

  //UI Source Start
  return (
    <div>
      <h2>Create Teacher Profile</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required/>
        </div>
        <div>
          <label>Age: </label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required/>
        </div>
        <div>
          <label>Address: </label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required/>
        </div>
        <div>
          <label>Mobile Number 1: </label>
          <input type="tel" name="mobileNumber1" value={formData.mobileNumber1} onChange={handleChange} required/>
        </div>
        <div>
          <label>Mobile Number 2: </label>
          <input type="tel" name="mobileNumber2" value={formData.mobileNumber2} onChange={handleChange}/>
        </div>
        <div>
          <label>Date of Baptism: </label>
          <input type="date" name="baptismDate" value={formData.baptismDate} onChange={handleChange}/>
        </div>
        <div>
          <label>Date of Holy Spirit: </label>
          <input type="date" name="holySpiritDate" value={formData.holySpiritDate} onChange={handleChange}/>
        </div>
        <button type="submit">Create Teacher Profile</button>
      </form>
    </div>
  );
  //UI Source End
};

export default TeacherProfileForm;
