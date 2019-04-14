import {
  validateDocument
} from "../validations/index";
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
import { documentController } from '../controllers/index';

const router = express.Router();

/**
 * @swagger
 * /api/v1/documents:
 *    post:
 *      summary: creates a new document.
 *      tags: [/api/v1/documents]
 *      consumes:
 *        - application/json
 *      description: This should create a new document
 *      parameters:
 *        - in: body
 *          name: title
 *          description: the document title
 *          example: Natural Processing
 *        - in: body
 *          name: type
 *          description: the document type
 *          example: thesis
 *        - in: body
 *          name: content
 *          description: the document content
 *          example: Use Glycol for dehydration
 *        - in: body
 *          name: accessRight
 *          description: the document access right
 *          example: 4
 *        - in: header
 *          name: token
 *          description: should be a valid user token
 *      schema:
 *        type: object
 *        required:
 *          - title
 *          - type
 *          - content
 *          - accessRight
 *        properties:
 *          title:
 *            type: string
 *            example: admin
 *          type:
 *            type: string
 *            example: thesis
 *          content:
 *            type: string
 *          accessRight:
 *            type: number
 *            example: 1
 *      responses:
 *        200:
 *          description: Document created successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not create the document
 *          schema:
 *            type: string
 *        401:
 *          description: Unauthorized
 *          schema:
 *            type: string
 *        403:
 *          description: invalid request 
 *          schema:
 *          type: string 
 *        404:
 *          description: invalid request
 *          schema:
 *          type: string
 */
//creates a document
router.post("/", auth, documentController.post);

/**
 * @swagger
 * /api/v1/document:
 *    get:
 *      summary: returns all documents.
 *      tags: [/api/v1/documents]
 *      description: This should return all document
 *      parameters:
 *        - in: header
 *          name: token
 *          description: should be a valid user token
 *      responses:
 *        200:
 *          description: A list of document
 *          schema:
 *            type: string
 *        400:
 *          description: invalid Request
 *          schema:
 *          type: string
 *        401:
 *          description: Unauthorized
 *          schema:
 *          type: string
 */
//Return document according to access level
router.get("/", auth, documentController.get);

/**
 * @swagger
 * /api/v1/documents/{id}:
 *    get:
 *      summary: returns the unique document with the passed id
 *      tags: [/api/v1/documents]
 *      consumes:
 *        - application/json
 *      description: This should return an existing document with the given id
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the document requested.
 *        - in: header
 *          name: token
 *          description: should be a valid user token
 *      schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          id:
 *            type: string
 *      responses:
 *        200:
 *          description:  success
 *          schema:
 *            type: string
 *        400:
 *          description: Invalid ID
 *          schema:
 *            type: string
 */
router.get("/:id", [validateObjectId, auth], documentController.getByID);

/**
 * @swagger
 * /api/v1/document/{id}:
 *    put:
 *      summary: updates a document with the given id.
 *      tags: [/api/v1/documents]
 *      consumes:
 *        - application/json
 *      description: This should update an existing document
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the document requested.
 *        - in: body
 *          name: title
 *          description: the document title
 *          example: Natural Processing
 *        - in: body
 *          name: type
 *          description: the document type
 *          example: thesis
 *        - in: body
 *          name: content
 *          description: the document content
 *          example: Use Glycol for dehydration
 *        - in: body
 *          name: accessRight
 *          description: the document access right
 *          example: 4
 *        - in: header
 *          name: x-auth-token
 *          description: An authorization token
 *      schema:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *            example: admin
 *          type:
 *            type: string
 *            example: thesis
 *          content:
 *            type: string
 *          accessRight:
 *            type: number
 *            example: 1
 *      responses:
 *        200:
 *          description: document updated successfully
 *          schema:
 *            type: string
 *        400:
 *          description: invalid request
 *          schema:
 *            type: string
 *        401:
 *          description: Unauthorized
 *          schema:
 *            type: string
 *        403:
 *          description: invalid request
 *          schema:
 *          type: string
 *        404:
 *          description: invalid request 
 *          schema:
 *            type: string
 */
router.put("/:id", [validateObjectId, auth], async (req, res) => {
  //validate the request body
  const {
    error
  } = validateDocumentUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //gets the document if it exist
  let doc = await Document.findById(req.params.id);
  if (!doc || doc.deleted)
    return res.status(404).send("Document does not exist");
  //get the user requesting for it
  const user = await User.findById(req.user._id);
  if (!user || user.deleted) return res.status(404).send("Invalid request");
  //checks if the user is the owner of the document
  const compareObjectId = doc.owner_id.toString() === user._id.toString();
  if (!compareObjectId) return res.status(403).send("Invalid request");
  //set the document new type
  const type = req.body.type ?
    await Type.findOne({
      title: req.body.type
    }) :
    doc;

  const role = await Role.findById(user.role);
  //get the user's accesss level
  const userRoleInfo = await Access.findOne({
    name: role.title
  });

  let access;
  //get the access level in the request bodu if it exist
  if (req.body.accessRight) {
    access = await Access.findOne({
      level: req.body.accessRight
    });
    //ensure the document new access level is set wuthin the user access level
    if (access.level < userRoleInfo.level)
      return res.status(400).send("Invalid request");
  }
  //sets the access level
  const accessRight = access ? access.level : doc.accessRight;
  //updates the document
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

/**
 * @swagger
 * /api/v1/document/{id}:
 *    put:
 *      summary: deletes a document with the given id.
 *      tags: [/api/v1/documents]
 *      consumes:
 *        - application/json
 *      description: This should delete an existing document
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the document to be deleted.
 *        - in: header
 *          name: x-auth-token
 *          description: An authorization token
 *      responses:
 *        200:
 *          description: document deleted
 *          schema:
 *            type: string
 *        400:
 *          description: invalid request
 *          schema:
 *            type: string
 *        401:
 *          description: Unauthorized
 *          schema:
 *            type: string
 *        404:
 *          description: invalid request 
 *          schema:
 *            type: string
 */
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  //checks if the document exist
  let doc = await Document.findById(req.params.id);
  if (!doc || doc.deleted)
    return res.status(404).send("Document does not exist");
  //checks if the user exist
  const user = await User.findById(req.user._id);
  if (!user || user.deleted) return res.status(404).send("Invalid request");
  //gets the role of the user
  const role = await Role.findById(user.role);
  //gets the access level of the user
  const userRoleInfo = await Access.findOne({
    name: role.title
  });
  //checks if the user owns the document
  const compareObjectId = doc.owner_id.toString() === user._id.toString();
  //checks if the user is an admin
  const isAdmin = userRoleInfo.level === 1;
  //returnss 400 if the user does not own the document nor an admin
  if (!compareObjectId || !isAdmin) return res.status(400).send("Invalid request");

  //finds the document and deletes it
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

//Validates the document update fields
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