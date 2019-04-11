import {
  Role,
  validate
} from '../models/roles';

const roleController = {};

roleController.get = async (req, res) => {
  const role = await Role.find().sort('title');

  res.send(role);
};

roleController.post = async (req, res) => {
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
};

roleController.put = async (req, res) => {
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
};


roleController.getById = async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) return res.status(404).send('The role with the given ID was not found.');

  res.status(200).send(role);
}

export { roleController };