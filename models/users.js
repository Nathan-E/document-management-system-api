import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

//User Schema
const userSchema = new mongoose.Schema({
  //users firstname
  firstname: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  //user's lastname
  lastname: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  //users role (admin , regualr)
  role: {
    type: mongoose.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  //user username
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25,
    unique: true
  },
  //users email
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  //user password
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  //user status
  deleted: {
    type: Boolean,
    default: false
  },
  //tells if a user is an admin
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
