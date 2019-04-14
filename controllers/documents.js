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
documentController.get = async (req, res) => {
  //get the request queries
  let page = req.query.page;
  let limit = req.query.limit;
  //checks if the user exist
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("Invalid request");
  //gets the role of the user
  const role = await Role.findById(user.role);
  //checks the access level of the user
  const userRoleInfo = await Access.findOne({
    name: role.title
  });
  //returns all documents if user is admin
  if (userRoleInfo.level === 1) {
    const doc = await Document.find();
    return res.status(200).send(doc);
  }
  //returns the documents within the user access right
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
  //checks if the query string is truthy
  if (!page) page = 0;
  page = Number(page);
  if (!limit) limit = 0;
  limit = Number(limit);

  //set the pagination and limit
  let start = page * limit;
  let stop = start + limit;

  let chuncks;
  //returns document in batches according to query string limit
  if (!start && limit) {
    chuncks = docs.slice(0, limit)
    return res.status(200).send(chuncks);
  }
  //returns document in batches according to query string limit and page set
  if (start != 0 && limit) {
    chuncks = docs.slice(start, stop);
    return res.status(200).send(chuncks);
  }
  //returns all the found documents if no queries are specified
  res.status(200).send(docs);
}

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