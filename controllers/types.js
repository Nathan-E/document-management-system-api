import {
  Type
} from '../models/index';
import {
  validateType
} from '../validations/index';

class TypeController{
  constructor(){};

//GET / contoller
//get all the various type of document
async get(req, res) {
  //find all types and sort by title
  const type = await Type.find().sort('title');

  res.send(type);
};

//POST / contoller
//creates a unique document type
async post(req, res) {
  //validates the request body
  const {
    error
  } = validateType(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checks if the document type already exist
  let type = await Type.findOne({
    title: req.body.title
  });
  if (type) return res.status(400).send(`${req.body.title} already exist`);

  //creates aunique document type
  type = new Type({
    title: req.body.title
  });

  //save new type to database
  await type.save();

  res.status(200).send('New type created!!!')
};


}





//PUT /:id controller
//edits an existing document
typeController.put = async (req, res) => {
  //validates the request body
  const {
    error
  } = validateType(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the request title property is unique
  let type = await Type.findOne({
    title: req.body.title,
  });
  if (type) return res.status(400).send(`${req.body.title} already exist`);

  //find and update the type
  type = await Type.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      title: req.body.title
    }
  }, {
    new: true
  });
  //returns 404 if role doesnot exist
  if (!type) return res.status(404).send('The type with the given ID was not found.');

  res.status(200).send(type);
};

//GET /:id controller
//get a type by id
typeController.getById = async (req, res) => {
  //finds the document type by id
  const type = await Type.findById(req.params.id);

  //returns 404 is document is not found
  if (!type) return res.status(404).send('The type with the given ID was not found.');

  res.status(200).send(type);
};

export {
  typeController
};
