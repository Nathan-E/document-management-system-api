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
router.put("/:id", [validateObjectId, auth], documentController.put);

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
router.delete("/:id", [validateObjectId, auth], documentController.delete);

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