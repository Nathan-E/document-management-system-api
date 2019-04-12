import {
  User,
  validate
} from '../models/users';
import express from 'express';
import { validateObjectId, auth, isAdmin } from '../middlewares/index';
import { Role } from '../models/roles';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import Joi from 'joi';


const userController = {};

userController.signup = async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email
  });
  if (user) return res.status(400).send('User already exist');

  const role = await Role.findOne({
    title: req.body.role
  });
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
}

export { userController }