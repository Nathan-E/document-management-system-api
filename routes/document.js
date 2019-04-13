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
import Joi from 'joi';


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
  if (!docs) return res.status(400).send('Document does not exist');

  res.send(docs);
});

router.put('/:id', auth, async (req, res) => {
  const {
    error
  } = validateDocumentUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let doc = await Document.findById(req.params.id);
  if (!doc || doc.deleted) return res.status(401).send('Document does not exist');

  const type = req.body.type ? await Type.findOne({
    title: req.body.type
  }) : doc;
  if (!type) return res.status(402).send('Invalid document type');

  const user = await User.findById(req.user._id);
  if (!user) return res.status(403).send('Invalid request');

  const role = await Role.findById(user.role);
  if (!role) return res.status(404).send('Invalid request');

  const userRoleInfo = await Access.findOne({
    name: role.title
  });
  if (!userRoleInfo) return res.status(405).send('Invalid request');

  let access;

  if (req.body.accessRight) {
    access = await Access.findOne({
      name: req.body.accessRight
    });

    access.level = Object.values(access)[3]['level'];
    userRoleInfo.level = Object.values(userRoleInfo)[3]['level'];

    if (access.level < userRoleInfo.level) return res.status(406).send('Invalid request');
  };

  doc = await Document.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      title: req.body.title || doc.title,
      type_id: type._id,
      content: req.body.content || doc.content,
      accessRight: access.name || doc.accessRight,
      modifiedAt: Date.now(),
    }
  }, {
    new: true
  });

  res.send(doc);
});

router.delete('/:id', [auth, isAdmin], async (req, res) => {
  let doc = await Document.findById(req.params.id);
  if (!doc || doc.deleted) return res.status(400).send('Document does not exist');

  doc = await Document.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      deleted: true
    }
  }, {
    new: true
  });

  res.status(200).send(doc);
});

//Validates the document fields
function validateDocumentUpdate(document) {
  const schema = {
    title: Joi.string(),
    type: Joi.string(),
    content: Joi.string(),
    accessRight: Joi.string(),
    modifiedAt: Joi.date(),
    userStatus: Joi.boolean(),
    deleted: Joi.boolean()
  }

  return Joi.validate(document, schema);
};

export {
  router as documentRouter
};