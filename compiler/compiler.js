import express from 'express';
import router from './routes/routes.js';
import dotenv from 'dotenv';
import DBconnection from './database/db.js';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


DBconnection();

app.use('/', router);

app.listen(process.env.PORT, () => {
    console.log(`Compiler server is running on port ${process.env.PORT}`);
})