import React, { useState } from 'react';
import './ProblemDescription.css';

const ProblemDescription = () => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="problem-description">
      <div className="tabs">
        <button onClick={() => setActiveTab('description')}>Description</button>
        <button onClick={() => setActiveTab('editorial')}>Editorial</button>
        <button onClick={() => setActiveTab('discussion')}>Discussion</button>
        <button onClick={() => setActiveTab('submissions')}>Submissions</button>
      </div>

      <div className="tab-content">
        {activeTab === 'description' && <div>Description content here...</div>}
        {activeTab === 'editorial' && <div>Editorial content here...</div>}
        {activeTab === 'discussion' && <div>Discussion content here...</div>}
        {activeTab === 'submissions' && <div>Submissions content here...</div>}
      </div>
    </div>
  );
};

export default ProblemDescription;
