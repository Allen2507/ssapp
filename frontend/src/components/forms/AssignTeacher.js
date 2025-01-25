import React, { useState, useEffect } from 'react';
import styles from '../css/assignTeacherTable.module.css';

const AssignTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');
  // const [originalAssignments, setOriginalAssignments] = useState([]);

  const branches = [
    'Main',
    'Devanesan Nagar',
    'Urapakkam',
    'KaranaiPuducherry',
    'Periyar Nagar',
    'Alapakkam',
    'Vandalur',
    'Otteri',
    'Nerkundram',
    'Kovilambakkam',
  ];

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:3001/teacher-assign-view');
        const data = await response.json();
        if(data?.teachers){
        setTeachers(data.teachers);

        // Initialize assignments state for each teacher
        const initialAssignments = data.teachers.map((teacher) => ({
          teacherId: teacher.id,
          branch: teacher.branch,
          standard: teacher.standard,
          medium: teacher.medium,
        }));
        setAssignments(initialAssignments);
        // setOriginalAssignments(initialAssignments);
    } else{
        console.log("Unexpected Data Structure", data);
    } 
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[index][field] = value;
    setAssignments(updatedAssignments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/assign-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignments),
      });
      const data = await response.json();

      setMessage(data.message);
      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error submitting assignments:', error);
      setMessage('Failed to assign teachers.');
    }
  };

  const handleReset = () => {
    const resetAssignments = teachers.map((teacher) => ({
        teacherId: teacher.id,
        branch: 'NOT ASSIGNED',
        standard: 'NOT ASSIGNED',
        medium: 'NOT ASSIGNED',
    }));

    setAssignments(resetAssignments);
    setMessage('Reset successful.');
    setTimeout(() => {
        setMessage('');
      }, 3000);

    // alert('Form has been reset to default values. All assignments have been cleared.');
};

  return (
    <div className={styles.assignTeacherContainer}>
      <h2>Assign Teachers</h2>
      {message && <p style={{ color: "green", margin: "20px 30%" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <table className={styles.teacherTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Branch</th>
              <th>Standard</th>
              <th>Medium</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher.id}>
                <td>{teacher.name}</td>
                <td>
                  <select
                    value={assignments[index]?.branch || ''}
                    onChange={(e) =>
                      handleAssignmentChange(index, 'branch', e.target.value)
                    }
                  >
                    <option value="NOT ASSIGNED" hidden>UNASSIGNED</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    placeholder="Enter Standard"
                    value={assignments[index]?.standard || ''}
                    onChange={(e) =>
                      handleAssignmentChange(index, 'standard', e.target.value)
                    }
                  >
                    <option value="NOT ASSIGNED" hidden>UNASSIGNED</option>
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
                </td>
                <td>
                  <select
                    placeholder="Enter Medium"
                    value={assignments[index]?.medium || ''}
                    onChange={(e) =>
                      handleAssignmentChange(index, 'medium', e.target.value)
                    }
                  >
                    <option value="NOT ASSIGNED" hidden>UNASSIGNED</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton}>Submit</button>
          <button onClick={handleReset} className={styles.resetButton}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default AssignTeacher;
