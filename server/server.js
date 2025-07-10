import express from 'express';
import router from './routes/routes.js'
import DBconnection from './database/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// ✅ Enable CORS for frontend at port 5173
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send("hello leela");
})
DBconnection();

app.use('/', router);
app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`);
})