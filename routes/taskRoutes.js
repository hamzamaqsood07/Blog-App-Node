import express from 'express';
import { auth, isManagerOrAdmin, isDeveloper } from '../middlewares/auth.js';
import { Task, validateTask } from '../models/taskModel.js';

const taskRouter = express.Router();

// Manager creates a task for a project
taskRouter.post('/', [auth, isManagerOrAdmin], async (req, res) => {
    const { error } = validateTask(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const task = new Task({ ...req.body, creator: req.user._id });
    await task.save();
    res.send(task);
});

// Manager updates a task
taskRouter.put('/:id', [auth, isManagerOrAdmin], async (req, res) => {
    const { error } = validateTask(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).send('The task with the given ID was not found.');

    res.send(task);
});

// Manager deletes a task
taskRouter.delete('/:id', [auth, isManagerOrAdmin], async (req, res) => {
    const task = await Task.findByIdAndRemove(req.params.id);
    if (!task) return res.status(404).send('The task with the given ID was not found.');

    res.send(task);
});

// Developer can only update the status of a task
taskRouter.patch('/:id/status', [auth, isDeveloper], async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('The task with the given ID was not found.');
    
    task.status = req.body.status;
    await task.save();
    
    res.send(task);
});

export default taskRouter;