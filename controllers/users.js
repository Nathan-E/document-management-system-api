import {
  User
} from '../models/users';
import { usersValidator } from '../validations/index';
import { Role } from '../models/roles';
import _ from 'lodash';
import bcrypt from 'bcrypt';

//User Controller
const userController = {};

// POST /signup
//signs up a user
userController.signup = async (req, res) => {
  //validates the request input field
  const {
    error
  } = usersValidator.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checks if user already exist
  let user = await User.findOne({
    email: req.body.email
  });
  if (user) return res.status(400).send('User already exist');

  //checks if a valid role is passed in the request body
  const role = await Role.findOne({
    title: req.body.role
  });
  if (!role) return res.status(400).send('Invalid role.');
  //hashs the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  //creates the user
  user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    role: role._id,
    username: req.body.username,
    email: req.body.email,
    password: password
  })

  //saves the user
  await user.save();

  res.send('New user created!!!');
};

// POST /login
//Allow an authenicated user to log in
userController.login = async (req, res) => {
  //validates the request body
  const {
    error
  } = usersValidator.validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checks up the user by the request body email field
  let user = await User.findOne({
    email: req.body.email
  });
  if (!user) return res.status(400).send('Invalid email or password');

  //valids the user request password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  //generates a unique token for the user
  const token = user.generateAuthToken();

  //set the token in the header
  res.setHeader('x-auth-token', token);
  res.send('User logged in');
};

// POST /logout
//logs a user out
userController.logout = async (req, res) => {
  //deletes the token form the header
  delete req.headers['x-auth-token'];

  res.send('User logged out');
};

// GET /
userController.get = async (req, res) => {
  const user = await User.find().sort('firstname');

  res.send(user);
}

// GET /:id
userController.getById = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || user.deleted) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
};

// PUT /:id
userController.put = async (req, res) => {
  const {
    error
  } = usersValidator.validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findById(req.params.id);
  if (!user || user.deleted) return res.status(400).send('User does not exist');

  const salt = await bcrypt.genSalt(10);
  const password = req.body.password ? await bcrypt.hash(req.body.password, salt) : user.password;

  user = await User.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      firstname: req.body.firstname || user.firstname,
      lastname: req.body.lastname || user.lastname,
      password: password
    }
  }, {
    new: true
  });

  res.status(200).send(user);
};

// DELETE /:id
userController.delete = async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user || user.deleted) return res.status(400).send('User does not exist');

  user = await User.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      deleted: true
    }
  }, {
    new: true
  });

  res.status(200).send(user);
};

export { userController };