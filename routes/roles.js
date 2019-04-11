import {
  Role,
  validate
} from '../models/roles';
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

/**
 * @swagger
 * /api/v1/roles:
 *    post:
 *      summary: create a new role.
 *      tags: [/api/v1/roles]
 *      consumes:
 *        - application/json
 *      description: This should create a new role
 *      parameters:
 *        - in: body
 *          name: payload
 *          description: should contain the role's title
 *      schema:
 *        type: object
 *        required:
 *          - title
 *        properties:
 *          title:
 *            type: string
 *            example: admin
 *      responses:
 *        200:
 *          description: Role created successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not create the role
 *          schema:
 *            type: string
 */
router.post('/', async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let role = await Role.findOne({
    title: req.body.title
  });
  if (role) return res.status(400).send(`${req.body.title} already exist`);

  role = new Role({
    title: req.body.title
  });

  await role.save();

  res.status(200).send('New role created!!!')
});

/**
 * @swagger
 * /api/v1/roles/{id}:
 *    put:
 *      summary: get the role with the id for update.
 *      tags: [/api/v1/roles]
 *      consumes:
 *        - application/json
 *      description: This should update an existing role
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the genre to edit.
 *        - in: body 
 *          name: title 
 *          description: The new title of the genre to be updated.
 *        - in: header
 *          name: x-auth-token
 *          description: An authorization token
 *      schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *      responses:
 *        200:
 *          description: Roles updated successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not update the genre
 *          schema:
 *            type: string
 *        401:
 *          description: Unauthorized
 *          schema:
 *            type: string
 *        404:
 *          description: Could not find  a role with the given ID 
 *          schema:
 *            type: string
 */
router.put('/:id', async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let role = await Role.findOne({
    title: req.body.title,
  });
  if (role) return res.status(400).send(`${req.body.title} already exist`);


  role = await Role.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      title: req.body.title
    }
  }, {
    new: true
  });
  if (!role) return res.status(404).send('The role with the given ID was not found.');

  res.status(200).send(role);
});

export {
  router as rolesRouter
};
