import React, { useState } from "react";
import axios from "axios";
import styles from "./css/ChildProfileForm.module.css";

const ChildrenProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    religion: "",
    denomination: "",
    baptism_date: "",
    holy_spirit_date: "",
    doa: "",
    standard: "",
    medium: "",
    admission_number: "",
    location: "",
    address: "",
    student_mobile_1: "",
    student_mobile_2: "",
    father_name: "",
    father_religion: "",
    father_denomination: "",
    father_baptism_date: "",
    father_holy_spiritdate: "",
    father_mobile: "",
    mother_name: "",
    mother_religion: "",
    mother_denomination: "",
    mother_baptism_date: "",
    mother_holy_spirit_date: "",
    mother_mobile: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post form data to backend
      const response = await axios.post("http://localhost:3001/children_profile_form",formData);
      if (response.status === 200) {
        setSuccessMessage("Child profile created successfully!");
        setErrorMessage("");
        setFormData({
          name: "",
          dob: "",
          gender: "",
          religion: "",
          denomination: "",
          baptism_date: "",
          holy_spirit_date: "",
          doa: "",
          standard: "",
          medium: "",
          admission_number: "",
          location: "",
          address: "",
          student_mobile_1: "",
          student_mobile_2: "",
          father_name: "",
          father_religion: "",
          father_denomination: "",
          father_baptism_date: "",
          father_holy_spirit_date: "",
          father_mobile: "",
          mother_name: "",
          mother_religion: "",
          mother_denomination: "",
          mother_baptism_date: "",
          mother_holy_spirit_date: "",
          mother_mobile: "",
        });
      }
    } catch (error) {
      setErrorMessage("Error creating child profile. Please try again.");
      setSuccessMessage("");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Child Profile</h2>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.form_group}>
          <label>Name </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Date of Birth </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Gender </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className={styles.form_group}>
          <label>Religion </label>
          <input
            type="text"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Denomination </label>
          <input
            type="text"
            name="denomination"
            value={formData.denomination}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Baptism Date </label>
          <input
            type="date"
            name="baptismDate"
            value={formData.baptism_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Holy Spirit Date </label>
          <input
            type="date"
            name="holySpiritDate"
            value={formData.holy_spirit_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Date of Admission </label>
          <input
            type="date"
            name="doa"
            value={formData.doa}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Standard </label>
          <input
            type="text"
            name="standard"
            value={formData.standard}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Medium </label>
          <select
            name="medium"
            value={formData.medium}
            onChange={handleChange}
            required
          >
            <option value="">Select Medium</option>
            <option value="English">English</option>
            <option value="Tamil">Tamil</option>
          </select>
        </div>

        <div className={styles.form_group}>
          <label>Admission Number </label>
          <input
            type="text"
            name="admissionNumber"
            value={formData.admission_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Location </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Address </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Student Mobile 1 </label>
          <input
            type="tel"
            name="studentMobile1"
            value={formData.student_mobile_1}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Student Mobile 2 </label>
          <input
            type="tel"
            name="studentMobile2"
            value={formData.student_mobile_2}
            onChange={handleChange}
            required
          />
        </div>

        {/* Father Details */}
        <h3>Father's Details</h3>
        <div className={styles.form_group}>
          <label>Father's Name </label>
          <input
            type="text"
            name="fatherName"
            value={formData.father_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Father's Religion </label>
          <input
            type="text"
            name="fatherReligion"
            value={formData.father_religion}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Father's Denomination </label>
          <input
            type="text"
            name="fatherDenomination"
            value={formData.father_denomination}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Father's Baptism Date </label>
          <input
            type="date"
            name="fatherBaptismDate"
            value={formData.father_baptism_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Father's Holy Spirit Date </label>
          <input
            type="date"
            name="fatherHolySpiritDate"
            value={formData.father_holy_spirit_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Father's Mobile </label>
          <input
            type="tel"
            name="fatherMobile"
            value={formData.father_mobile}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mother Details */}
        <h3>Mother's Details</h3>
        <div className={styles.form_group}>
          <label>Mother's Name </label>
          <input
            type="text"
            name="motherName"
            value={formData.mother_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Mother's Religion </label>
          <input
            type="text"
            name="motherReligion"
            value={formData.mother_religion}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Mother's Denomination </label>
          <input
            type="text"
            name="motherDenomination"
            value={formData.mother_denomination}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Mother's Baptism Date </label>
          <input
            type="date"
            name="motherBaptismDate"
            value={formData.mother_baptism_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Mother's Holy Spirit Date </label>
          <input
            type="date"
            name="motherHolySpiritDate"
            value={formData.mother_holy_spirit_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Mother's Mobile </label>
          <input
            type="tel"
            name="motherMobile"
            value={formData.mother_mobile}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.submit}>
          <button type="submit">Create Profile</button>
        </div>
      </form>
    </div>
  );
};

export default ChildrenProfileForm;
