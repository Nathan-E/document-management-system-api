import {
  Role,
  validate
} from '../models/roles';
import express from 'express';
import { validateObjectId, auth, isAdmin } from '../middlewares/index';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * @swagger
 * /api/v1/role:
 *    get:
 *      summary: gets all role.
 *      tags: [/api/v1/role]
 *      description: This should return all role
 *      responses:
 *        200:
 *          description: A list of role
 *          schema:
 *            type: string
 *        400:
 *          description: Failed Request
 *          schema:
 *            type: string
 */
router.get('/', [auth, isAdmin], async (req, res) => {
  const role = await Role.find().sort('title');

  res.send(role);
});

/**
 * @swagger
 * /api/v1/role:
 *    post:
 *      summary: create a new role.
 *      tags: [/api/v1/role]
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
router.post('/', [auth, isAdmin],async (req, res) => {
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
 * /api/v1/role/{id}:
 *    put:
 *      summary: get the role with the id for update.
 *      tags: [/api/v1/role]
 *      consumes:
 *        - application/json
 *      description: This should update an existing role
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the role to edit.
 *        - in: body 
 *          name: title 
 *          description: The new title of the role to be updated.
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
 *          description: role updated successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not update the role
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
router.put('/:id', [validateObjectId, auth, isAdmin], async (req, res) => {
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

/**
 * @swagger
 * /api/v1/roles/{id}:
 *    get:
 *      summary: gets a unique role with the passed id
 *      tags: [/api/v1/roles]
 *      consumes:
 *        - application/json
 *      description: This should return an existing role with the given id
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the role requested.
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
 *          description:  success
 *          schema:
 *            type: string
 *        400:
 *          description: Invalid ID
 *          schema:
 *            type: string
 *        404:
 *          description: Could not find  a role with the given ID 
 *          schema:
 *            type: string
 */
router.get('/:id', validateObjectId, async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) return res.status(404).send('The role with the given ID was not found.');

  res.status(200).send(role);
});

export {
  router as rolesRouter
};