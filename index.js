import express from 'express';
import { connectToDB } from './startup/db.js';
import 'dotenv/config';
import blogRouter from './routes/blogRoutes.js';
connectToDB();

const app = express();
app.use(express.json());
app.use('/blogs', blogRouter);
const port = process.env.PORT || 3000;  //defining port
//running server on specified port
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));