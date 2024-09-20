import express from 'express';
import { auth, isAdmin } from '../middlewares/auth.js';
import { User, validateUser } from '../models/userModel.js';

const userRouter = express.Router();

// Admin creates a new user
userRouter.post('/api/users', [auth, isAdmin], async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.send(user);
});

// Admin can get all users
userRouter.get('/api/users', [auth, isAdmin], async (req, res) => {
    const users = await User.find();
    res.send(users);
});

// Admin can update a user
userRouter.put('/api/users/:id', [auth, isAdmin], async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

// Admin can delete a user
userRouter.delete('/api/users/:id', [auth, isAdmin], async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

export default userRouter;
