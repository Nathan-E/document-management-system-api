import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config();
import {
  Role
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
  role: {
    type: mongoose.Types.ObjectId,
    ref: 'Role',
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
userSchema.methods.generateAuthToken = function () {
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

export {
  User
};