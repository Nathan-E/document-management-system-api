import {
  Role
} from '../models/index';
import {
  validateRole
} from '../validations/roles';

class RoleController {
  constructor() {};

  //GET / controller
  //gets all role document
  async get(req, res) {
    //get all role document and sort bu title
    const role = await Role.find().sort('title');
    //response
    res.send(role);
  };

  //POST / controller
  // Creates a unique role
  async post(req, res) {
    //validates request body
    const {
      error
    } = validateRole(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //checks if the role exist
    let role = await Role.findOne({
      title: req.body.title
    });
    //returns a 404 if role exist
    if (role) return res.status(400).send(`${req.body.title} already exist`);

    //creates role
    role = new Role({
      title: req.body.title
    });
    //save new role to database
    await role.save();
    //response
    res.status(200).send('New role created!!!')
  };

  //PUT /:id controller
  //Updates existing role
  async put(req, res) {
    //validates the request body
    const {
      error
    } = validateRole(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //checks if any role exist with the same title in request body
    let role = await Role.findOne({
      title: req.body.title,
    });
    if (role) return res.status(400).send(`${req.body.title} already exist`);

    //find the role and updates it
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

  //GET /:id controller
  //Returns a unique role
  async getById(req, res) {
    //checks the Role document for the passed id
    const role = await Role.findById(req.params.id);

    if (!role) return res.status(404).send('The role with the given ID was not found.');

    res.status(200).send(role);
  };
};

export {
  RoleController
};
