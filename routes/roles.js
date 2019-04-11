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
  
  let role = await Role.findOne({title: req.body.title});
  if(role) return res.status(400).send(`${req.body.title} already exist`);

  role = new Role({
    title: req.body.title
  });

  await role.save();

  res.status(200).send('New role created!!!')
});

export { router as rolesRouter };
