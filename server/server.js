import express from 'express';
import router from './routes/routes.js'
import DBconnection from './database/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

DBconnection();

app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`);
})