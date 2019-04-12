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

router.post('/login', userController.login);

router.post('/logout', userController.logout);


router.get('/', [auth, isAdmin], async (req, res) => {
  const user = await User.find().sort('firstname');

  res.send(user);
});

router.get('/:id', [validateObjectId, auth], userController.getById);

router.put('/:id', validateObjectId, userController.put);

router.delete('/:id', [validateObjectId, auth], userController.delete);


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