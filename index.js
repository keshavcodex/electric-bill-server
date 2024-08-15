import express from 'express';
import dotenv from 'dotenv';
import Connection from './db.js';
import cors from 'cors';
import Routes from './routes/route.js';

dotenv.config();

const PORT = process.env.PORT;
Connection(process.env.MONGO_URL);
const app = express();

app.use(cors());
app.use(express.json());
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.use('/', Routes);
