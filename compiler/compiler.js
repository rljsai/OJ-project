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
DBconnection();

app.use('/', router);
app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`);
})