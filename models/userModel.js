import lodash from 'lodash';
import jsonwebtoken from 'jsonwebtoken';
import {Schema,model} from "mongoose";
import joi from 'joi';

const {pick} = lodash;
const {sign} = jsonwebtoken;
/**
 * The object represents a common schema 
 * for admin, manager and developer by using
 * Mongoose according to the business logic. 
 */
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        unique: true
    },
    password: {
        type: String,
        required: true,
        length:60,
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]+$/,
        length: 10,
        unique:true
    },
    countryCode: {
        type: String,
        required: true,
        match: /^\+[0-9]+$/,
        length: 5,
        unique:true
    },
    cnic: {
        type: String,
        required: true,
        match: /^[0-9]+$/,
        length: 13,
        unique: true,
    },
    address: {
        country: {
            type: String,
            required: true,
            maxLength: 50
        },
        state: {
            type: String,
            required: true,
            maxLength: 50
        },
        city: {
            type: String,
            required: true,
            maxLength: 50
        },
        streetAddress: {
            type: String,
            required: true,
            maxLength: 100
        },
        postalCode: {
            type: String,
            required: true,
            match: /^[0-9]+$/,
            maxLength: 10
        }
    },
    role :{
        type:String,
        default:'developer',
        enum:['developer', 'manager', 'admin']
    }
}, {
    timestamps: true
})

userSchema.methods.generateAuthToken = function(){
    const token = sign(pick(this,['_id','firstName','lastName','email','phone','countryCode','cnic','address','role']), process.env.jwtPrivateKey);
    return token;
}

/**
 * The function validates user object by
 *  using Joi according to business rules. 
 * @param {Object} user indicates user
 *  to be validated
 * @returns an object having two properties;
 * value and error
 */
function validateUser(user){
    const schema = joi.object({
        firstName: joi.string()
            .max(20)
            .required(),
        lastName: joi.string()
            .max(20).
            required(),
        email: joi.string()
            .email()
            .required(),
        password: joi.string()
            .min(8)
            .max(30)
            .required()
            .regex(/[A-Z]/, 'uppercase letter')
            .regex(/[0-9]/, 'number')
            .regex(/[!@#$%^&*]/, 'special character')
            .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password cannot be longer than 30 characters',
            'string.pattern.name': 'Password must contain at least one {#name}',
            'any.required': 'Password is required',
            }),
        phone: joi.string()
            .length(10)
            .pattern(/^[0-9]+$/)
            .required(),
        countryCode: joi.string()
            .max(5)
            .min(2)
            .pattern(/^\+[0-9]+$/)
            .required(),
        cnic: joi.string()
            .length(13)
            .pattern(/^[0-9]+$/)
            .required(), 
        address: joi.object({
            country: joi.string()
                .max(50)
                .required(),
            state: joi.string()
                .max(50)
                .required(),
            city: joi.string()
                .max(50)
                .required(),
            streetAddress: joi.string()
                .max(100)
                .required(),
            postalCode: joi.string()
                .pattern(/^[0-9]+$/)
                .max(10)
                .required()
        }).required(),
        role: joi.string()
    });
    return schema.validate(user);
}

export const User = new model("users", userSchema);
export {validateUser};