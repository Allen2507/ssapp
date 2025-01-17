import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendancePage = () => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        axios.get('/children_profiles').then(response => {
            setStudents(response.data);
            
            // Initialize attendance state with 'Present' by default
            const initialAttendance = {};
            response.data.forEach(student => {
                initialAttendance[student.id] = 'Present';  // Default to 'Present'
            });
            setAttendance(initialAttendance);
        }).catch(error => {
            console.error('Error fetching students:', error);
        });
    }, []);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = () => {
        const attendanceRecords = students.map(student => ({
            child_id: student.id,
            status: attendance[student.id],  // Will use the current status (default 'Present' if not changed)
            standard: student.standard
        }));

        axios.post('/submit_attendance', { attendanceRecords })
            .then(response => {
                alert(response.data.message);
            })
            .catch(error => {
                console.error('Error submitting attendance:', error);
            });
    };

    const handleAccordionToggle = (standard) => {
        setExpanded(expanded === standard ? null : standard);
    };

    const renderStudentsByStandard = (standard) => {
        return students.filter(student => student.standard === standard).map(student => (
            <div key={student.id} className="student-entry">
                <span>{student.name}</span>
                <select 
                    value={attendance[student.id]}  // Use the default or updated value
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                </select>
            </div>
        ));
    };

    const standards = [...new Set(students.map(student => student.standard))];

    return (
        <div className="attendance-page">
            <h2>Mark Attendance</h2>
            {standards.map(standard => (
                <div key={standard} className="standard-accordion">
                    <button onClick={() => handleAccordionToggle(standard)}>
                        {standard}
                    </button>
                    {expanded === standard && (
                        <div className="students-list">
                            {renderStudentsByStandard(standard)}
                        </div>
                    )}
                </div>
            ))}
            <button onClick={handleSubmit} className="btn-submit-attendance">Submit Attendance</button>
        </div>
    );
};

export default AttendancePage;
