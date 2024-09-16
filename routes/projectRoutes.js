import { auth, isManagerOrAdmin } from '../middleware/auth';
import express from 'express';
import { Project, validateProject } from '../models/project';
const projectRouter = express.Router();


// Manager creates a project
projectRouter.post('/', [auth, isManagerOrAdmin], async (req, res) => {
    const { error } = validateProject(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const project = new Project({ ...req.body, creator: req.user._id });
    await project.save();
    res.send(project);
});

// Get all projects (accessible to all roles)
projectRouter.get('/', auth, async (req, res) => {
    const projects = await Project.find().populate('creator', 'firstName lastName');
    res.send(projects);
});

// Manager updates a project
projectRouter.put('/:id', [auth, isManagerOrAdmin], async (req, res) => {
    const { error } = validateProject(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
});

// Manager deletes a project
projectRouter.delete('/:id', [auth, isManagerOrAdmin], async (req, res) => {
    const project = await Project.findByIdAndRemove(req.params.id);
    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
});

export default projectRouter;