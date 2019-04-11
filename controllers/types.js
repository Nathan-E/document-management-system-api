import {
  Type,
  validate
} from '../models/types';

const typeController = {};

typeController.get = async (req, res) => {
  const type = await Type.find().sort('title');

  res.send(type);
}

export { typeController };