import { Document } from '../models/documents';
import { validateDocument } from '../validations/index';
import bcrypt from 'bcrypt';
import express from 'express';
import { validateObjectId, auth, isAdmin } from '../middlewares/index';

const router = express.Router();

router.post('/', async (req, res) => {

});

export {
  router as documentRouter
}