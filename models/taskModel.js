import { Schema, model } from "mongoose";
import joi from 'joi';

const {object, string} = joi;

// Define the Task schema
const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    description: {
        type: String,
        maxlength: 500
    },
    // Reference to the creator (manager)
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'users', // references the User model
        required: true
    },
    status:{
        type: String,
        enum: ["new", "in progress", 'completed'],
        required: true,
        default: "new"
    },
}, {
    timestamps: true
});

/**
 * The function validates task object by
 * using Joi according to business rules.
 * @param {Object} task - task object to be validated
 * @returns an object having two properties: value and error
 */
function validateTask(task) {
    const schema = object({
        title: string()
            .max(50)
            .required(),
        description: string()
            .max(500),
        creator: string()
            .required(), // creator's ID is required
        status: string()
    });
    return schema.validate(task);
}

export const Task = new model("tasks", taskSchema);
export { validateTask };
