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


router.get('/', [auth, isAdmin], userController.get);

router.get('/:id', [validateObjectId, auth], userController.getById);

router.put('/:id', validateObjectId, userController.put);

router.delete('/:id', [validateObjectId, auth], userController.delete);

export {
  router as usersRouter
};