import {
  userController
} from '../controllers/index';
import express from 'express';
import {
  validateObjectId,
  auth,
  isAdmin
} from '../middlewares/index';
import { User, Document } from '../models/index';


const router = express.Router();

/**
 * @swagger
 * /api/v1/users/signup:
 *    post:
 *      summary: creates a new user.
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
 * /api/v1/users/logout:
 *    post:
 *      summary: logout a user.
 *      tags: [/api/v1/users]
 *      consumes:
 *        - application/json
 *      description: This should logout a user
 *      parameters:
 *        - in: header
 *          name: payload
 *          description: should contain users token.
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
 *      summary: returns all users.
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
 * /api/v1/users/{id}:
 *    get:
 *      summary: returns the user with the given id.
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
 * /api/v1/users/{id}/documents:
 *    get:
 *      summary: returns document belonging to the user with the given id.
 *      tags: [/api/v1/users]
 *      description: This should return a user documents
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the document requested.
 *        - in: header
 *          name: token
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
router.get('/:id/documents', [validateObjectId, auth], async (req, res) => {
  //get the request queries
  let page = req.query.page;
  let limit = req.query.limit; 
  //checks if the user exist
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("Invalid request");
  //returns the documents within the user access right
  const docs = await Document.find({owner_id: user._id});
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
});


/**
 * @swagger
 * /api/v1/users/{id}:
 *    put:
 *      summary: updates a user with the specified id.
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
 *      summary: deletes a user with the passed id
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
