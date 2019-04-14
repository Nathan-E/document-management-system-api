import {
  validateDocument
} from "../validations/document";
import express from "express";
import _ from "lodash";
import {
  validateObjectId,
  auth
} from "../middlewares/index";
import {
  Type,
  Role,
  User,
  Access,
  Document
} from "../models/index";
import Joi from "joi";

//Document controller
const documentController = {};

//POST /
//creates a new document
documentController.post = async (req, res) => {
  //validates the document request body
  const {
    error
  } = validateDocument(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //checks for the document type exist
  const type = await Type.findOne({
    title: req.body.type
  });
  if (!type) return res.status(404).send("Invalid document type");
  //chaecks if the user exist
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send("Invalid user");
  //gets the user role
  const role = await Role.findById(user.role);

  const userRoleInfo = await Access.findOne({
    name: role.title
  });
  //check for the access level passed in the request body
  const access = await Access.findOne({
    level: req.body.accessRight
  });
  if (!access) return res.status(404).send("Invalid access right");

  //ensures the user does not assign to the document access levels above her
  if (access.level < userRoleInfo.level)
    return res.status(403).send("access level unauthorized");
  //creates the document
  const document = new Document({
    title: req.body.title,
    type_id: type._id,
    owner_id: user._id,
    ownerRole: role.title,
    content: req.body.content,
    accessRight: access.level
  });
  //saves the document to the database
  await document.save();

  res.send("document created!!!");
}
//GET /
//return document unique to user
documentController.get

//GET /:id
//return the document with the given id
documentController.getByID

//PUT /:id
//updates the document with the given id
documentController.put

//DELETE /:id
//delete the document with the given id
documentController.delete


export {
  documentController
};