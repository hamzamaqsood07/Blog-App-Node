import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100,
    },
    description: {
        type: String,
        maxlength: 500,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export const Product = model('Product', productSchema);
