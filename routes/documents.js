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
router.post("/", auth, async (req, res) => {
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
});


//Return document according to access level
router.get("/", auth, async (req, res) => {
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
  if (start !=0 && limit) {
    chuncks = docs.slice(start, stop);
    return res.status(200).send(chuncks);
  }
  //returns all the found documents if no queries are specified
  res.status(200).send(docs);
});

router.get("/:id", [validateObjectId, auth], async (req, res) => {
  //validates that the user exist
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("Invalid request");
  //get the role of the user
  const role = await Role.findById(user.role);
  //get the access level of the user role
  const userRoleInfo = await Access.findOne({
    name: role.title
  });
  //gets the document if it exist
  let doc = await Document.findById(req.params.id);
  if (!doc) return res.status(400).send("Document does not exist");
  //public document
  const access1 = doc.accessRight === 4;
  //private document and owner is the user requesting
  const access2 = doc.accessRight === 3 && doc.owner_id === user._id;
  //role document and user with the role access is requesting
  const access3 = doc.ownerRole === role.title && doc.accessRight === userRoleInfo.level;
  //admin document
  const access4 = userRoleInfo.level === 1;

  if (access1 || access2 || access3 || access4) return res.status(200).send(doc);
});

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