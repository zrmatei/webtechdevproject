import React, { useState, useEffect } from "react";

function StudentForm() {
    const [searchCode, setSearchCode] = useState('');
    const [activityInfo, setActivityInfo] = useState(null);
    const [msg, setMsg] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const [timeLeft, setTimeLeft] = useState(null); // For countdown

    const handleSearch = async () => {
        if (!searchCode) {
            setMsg('Please enter a valid access code');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/getActivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accessCode: searchCode }),
            });

            const data = await response.json();

            if (response.ok) {
                setActivityInfo(data.activity);
                setTimeLeft(data.activity.time); // Initialize countdown
                setMsg('');
            } else {
                setMsg(data.message);
                setActivityInfo(null);
                setTimeLeft(null);
            }
        } catch (error) {
            setMsg('Server error!');
        }
    };

    // Countdown logic
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer); // Cleanup the timer
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const sendFeedback = async (reaction) => {
        try {
            const response = await fetch('http://localhost:3001/sendFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: searchCode, reaction }),
            });

            const data = await response.json();

            if (response.ok) {
                setFeedbackMsg(`Feedback sent: ${reaction}`);
            } else {
                setFeedbackMsg(data.message);
            }
        } catch (error) {
            setFeedbackMsg('Server error while sending feedback!');
        }
    };

    return (
        <div className="boxStudent">
            {!activityInfo ? (
                <>
                    <h1>Welcome Student</h1>
                    <label htmlFor="scode">Search by code:</label>
                    <input
                        type="number"
                        id="code"
                        name="scode"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                    />
                    <button
                        name="SaveBtnStudent"
                        id="savebtnstudent"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    {msg && <div>{msg}</div>}
                </>
            ) : (
                <div>
                    <h1>Activity Details</h1>
                    <p><strong>Activity Name:</strong> {activityInfo.activity}</p>
                    <p><strong>Date:</strong> {activityInfo.date}</p>
                    <p><strong>Time Remaining:</strong> {timeLeft > 0 ? formatTime(timeLeft) : 'Time is up!'}</p>
                    
                    <h2>React to the activity:</h2>
                    <div className="feedback-grid">
                        <div className="quadrant" onClick={() => sendFeedback('smiley')}>
                            😊
                        </div>
                        <div className="quadrant" onClick={() => sendFeedback('frowny')}>
                            😞
                        </div>
                        <div className="quadrant" onClick={() => sendFeedback('surprised')}>
                            😲
                        </div>
                        <div className="quadrant" onClick={() => sendFeedback('confused')}>
                            😕
                        </div>
                    </div>
                    {feedbackMsg && <div>{feedbackMsg}</div>}
                </div>
            )}
        </div>
    );
}

export default StudentForm;
