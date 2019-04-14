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
 * /api/v1/users:
 *    post:
 *      summary: create a new user.
 *      tags: [/api/v1/users]
 *      consumes:
 *        - application/json
 *      description: This should create a new user
 *      parameters:
 *        - in: body
 *          name: payload
 *          description: should contain the user's name, email and password, user, username.
 *      schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          username:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          firstname:
 *            type: string
 *          lastname:
 *            type: string
 *          user:
 *            type: string
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
 * /api/v1/users:
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
 *      schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
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
 * /api/v1/users:
 *    post:
 *      summary: logout a user.
 *      tags: [/api/v1/users]
 *      consumes:
 *        - application/json
 *      description: This should logout a user
 *      parameters:
 *        - in: body
 *          name: payload
 *          description: should contain the user's email and password.
 *      responses:
 *        200:
 *          description: User logged out
 *          schema:
 *            type: string
 */
router.post('/logout', userController.logout);

/**
 * @swagger
 * /api/v1/users:
 *    get:
 *      summary: gets all users.
 *      tags: [/api/v1/users]
 *      description: This should return all users
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
 * /api/v1/users:
 *    get:
 *      summary: gets a users.
 *      tags: [/api/v1/users]
 *      description: This should return a user
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
router.get('/:id', [validateObjectId, auth], userController.getById);

/**
 * @swagger
 * /api/v1/users:
 *    put:
 *      summary: gets a users.
 *      tags: [/api/v1/users]
 *      description: This should return a user
 *      responses:
 *        200:
 *          description: User Updated
 *          schema:
 *            type: string
 *        400:
 *          description: Failed Request
 *          schema:
 *            type: string
 */
router.put('/:id', validateObjectId, userController.put);

/**
 * @swagger
 * /api/v1/users/{id}:
 *    delete:
 *      summary: delete user with the passed id
 *      tags: [/api/v1/users]
 *      consumes:
 *        - application/json
 *      description: This should delete an existing user with the given id
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the user requested.
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
 */
router.delete('/:id', [validateObjectId, auth], userController.delete);

export {
  router as usersRouter
};
