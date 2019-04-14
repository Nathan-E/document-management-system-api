import {
  Document
} from "../models/documents";
import {
  validateDocument
} from "../validations/index";
import bcrypt from "bcrypt";
import express from "express";
import _ from "lodash";
import {
  validateObjectId,
  auth,
  isAdmin
} from "../middlewares/index";
import {
  Type
} from "../models/types";
import {
  User
} from "../models/users";
import {
  Role
} from "../models/roles";
import {
  Access
} from "../models/access";
import Joi from "joi";

const router = express.Router();

//creates a document
router.post("/", auth, async (req, res) => {
  const {
    error
  } = validateDocument(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const type = await Type.findOne({
    title: req.body.type
  });
  if (!type) return res.status(404).send("Invalid document type1");

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send("Invalid request2");

  const role = await Role.findById(user.role);

  const userRoleInfo = await Access.findOne({
    name: role.title
  });

  const access = await Access.findOne({
    level: req.body.accessRight
  });
  if (!access) return res.status(404).send("Invalid request5");

  access.level = Object.values(access)[3]["level"];
  userRoleInfo.level = Object.values(userRoleInfo)[3]["level"];

  if (access.level < userRoleInfo.level)
    return res.status(400).send("Invalid request");

  const document = new Document({
    title: req.body.title,
    type_id: type._id,
    owner_id: user._id,
    ownerRole: role.title,
    content: req.body.content,
    accessRight: access.level
  });

  await document.save();

  res.send("document created!!!");
});

//Return document according to access level
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("Invalid request");

  const role = await Role.findById(user.role);

  const userRoleInfo = await Access.findOne({
    name: role.title
  });
  userRoleInfo.level = Object.values(userRoleInfo)[3]["level"];

  if (userRoleInfo.level == 1) {
    const doc = await Document.find();

    return res.status(200).send(doc);
  }

  const docs = await Document.find({
    $or: [{
        accessRight: 4
      },
      {
        accessRight: 3,
        owner_id: user._id
      },
      {
        ownerRole: role.title,
        accessRight: userRoleInfo.level
      }
    ]
  });

  res.send(docs);
});

router.get("/:id", [validateObjectId, auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("Invalid request");

  const role = await Role.findById(user.role);

  const userRoleInfo = await Access.findOne({
    name: role.title
  });
  userRoleInfo.level = Object.values(userRoleInfo)[3]["level"];

  let doc = await Document.findById(req.params.id);
  if (!doc) return res.status(400).send("Document does not exist");

  const access1 = doc.accessRight == 4;

  const access2 = doc.accessRight == 3 && doc.owner_id == user._id;

  const access3 = doc.ownerRole == role.title && doc.accessRight == userRoleInfo.level;

  const access4 = userRoleInfo.level == 1;

  if (access1 || access2 || access3 || access4) return res.status(200).send(doc);
});

router.put("/:id", [validateObjectId, auth], async (req, res) => {
  const {
    error
  } = validateDocumentUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let doc = await Document.findById(req.params.id);
  if (!doc || doc.deleted)
    return res.status(404).send("Document does not exist");

  const user = await User.findById(req.user._id);
  if (!user || user.deleted) return res.status(404).send("Invalid request");

  const compareObjectId = doc.owner_id.toString() === user._id.toString();

  if (!compareObjectId) return res.status(403).send("Invalid request");

  const type = req.body.type ?
    await Type.findOne({
      title: req.body.type
    }) :
    doc;

  const role = await Role.findById(user.role);

  const userRoleInfo = await Access.findOne({
    name: role.title
  });

  let access;

  if (req.body.accessRight) {
    access = await Access.findOne({
      level: req.body.accessRight
    });

    access.level = Object.values(access)[3]["level"];
    userRoleInfo.level = Object.values(userRoleInfo)[3]["level"];

    if (access.level < userRoleInfo.level)
      return res.status(400).send("Invalid request");
  }

  const accessRight = access ? access.level : doc.accessRight;

  doc = await Document.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      title: req.body.title || doc.title,
      type_id: type._id,
      content: req.body.content || doc.content,
      accessRight: accessRight,
      modifiedAt: Date.now()
    }
  }, {
    new: true
  });

  res.send(doc);
});

router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  let doc = await Document.findById(req.params.id);
  if (!doc || doc.deleted)
    return res.status(404).send("Document does not exist");

  const user = await User.findById(req.user._id);
  if (!user || user.deleted) return res.status(404).send("Invalid request");

  const role = await Role.findById(user.role);

  const userRoleInfo = await Access.findOne({
    name: role.title
  });

  userRoleInfo.level = Object.values(userRoleInfo)[3]["level"];


  const compareObjectId = doc.owner_id.toString() === user._id.toString();
  const isAdmin = userRoleInfo.level == 1;

  if (!compareObjectId || !isAdmin) return res.status(400).send("Invalid request");


  doc = await Document.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      deleted: true
    }
  }, {
    new: true
  });

  res.send(doc);
});

//Validates the document fields
function validateDocumentUpdate(document) {
  const schema = {
    title: Joi.string(),
    type: Joi.string(),
    content: Joi.string(),
    accessRight: Joi.number(),
    modifiedAt: Joi.date(),
    userStatus: Joi.boolean(),
    deleted: Joi.boolean()
  };

  return Joi.validate(document, schema);
}

export {
  router as documentRouter
};