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
documentController.post

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
