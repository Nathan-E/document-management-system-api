import {
  User
}
from '../../models/users';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const payload = {
  _id: mongoose.Types.ObjectId(),
  isAdmin: true
}

const adminToken = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
  expiresIn: 60 * 60
});

const regularToken = new User().generateAuthToken();

export {
  adminToken,
  regularToken
};