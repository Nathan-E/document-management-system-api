import {
  searchDocument
} from '../controllers/index';
import {
  auth,
  isAdmin
} from '../middlewares/index';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /api/v1/search?:
 *    get:
 *      summary: creates a new user.
 *      tags: [/api/v1/search]
 *      consumes:
 *        - application/json
 *      description: searches the document using avaliable queries
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: logged in users token.
 *        - in: query
 *          name: role
 *          required: false 
 *          description: eg. regular
 *          schema:
 *            type: string 
 *            enum:
 *              - admin
 *              - regular
 *        - in: query
 *          name: accessRight
 *          description: eg. 1
 *          schema:
 *            type: string 
 *            description: eg. 1
 *            enum:
 *              - 1
 *              - 2
 *              - 3
 *              - 4
 *        - in: query
 *          name: page
 *          required: false
 *          description: eg. 1
 *          type: string
 *        - in: query
 *          name: limit
 *          required: false
 *          description: eg. 1
 *          type: string
 *      responses:
 *        200:
 *          description: Document found
 *          schema:
 *            type: string
 *        400:
 *          description: Invalid request
 *          schema:
 *            type: string        
 *        401:
 *          description: Access Denied
 *          schema:
 *            type: string
 *        403:
 *          description: Access Denied
 *          schema:
 *            type: string
 */
//search documents considering query strings
router.get('/', [auth, isAdmin], searchDocument.get);

export {
  router as searchDocument
};