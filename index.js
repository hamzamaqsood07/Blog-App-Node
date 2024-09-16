import express from 'express';
import { connectToDB } from './startup/db.js';
import 'dotenv/config';
import defineRoutes from './startup/routes.js';
connectToDB();

const app = express();
app.use(express.json());
defineRoutes(app);
const port = process.env.backend_port || 3000;  //defining port
//running server on specified port
app.listen(port, () => console.log(`Express Server listening on http://localhost:${port}`));