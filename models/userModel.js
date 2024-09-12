import {pick} from 'lodash';
import {sign} from 'jsonwebtoken';
import {Schema,model} from "mongoose";
import {object,string} from 'joi';

/**
 * The object represents a common schema 
 * for admin, manager and employee by using
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
        type: String,    
        required:true,
        maxLength: 80
    },
    role :{
        type:String,
        default:'employee',
        enum:['employee', 'manager', 'admin']
    }
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
    const schema = object({
        firstName: string()
            .max(20)
            .required(),
        lastName: string()
            .max(20).
            required(),
        email: string()
            .email()
            .required(),
        password: string()
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
        phone: string()
            .length(10)
            .pattern(/^[0-9]+$/)
            .required(),
        countryCode: string()
            .length(5)
            .pattern(/^\+[0-9]+$/)
            .required(),
        cnic: string()
            .length(13)
            .pattern(/^[0-9]+$/)
            .required(), 
        address: string()
            .required()
            .max(80),
        role: string()
    });
    return schema.validate(user);
}





export const User = new model("users", userSchema);
export {validateUser};