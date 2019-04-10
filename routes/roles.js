import { Role, validate } from '../models/roles';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/', async (req, res) => {
  const roles = await Role.find().sort('title');
  
  res.send(roles)
})
