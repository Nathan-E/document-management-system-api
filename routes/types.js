import {
  typeController
} from '../controllers/index'
import express from 'express';
import {
  validateObjectId,
  auth,
  isAdmin
} from '../middlewares/index';

const router = express.Router();

/**
 * @swagger
 * /api/v1/types:
 *    get:
 *      summary: return all types of document.
 *      tags: [/api/v1/types]
 *      description: This should return all types
 *      responses:
 *        200:
 *          description: A list of types
 *          schema:
 *            type: string
 *        400:
 *          description: Failed Request
 *          schema:
 *            type: string
 */
router.get('/', typeController.get);

/**
 * @swagger
 * /api/v1/type:
 *    post:
 *      summary: creates a new document type.
 *      tags: [/api/v1/types]
 *      consumes:
 *        - application/json
 *      description: This should create a new type
 *      parameters:
 *        - in: body
 *          name: payload
 *          description: should contain the type's title
 *      schema:
 *        type: object
 *        required:
 *          - title
 *        properties:
 *          title:
 *            type: string
 *            example: admin
 *      responses:
 *        200:
 *          description: type created successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not create the type
 *          schema:
 *            type: string
 *        401:
 *          description: Access denied.No token provided
 *          schema:
 *            type: string
 */
router.post('/', [auth], typeController.post);

/**
 * @swagger
 * /api/v1/types/{id}:
 *    put:
 *      summary: updates the document type.
 *      tags: [/api/v1/types]
 *      consumes:
 *        - application/json
 *      description: This should update an existing type
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the type to edit.
 *        - in: body 
 *          name: title 
 *          description: The new title of the type to be updated.
 *        - in: header
 *          name: x-auth-token
 *          description: An authorization token
 *      schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *      responses:
 *        200:
 *          description: type updated successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not update the type
 *          schema:
 *            type: string
 *        401:
 *          description: Unauthorized
 *          schema:
 *            type: string
 *        403:
 *          description: User no an Admin
 *          schema:
 *          type: string
 *        404:
 *          description: Could not find  a type with the given ID 
 *          schema:
 *            type: string
 */
router.put('/:id', [validateObjectId, auth, isAdmin], typeController.put);

/**
 * @swagger
 * /api/v1/types/{id}:
 *    get:
 *      summary: returns a unique document type with the passed id
 *      tags: [/api/v1/types]
 *      consumes:
 *        - application/json
 *      description: This should return an existing type with the given id
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the type requested.
 *      schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          id:
 *            type: integer
 *          name:
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
 *        404:
 *          description: Could not find  a type with the given ID 
 *          schema:
 *            type: string
 */
router.get('/:id', validateObjectId, typeController.getById);

export {
  router as typesRouter
}
