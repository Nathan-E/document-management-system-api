import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const adminPayload = {
  _id: mongoose.Types.ObjectId(),
  isAdmin: true
}

const adminToken = jwt.sign(adminPayload, process.env.JWT_PRIVATE_KEY, {
  expiresIn: 60 * 60
});

const nonAdminPayload = {
  _id: mongoose.Types.ObjectId(),
  isAdmin: false
}
const regularToken = jwt.sign(nonAdminPayload, process.env.JWT_PRIVATE_KEY, {
  expiresIn: 60 * 60
});

export {
  adminToken,
  regularToken
};