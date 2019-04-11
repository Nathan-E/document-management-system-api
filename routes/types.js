import { Type, validate } from '../models/types';
import express from 'express';
import validateObjectId from '../middlewares/validateObjectId';

const router = express.Router();

router.get('/', async (req, res) => {
  const type = await Type.find().sort('title');

  res.send(type);
});

export { router as typesRouter }