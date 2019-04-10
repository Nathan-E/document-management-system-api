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
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
});