import {
  userController
} from '../controllers/index';
import express from 'express';
import {
  validateObjectId,
  auth,
  isAdmin
} from '../middlewares/index';
import {
  User,
  validate
} from '../models/users';
import {
  Role
} from '../models/roles';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const router = express.Router();


router.post('/signup', async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email
  });
  if (user) return res.status(400).send('User already exist');

  const role = await Role.findOne({title: req.body.role});
  if (!role) return res.status(400).send('Invalid role.');

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    role: role._id,
    username: req.body.username,
    email: req.body.email,
    password: password
  })

  await user.save();

  res.send('New user created!!!');
});

router.post('/login', async (req, res) => {
  const {
    error
  } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email
  });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();

  res.setHeader('x-auth-token', token);
  res.send('User logged in');
});

router.post('/logout', async (req, res) => {
  delete req.headers['x-auth-token'];

  res.send('User logged out');
});


router.get('/', [auth, isAdmin], async (req, res) => {
  const user = await User.find().sort('name');

  res.send(user);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
});


function validateLogin(req) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.required()
  };
  return Joi.validate(req, schema);
}

export {
  router as usersRouter
};