import {
  userController
} from '../controllers/index';
import express from 'express';
import {
  validateObjectId,
  auth,
  isAdmin
} from '../middlewares/index';

const router = express.Router();



/**
 * @swagger
 * /api/v1/users/signup:
 *    post:
 *      summary: creates a new user.
 *      tags: [/api/v1/users]
 *      consumes:
 *        - application/json
 *      description: Creates a new user
 *      parameters:
 *        - name: user
 *          in: body
 *          description: user details.
 *          schema:
 *            type: object
 *            required: true
 *            properties:
 *              username:
 *                type: string
 *                example: ChbuezeE
 *              email:
 *                type: string
 *                example: chibueze@test.com
 *              password:
 *                type: string
 *                example: "12345"
 *              firstname:
 *                type: string
 *                example: Eziokwubundu
 *              lastname:
 *                type: string
 *                example: Chibueze
 *              role:
 *                type: string
 *                example: regular
 *      responses:
 *        200:
 *          description: User created successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not create a user
 *          schema:
 *            type: string
 */
router.post('/signup', userController.signup);

/**
 * @swagger
 * /api/v1/users/login:
 *    post:
 *      summary: login a user.
 *      tags: [/api/v1/users]
 *      consumes:
 *        - application/json
 *      description: This should login a user
 *      parameters:
 *        - in: body
 *          name: payload
 *          description: should contain the user's email and password.
 *          schema:
 *            type: object
 *            required: true
 *            properties:
 *              email:
 *                type: string
 *                example: chibueze@test.com
 *              password:
 *                type: string
 *                example: "12345"
 *      responses:
 *        200:
 *          description: User logged in successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not login user
 *          schema:
 *            type: string
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/v1/users/logout:
 *    post:
 *      summary: logout a user.
 *      tags: [/api/v1/users]
 *      consumes:
 *        - application/json
 *      description: This should logout a user
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: logged in users token.
 *      responses:
 *        200:
 *          description: User logged out
 *          schema:
 *            type: string
 *        400:
 *          description: User logged out
 *          schema:
 *            type: string        
 */
router.post('/logout', userController.logout);

/**
 * @swagger
 * /api/v1/users:
 *    get:
 *      summary: returns all users.
 *      tags: [/api/v1/users]
 *      description: This should return all users
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: Admin token.
 *      responses:
 *        200:
 *          description: A list of users
 *          schema:
 *            type: string
 *        400:
 *          description: Failed Request
 *          schema:
 *            type: string
 *        401:
 *          description: Unauthorized 
 *          schema:
 *            type: string 
 *        403:
 *          description: User not an Admin 
 *          schema:
 *            type: string 
 */
router.get('/', [auth, isAdmin], userController.get);

/**
 * @swagger
 * /api/v1/users/documents:
 *    get:
 *      summary: returns document belonging to the user with the given id.
 *      tags: [/api/v1/users]
 *      description: This should return a user documents
 *      parameters:
 *        - in: query
 *          name: limit
 *          description: The batch limit.
 *          required: false
 *        - in: query
 *          name: pages
 *          required: false
 *          description: The pagination.
 *        - in: header
 *          name: x-auth-token
 *          description: should be a valid user token
 *      responses:
 *        200:
 *          description: user's document
 *          schema:
 *            type: string
 *        400:
 *          description: Failed Request
 *          schema:
 *            type: string
 *        401:
 *          description: Unauthorized 
 *          schema:
 *            type: string 
 *        403:
 *          description: User not an Admin 
 *          schema:
 *            type: string
 */
//search for documents owned byb the specific user
router.get('/documents', auth, userController.getUserDocuments);


/**
 * @swagger
 * /api/v1/users/{id}:
 *    get:
 *      summary: returns the user with the given id.
 *      tags: [/api/v1/users]
 *      description: This should return a user
 *      parameters:
 *        - in: path
 *          name: id
 *          description: user's id.
 *          properties:
 *            id:
 *              type: string
 *        - in: header
 *          name: x-auth-token
 *          description: Admin token.
 *      responses:
 *        200:
 *          description: Specific user
 *          schema:
 *            type: string
 *        400:
 *          description: Failed Request
 *          schema:
 *            type: string
 *        401:
 *          description: Unauthorized 
 *          schema:
 *            type: string 
 *        403:
 *          description: User not an Admin 
 *          schema:
 *            type: string
 */
router.get('/:id', [validateObjectId, auth, isAdmin], userController.getById);

/**
 * @swagger
 * /api/v1/users/{id}:
 *    put:
 *      summary: updates a user with the specifed id.
 *      tags: [/api/v1/users]
 *      consumes:
 *        - application/json
 *      description: Updates an existing user
 *      parameters:
 *        - in: path
 *          name: id
 *          description: user's id
 *        - in: body
 *          name: User's details
 *          description: user details.
 *          schema:
 *            type: object
 *            required: true
 *            properties:
 *              password:
 *                type: string
 *                example: "12345"
 *              firstname:
 *                type: string
 *                example: Eziokwubundu
 *              lastname:
 *                type: string
 *                example: Chibueze
 *        - in: header
 *          name: x-auth-token
 *          description: user's token
 *      responses:
 *        200:
 *          description: User updated successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not update the user
 *          schema:
 *            type: string
 */
router.put('/:id', [validateObjectId, auth], userController.put);

/**
 * @swagger
 * /api/v1/users/{id}:
 *    delete:
 *      summary: deletes a user with the passed id
 *      tags: [/api/v1/users]
 *      consumes:
 *        - application/json
 *      description: This should delete an existing user with the given id
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the user requested.
 *        - in: header
 *          name: x-auth-token
 *          description: User's token
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
router.delete('/:id', [validateObjectId, auth], userController.delete);

export {
  router as usersRouter
};
