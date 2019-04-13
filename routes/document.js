import {
  Document
} from '../models/documents';
import {
  validateDocument
} from '../validations/index';
import bcrypt from 'bcrypt';
import express from 'express';
import _ from 'lodash';
import {
  validateObjectId,
  auth,
  isAdmin
} from '../middlewares/index';
import {
  Type
} from '../models/types';
import {
  User
} from '../models/users';
import {
  Role
} from '../models/roles';
import {
  Access
} from '../models/access';
import * as util from 'util';
import {
  inspect
} from 'util';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const {
    error
  } = validateDocument(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const type = await Type.findOne({
    title: req.body.type
  });
  if (!type) return res.status(404).send('Invalid document type');

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send('Invalid request');

  const role = await Role.findById(user.role);
  if (!role) return res.status(404).send('Invalid request');

  const userRoleInfo = await Access.findOne({
    name: role.title
  });
  if (!userRoleInfo) return res.status(404).send('Invalid request');

  const access = await Access.findOne({
    name: req.body.accessRight
  });
  if (!access) return res.status(404).send('Invalid request');

  access.level = Object.values(access)[3]['level'];
  userRoleInfo.level = Object.values(userRoleInfo)[3]['level'];

  if (access.level < userRoleInfo.level) return res.status(401).send('Invalid request');

  const document = new Document({
    title: req.body.title,
    type_id: type._id,
    owner_id: user._id,
    ownerRole: role.title,
    content: req.body.content,
    accessRight: access.name,
  });

  await document.save();

  res.send('document created!!!');
});

router.get('/', auth, async (req, res) => {
  const docs = await Document.find();
  res.send(docs);
});

router.get('/:id', auth, async (req, res) => {
  const docs = await Document.findById(req.params.id);
  if(!docs) return res.status(400).send('Document does not exist');
  
  res.send(docs);
});

export {
  router as documentRouter
};
