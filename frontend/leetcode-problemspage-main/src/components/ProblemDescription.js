import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from './CodeEditor'; // Make sure to import your CodeEditor
import './ProblemDescription.css';

const ProblemDescription = () => {
  const { titleSlug } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/questions/${titleSlug}`);
        const data = await response.json();
        if (data.success) {
          setQuestion(data.data);
        } else {
          setError('Question not found');
        }
      } catch (err) {
        setError('Error fetching question details');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [titleSlug]);

  if (loading) return <p>Loading question...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="problem-description">
      <h2>{question.title}</h2>

      <div className="tabs">
        <button 
          className={activeTab === 'description' ? 'active' : ''} 
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button 
          className={activeTab === 'editorial' ? 'active' : ''} 
          onClick={() => setActiveTab('editorial')}
        >
          Editorial
        </button>
        <button 
          className={activeTab === 'discussion' ? 'active' : ''} 
          onClick={() => setActiveTab('discussion')}
        >
          Discussion
        </button>
        <button 
          className={activeTab === 'submissions' ? 'active' : ''} 
          onClick={() => setActiveTab('submissions')}
        >
          Submissions
        </button>
        <button 
          className={activeTab === 'editor' ? 'active' : ''} 
          onClick={() => setActiveTab('editor')}
        >
          Code Editor
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'description' && (
          <div className="content-container" style={{ display: 'flex' }}>
            <div className="description" style={{ flex: '0 0 30%', marginRight: '20px' }}>
              <h3>Description</h3>
              <p>{question.description}</p>
              <h4>Test Cases:</h4>
              {question.testCases.map(tc => (
                <div key={tc.id}>
                  <strong>Input:</strong> {tc.input} <br />
                  <strong>Expected Output:</strong> {tc.expectedOutput} <br />
                </div>
              ))}
            </div>
            <div className="code-editor" style={{ flex: '0 0 70%' }}>
              <h3>Code Editor</h3>
              <CodeEditor />
            </div>
          </div>
        )}
        {activeTab === 'editorial' && (
          <div>
            <h3>Editorial</h3>
            <p>This section contains the editorial for the problem...</p>
          </div>
        )}
        {activeTab === 'discussion' && (
          <div>
            <h3>Discussion</h3>
            <p>Join the discussion on this problem here...</p>
          </div>
        )}
        {activeTab === 'submissions' && (
          <div>
            <h3>Submissions</h3>
            <p>View past submissions and results here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDescription;
