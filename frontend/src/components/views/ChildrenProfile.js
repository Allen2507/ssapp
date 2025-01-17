import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/viewChildProfiles.module.css';

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
    <div className="child-profiles-container">
      <h2>View Child Profile</h2>
      {Object.keys(profilesByStandard).length === 0 && <p>No profiles to display.</p>}
      {Object.keys(profilesByStandard).map((standard) => {
        console.log('Rendering accordion for Standard:', standard);
        return (
          <div key={standard} className="accordion">
            <div className="accordion-header" onClick={() => toggleAccordion(standard)}>
              <h3>Standard {standard}</h3>
            </div>
            {expandedStandard === standard && (
              <div className="accordion-body">
                <ul>
                  {profilesByStandard[standard].map((child) => (
                    <li
                      key={child.id}
                      onClick={() => handleChildClick(child.id)}
                      className="child-name"
                    >
                      {child.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ViewChildProfiles;