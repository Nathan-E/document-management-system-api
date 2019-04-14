import mongoose from 'mongoose';

//Validates obeject id
export default async function (req, res, next) {
  //checks if an id is valid
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);

  //return 400 if id is not valid
  if (!isValid) return res.status(400).send('Invalid ID.');

  next();
}
