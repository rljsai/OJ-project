import express from 'express';
import router from './routes/routes.js';
import dotenv from 'dotenv';
import DBconnection from './database/db.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("hello leela");
})

// Test endpoint to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: "Server is running", timestamp: new Date().toISOString() });
});

DBconnection();

app.use('/', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Compiler server is running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/test`);
    console.log(`Code execution endpoint: http://localhost:${PORT}/run`);
})