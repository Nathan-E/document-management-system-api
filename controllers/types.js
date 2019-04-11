import {
  Type,
  validate
} from '../models/types';

const typeController = {};

typeController.get = async (req, res) => {
  const type = await Type.find().sort('title');

  res.send(type);
};

typeController.post = async (req, res) => {
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
};

export { typeController };