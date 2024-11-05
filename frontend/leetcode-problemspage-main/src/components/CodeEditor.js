// src/components/CodeEditor.js
import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import './CodeEditor.css'; // Import the CSS file

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const [testCases, setTestCases] = useState(['Test Case 1', 'Test Case 2']); // Example test cases

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleRun = async () => {
    try {
      const response = await axios.post('http://localhost:5000/execute', {
        code,
        language,
      });
      setOutput(response.data.output || response.data.error);
    } catch (error) {
      setOutput('Error executing code');
    }
  };

  return (
    <div className="code-editor">
      <select value={language} onChange={handleLanguageChange} style={{ marginBottom: '10px', padding: '5px' }}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        {/* Add more languages as needed */}
      </select>
      <Editor
        height="400px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || '')}
        options={{ selectOnLineNumbers: true }} // Example options
      />
      <button onClick={handleRun} style={{ marginTop: '10px' }}>Run</button>
      
      {/* Test Cases Section */}
      <div className="test-cases">
        <h3>Test Cases</h3>
        {testCases.map((testCase, index) => (
          <pre key={index}>{testCase}</pre>
        ))}
      </div>
      
      {/* Output Section */}
      <div className="output">
        <h3>Test Result</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
