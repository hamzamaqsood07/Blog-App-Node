import { auth, isManagerOrAdmin } from '../middlewares/auth.js';
import express from 'express';
import { Project, validateProject } from '../models/projectModel.js';
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
    const projects = await Project.find({creator: req.user._id}).populate('creator', 'firstName lastName');
    res.send(projects);
});

// Manager updates a project
projectRouter.put('/:id', [auth, isManagerOrAdmin], async (req, res) => {
    const { error } = validateProject(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    if (!project.creator || !project.creator.equals(req.user._id)) return res.status(403).send('You cannot update this project');

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.send(updatedProject);
});

// Manager deletes a project
projectRouter.delete('/:id', [auth, isManagerOrAdmin], async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    if (!project.creator || !project.creator.equals(req.user._id)) return res.status(403).send('You cannot update this project');
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).send('The project with the given ID was not found.');

    res.send(deletedProject);
});

export default projectRouter;