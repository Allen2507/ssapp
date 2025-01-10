import React, { useState, useEffect } from 'react';

const TeacherProfileView = () => {
  const [teacherProfiles, setTeacherProfiles] = useState([]);

  // Fetch teacher profiles from the backend
  useEffect(() => {
    const fetchTeacherProfiles = async () => {
      try {
        const response = await fetch('https://sunday-school-db.onrender.com/teacher_profiles'); // Updated API call
        const data = await response.json();
        setTeacherProfiles(data); // Set the fetched data in state
      } catch (error) {
        console.error('Error fetching teacher profiles:', error);
      }
    };

    fetchTeacherProfiles(); // Fetch the data when the component is mounted
  }, []);

  return (
    <div>
      <h2>Teacher Profiles</h2>

      {/* Display the teacher profiles in a table */}
      {teacherProfiles.length > 0 ? (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Address</th>
              <th>Mobile Number 1</th>
              <th>Mobile Number 2</th>
              <th>Baptism Date</th>
              <th>Holy Spirit Date</th>
            </tr>
          </thead>
          <tbody>
            {teacherProfiles.map((teacher, index) => (
              <tr key={index}>
                <td>{teacher.name}</td>
                <td>{teacher.age}</td>
                <td>{teacher.address}</td>
                <td>{teacher.mobile_1}</td> {/* Match backend field */}
                <td>{teacher.mobile_2}</td> {/* Match backend field */}
                <td>{teacher.baptism_date}</td> {/* Match backend field */}
                <td>{teacher.holy_spirit_date}</td> {/* Match backend field */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No teacher profiles available.</p>
      )}
    </div>
  );
};

export default TeacherProfileView;
