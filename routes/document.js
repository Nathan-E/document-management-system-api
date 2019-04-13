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
  if (!role) return res.status(404).send("Invalid request3");

  const userRoleInfo = await Access.findOne({
    name: role.title
  });
  if (!userRoleInfo) return res.status(404).send("Invalid request4");

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

  if (!docs.length) return res.status(404).send("No document exist");

  res.send(docs);
});



export {
  router as documentRouter
};