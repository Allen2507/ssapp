import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/viewChildProfiles.module.css';

const ViewChildProfiles = () => {
  const [childrenProfiles, setChildrenProfiles] = useState([]);
  const [expandedStandard, setExpandedStandard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildrenProfiles = async () => {
      try {
        const response = await fetch('http://localhost:3001/children_profiles');
        const data = await response.json();
        setChildrenProfiles(data.data || []);
      } catch (error) {
        console.error('Error fetching children profiles:', error);
        setChildrenProfiles([]);
      }
    };

    fetchChildrenProfiles();
  }, []);

  // Group profiles by standard
  const profilesByStandard = (childrenProfiles || []).reduce((groups, profile) => {
    const standard = profile.standard || 'Unknown'; 
    if (!groups[standard]) {
      groups[standard] = [];
    }
    groups[standard].push(profile);
    return groups;
  }, {});

  // Add debug log here
  console.log('Grouped Profiles by Standard:', profilesByStandard);

  const handleChildClick = (childId) => {
    navigate(`/child-profile/${childId}`);
  };

  const toggleAccordion = (standard) => {
    setExpandedStandard(expandedStandard === standard ? null : standard);
  };

  return (
    <div className={styles.child_profiles_container}>
  <h2>View Child Profile</h2>
  {Object.keys(profilesByStandard).length === 0 && <p>No profiles to display.</p>}
  {Object.keys(profilesByStandard).map((standard) => {
    console.log('Rendering accordion for Standard:', standard);
    return (
      <div key={standard} className="accordion" id='accordion'>
      <div className="accordion-item">
        <div className="accordion-header" onClick={() => toggleAccordion(standard)}>
          <button className='accordion-button' type='button' data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded='true' aria-controls='collapseOne'> 
          <h3 className={styles.accordion_head}>Standard {standard}</h3>
          </button>
        </div>
        {expandedStandard === standard && (
          <div id='collapseOne' className='accordion-collapse collapse show' data-bs-parent='#accordion'>
          <div className="accordion-body">
            <table className={styles.child_profile_table}>
              <thead>
                <tr>
                  <th>Admission Number</th>
                  <th>Name</th>
                  <th>Medium</th>
                </tr>
              </thead>
              <tbody>
                {profilesByStandard[standard].map((child) => (
                  <tr key={child.id} onClick={() => handleChildClick(child.id)} className="child-row">
                    <td>{child.admission_number}</td>
                    <td>{child.name}</td>
                    <td>{child.medium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}
        </div>
      </div>
    );
  })}
</div>

  );
};

export default ViewChildProfiles;