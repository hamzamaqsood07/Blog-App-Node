import express from 'express';
import { connectToDB } from './startup/db.js';
import 'dotenv/config';
connectToDB();

const app = express();
const port = process.env.PORT || 3000;  //defining port
//running server on specified port
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));