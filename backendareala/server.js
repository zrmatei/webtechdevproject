import cors from 'cors';
import { createPool } from 'mysql2/promise';
import express from "express"
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'https://continuousfeedback.netlify.app',
}));
app.use(express.json());

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    port: 3306,
});
app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
    console.log("Server running on port", process.env.PORT || 3001);
});

app.post('/login', async (req, res) => {
    const { email, pass } = req.body;

    try {
        const [rows] = await pool.query(
            'SELECT id, role FROM users WHERE email = ? AND password = ?',
            [email, pass]
        );

        if (rows.length > 0) {
            const user = rows[0];
            return res.status(200).json({ 
                success: true, 
                message: 'Login successful!', 
                role: user.role,
            });
        } else {
            return res.status(401).json({ success: false,
                message: 'Invalid email or password',
                });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
});

app.post('/saveActivity', async (req, res) => {
    const { activity, date, accessCode, time } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO activities (activity, date, access_code, time) VALUES (?, ?, ?, ?)',
            [activity, date, accessCode, time]
        );

        return res.status(201).json({ 
            success: true, 
            message: 'Activity saved successfully!' 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error!' 
        });
    }
});

app.post('/getActivity', async (req, res) => {
    const { accessCode } = req.body;

    try {
        const [rows] = await pool.query(
            'SELECT activity, date, time FROM activities WHERE access_code = ?',
            [accessCode]
        );

        if (rows.length > 0) {
            const activity = rows[0];

            // Time from the DB
            const activityDuration = activity.time;

            // Time remaining
            const currentTime = Math.floor(Date.now() / 1000); // Actual time
            const activityCreationTime = Math.floor(new Date(activity.date).getTime() / 1000); // Date activity in secs
            const elapsedTime = currentTime - activityCreationTime;

            const remainingTime = Math.max(0, activityDuration - elapsedTime);

            return res.status(200).json({
                success: true,
                activity: {
                    activity: activity.activity,
                    date: activity.date,
                },
                time: remainingTime, // Send back the remaining time in secs
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Activity not found for the given code',
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error!',
        });
    }
});


app.post('/sendFeedback', async (req, res) => {
    const { code, reaction } = req.body;

    try {
        await pool.query(
            'INSERT INTO feedback (activity_code, reaction, created_at) VALUES (?, ?, NOW())',
            [code, reaction]
        );
        res.status(201).json({ success: true, message: 'Feedback saved!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
});

app.get('/getAllFeedback', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT activity_code, reaction, created_at FROM feedback ORDER BY created_at ASC'
        );

        res.status(200).json({
            success: true,
            feedback: rows,
        });
    } catch (err) {
        console.error('Error fetching feedback:', err);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching feedback!',
        });
    }
});