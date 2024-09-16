import express from 'express';
import { Product } from '../models/product';

const productRouter = express.Router();

// GET / - Pagination, Filtering, Sorting
productRouter.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Default to first page
    const limit = parseInt(req.query.limit) || 10;  // Default to 10 products per page
    const category = req.query.category || '';  // Category filter
    const sortField = req.query.sortBy || 'dateAdded';  // Default to sorting by dateAdded
    const sortOrder = req.query.order === 'asc' ? 1 : -1;  // Sorting order: 'asc' or 'desc'

    // Build the query object
    const query = {};
    if (category) {
        query.category = category;
    }

    try {
        // Find products with filtering, pagination, and sorting
        const products = await Product.find(query)
            .sort({ [sortField]: sortOrder })  // Sorting
            .skip((page - 1) * limit)  // Skip products for pagination
            .limit(limit);  // Limit the number of products returned

        // Get the total number of products for pagination purposes
        const total = await Product.countDocuments(query);

        res.send({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            products,
        });
    } catch (error) {
        res.status(500).send('An error occurred while retrieving products.');
    }
});

// POST / - Create a new product
productRouter.post('/', async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        // Create a new product
        const product = new Product({
            name,
            description,
            price,
            category,
        });

        // Save the product to the database
        await product.save();

        res.status(201).send(product);
    } catch (error) {
        res.status(500).send('An error occurred while creating the product.');
    }
});


// PUT /:id - Update an existing product
productRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category } = req.body;

        // Find the product by ID and update it
        const product = await Product.findByIdAndUpdate(
            id,
            { name, description, price, category },
            { new: true, runValidators: true }  // Return the updated product
        );

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.send(product);
    } catch (error) {
        res.status(500).send('An error occurred while updating the product.');
    }
});


// DELETE /:id - Delete a product by ID
productRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID and delete it
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send('An error occurred while deleting the product.');
    }
});

export default productRouter;
