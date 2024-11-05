import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './QuestionList.css';

const QuestionsList = () => {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('/api/questions');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setQuestions(data.data); // Assuming your response has a `data` property
            } catch (error) {
                setError(error.message);
            }
        };

        fetchQuestions();
    }, []);

    if (error) {
        return <div>Error fetching questions: {error}</div>;
    }

    return (
        <div className="questions-list">
            <h2>Questions</h2>
            <ul>
                {questions.map(question => (
                    <li key={question.questionId}>
                        <Link to={`/problem/${question.titleSlug}`}>
                            {question.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionsList;
