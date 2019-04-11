import {
  Role,
  validate
} from '../models/roles';

const roleController = {};

roleController.get = async (req, res) => {
  const role = await Role.find().sort('title');

  res.send(role);
}

export { roleController };