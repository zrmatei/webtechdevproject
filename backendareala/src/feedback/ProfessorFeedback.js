import React, { useState, useEffect } from "react";

function ProfessorFeedback() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch('http://localhost:3001/getAllFeedback');
                const data = await response.json();

                if (response.ok) {
                    setFeedback(data.feedback);
                } else {
                    setError(data.message || 'Failed to fetch feedback');
                }
            } catch (error) {
                setError('Error fetching feedback');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="feedback-view">
            <h1>All Feedback</h1>
            {loading ? (
                <p>Loading feedback...</p>
            ) : error ? (
                <p>{error}</p>
            ) : feedback.length === 0 ? (
                <p>No feedback available.</p>
            ) : (
                <ul>
                    {feedback.map((item, index) => (
                        <li key={index}>
                            <strong>Activity Code:</strong> {item.activity_code} <br />
                            <strong>Reaction:</strong> {item.reaction} <br />
                            <strong>Time:</strong> {new Date(item.created_at).toLocaleString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProfessorFeedback;
