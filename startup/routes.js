import blogRouter from '../routes/blogRoutes.js';
import authRouter from '../routes/authRoutes.js';
import productRouter from '../routes/productRoutes.js';
import projectRouter from '../routes/projectRoutes.js';
import taskRouter from '../routes/taskRoutes.js';
import userRouter from '../routes/userRoutes.js';
import weatherRouter from '../routes/weather.js';

const defineRoutes = app => {
    app.use('/auth', authRouter);
    app.use('/blogs', blogRouter);
    app.use('/products', productRouter);
    app.use('/projects', projectRouter);
    app.use('/tasks', taskRouter);
    app.use('/users', userRouter);
    app.use('/weather', weatherRouter);
};

export default defineRoutes;