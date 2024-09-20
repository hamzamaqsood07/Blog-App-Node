import express from 'express';
import { auth, isAdmin } from '../middlewares/auth.js';
import { User, validateUser } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import _ from 'lodash';

const userRouter = express.Router();

// Admin creates a new user
userRouter.post('/', [auth, isAdmin], async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    if(req.body.role==='admin') res.status(400).send("Invalid value for role: 'admin'. Try 'developer' or 'manager'")
    
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User({...req.body, creator: req.user._id});
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.send(user);
});

// Admin can get all users
userRouter.get('/', [auth, isAdmin], async (req, res) => {
    const users = await User.find({creator: req.user._id});
    res.send(users);
});

// Admin can update a user
userRouter.put('/:id', [auth, isAdmin], async (req, res) => {
    const { error } = validateUser(req.body, true);
    if (error) return res.status(400).send(error.details[0].message);
    if(req.body.role==='admin') return res.status(400).send("Invalid value for role: 'admin'. Try 'developer' or 'manager'")
    if(req.body.password) return res.status(400).send("Password is not allowed")
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    if (!user.creator || !user.creator.equals(req.user._id)) return res.status(403).send('You cannot update this user');
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.send(updatedUser);
});

// Admin can delete a user
userRouter.delete('/:id', [auth, isAdmin], async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    if (!user.creator || !user.creator.equals(req.user._id)) return res.status(403).send('You cannot delete this user');

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    res.send(deletedUser);
});

export default userRouter;
