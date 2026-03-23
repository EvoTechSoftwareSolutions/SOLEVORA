import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SoleVora API' });
});

// Hello API
app.get('/api/status', (req, res) => {
    res.json({
        status: 'Online',
        timestamp: new Date().toISOString(),
        service: 'SoleVora Backend'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
