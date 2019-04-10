import mongoose from 'mongoose';
import Joi from 'joi';
import { roleSchema } from '../models/roles';

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
  deleted:{
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', userSchema);

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

export { User, validate };