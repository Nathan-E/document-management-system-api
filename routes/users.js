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


router.post('/signup', userController.signup);

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
  const user = await User.find().sort('firstname');

  res.send(user);
});

router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || user.deleted) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
});

router.put('/:id', validateObjectId, async (req, res) => {
  const {
    error
  } = validateUpdate(req.body);
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
});

router.delete('/:id', [validateObjectId, auth], async (req, res) => {
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
});


const validateLogin = req => {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.required()
  };
  return Joi.validate(req, schema);
}

const validateUpdate = user => {
  const schema = {
    firstname: Joi.string().min(5).max(50),
    lastname: Joi.string().min(5).max(50),
    password: Joi.string().min(5).max(225),
  }

  return Joi.validate(user, schema);
};

export {
  router as usersRouter
};