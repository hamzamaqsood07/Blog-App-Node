import { Router } from "express";
import {BlogModel, validateBlog} from "../models/blogModel.js";
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

export default blogRouter;