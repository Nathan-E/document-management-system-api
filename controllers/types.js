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

typeController.put = async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let type = await Type.findOne({
    title: req.body.title,
  });
  if (type) return res.status(400).send(`${req.body.title} already exist`);


  type = await Type.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      title: req.body.title
    }
  }, {
    new: true
  });
  if (!type) return res.status(404).send('The type with the given ID was not found.');

  res.status(200).send(type);
}

export { typeController };