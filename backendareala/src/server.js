import express from 'express';
import cors from 'cors';
import { createPool } from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'feedbackdb1',
    database: 'feedbackdb',
    port: 3306, 
    connectionLimit: 10,
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
                role: user.role 
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
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
            return res.status(200).json({
                success: true,
                activity: rows[0],
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



app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});
