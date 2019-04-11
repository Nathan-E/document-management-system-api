import { Type, validate } from '../models/types';
import express from 'express';
import validateObjectId from '../middlewares/validateObjectId';

const router = express.Router();

/**
 * @swagger
 * /api/v1/type:
 *    get:
 *      summary: gets all role.
 *      tags: [/api/v1/types]
 *      description: This should return all types
 *      responses:
 *        200:
 *          description: A list of types
 *          schema:
 *            type: string
 *        400:
 *          description: Failed Request
 *          schema:
 *            type: string
 */
router.get('/', async (req, res) => {
  const type = await Type.find().sort('title');

  res.send(type);
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
router.post('/', async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let type = await Type.findOne({
    title: req.body.title
  });
  if (type) return res.status(400).send(`${req.body.title} already exist`);

  type = new Type({
    title: req.body.title
  });

  await type.save();

  res.status(200).send('New type created!!!')
});

export { router as typesRouter }