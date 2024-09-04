import {model, Schema} from 'mongoose';
import Joi from 'joi';

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  comments: [
    {
      user: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const BlogModel = model('Blog', blogSchema);


// Define the Joi schema
const blogValidationSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Title is required.',
      'string.min': 'Title should have a minimum length of {#limit} characters.',
      'string.max': 'Title should have a maximum length of {#limit} characters.',
    }),
  content: Joi.string()
    .trim()
    .min(10)
    .required()
    .messages({
      'string.empty': 'Content is required.',
      'string.min': 'Content should have a minimum length of {#limit} characters.',
    }),
  author: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Author is required.',
    }),
  tags: Joi.array()
    .items(Joi.string().trim())
    .messages({
      'array.base': 'Tags should be an array of strings.',
    }),
  comments: Joi.array().items(
    Joi.object({
      user: Joi.string()
        .trim()
        .required()
        .messages({
          'string.empty': 'Comment user is required.',
        }),
      comment: Joi.string()
        .trim()
        .required()
        .messages({
          'string.empty': 'Comment content is required.',
        }),
      createdAt: Joi.date().default(Date.now),
    })
  ),
});

export const validateBlog = (blogData) => {
  return blogValidationSchema.validate(blogData, { abortEarly: false });
};
