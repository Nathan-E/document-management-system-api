import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config();
import {
  roleSchema
} from '../models/roles';

//User Schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  lastname: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  role_id: {
    type: roleSchema,
    required: true
  },
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  deleted: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});


//Generates User token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({
    _id: this._id,
    isAdmin: this.isAdmin
  }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: 60 * 60
  });
  return token;
}

//User Model
const User = mongoose.model('User', userSchema);

//Validates the user payload
const validate = user => {
  const schema = {
    firstname: Joi.string().min(5).max(50).required(),
    lastname: Joi.string().min(5).max(50).required(),
    role_id: Joi.objectId().required(),
    username: Joi.string().min(5).max(25).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(5).max(225).required(),
    deleted: Joi.boolean()
  }

  return Joi.validate(user, schema);
};

export {
  User,
  validate
};