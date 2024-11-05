import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QuestionList from './components/QuestionList';
import ProblemDescription from './components/ProblemDescription';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuestionList />} />
        <Route path="/problem/:titleSlug" element={<ProblemDescription />} />
      </Routes>
    </Router>
  );
}

export default App;
