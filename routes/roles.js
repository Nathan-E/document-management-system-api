import { Role, validate } from '../models/roles';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * @swagger
 * /api/v1/roles:
 *    get:
 *      summary: gets all roles.
 *      tags: [/api/v1/roles]
 *      description: This should return all roles
 *      responses:
 *        200:
 *          description: A list of roles
 *          schema:
 *            type: string
 *        400:
 *          description: Failed Request
 *          schema:
 *            type: string
 */
router.get('/', async (req, res) => {
  const roles = await Role.find().sort('title');
  
  res.send(roles);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
});

export { router as rolesRouter };
