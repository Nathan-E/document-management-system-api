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