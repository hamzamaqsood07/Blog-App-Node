import { Schema, model } from "mongoose";
import joi from 'joi';

const {object, string} = joi;


// Define the Project schema
const projectSchema = new Schema({
    name: {
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
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'tasks' // references the Task model
    }]
}, {
    timestamps: true
});

/**
 * The function validates project object by
 * using Joi according to business rules.
 * @param {Object} project - project object to be validated
 * @returns an object having two properties: value and error
 */
function validateProject(project) {
    const schema = object({
        name: string()
            .max(50)
            .required(),
        description: string()
            .max(500),
        creator: string()
            .required(), // creator's ID is required
        tasks: string().optional() // Task array references
    });
    return schema.validate(project);
}

export const Project = new model("projects", projectSchema);
export { validateProject };
