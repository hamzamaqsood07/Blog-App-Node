import { Router } from "express";
import {BlogModel, validateBlog, validateBlogUpdate} from "../models/blogModel.js";
import _ from 'lodash';

const blogRouter = Router();

blogRouter.post('/', async (req, res) => {
    const { error } = validateBlog(req.body); //joi validation
    if (error) return res.status(400).send(error.details[0].message);

    const blog = new BlogModel(_.pick(req.body, ['title', 'content', 'author', 'tags', 'comments']));
    try {
        const savedBlog = await blog.save();
        res.send(savedBlog);
    }
    catch (err) {
        res.status(400).send(err.message);
        console.error(err.message);
    }
});

blogRouter.get('/:id', async (req, res) => {
    const blog = await BlogModel.findOne({_id: req.params.id});
    if (!blog)
        return res.status(404).send('The blog with the given id was not found.');
    res.send(blog);
})

blogRouter.get('/', async (req, res) => {
    const blog = await BlogModel.find();
    res.send(blog);
})

blogRouter.put('/:id', async (req, res) => {
    const { error } = validateBlogUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const blog = await BlogModel.findOne({ _id: req.params.id });
        if (!blog) return res.status(404).send('The blog with the given id was not found.');
        blog.set(_.pick(req.body, ['title', 'content', 'author', 'tags', 'comments']));
        const savedBlog = await blog.save();
        res.send(savedBlog);
    }
    catch (err) {
        res.status(400).send(err.message);
        console.log(err.message);
    }
});

blogRouter.delete('/:id', async (req, res) => {

    const blog = await BlogModel.findOne({ _id: req.params.id });
    if (!blog) return res.status(404).send('The blog with the given id was not found.');
    const deletedBlog = await blog.deleteOne({ _id: req.params.id });
    res.send(deletedBlog);
});

export default blogRouter;