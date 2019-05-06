import {
  Document,
  Role,
  Access
} from '../models/index';

//Search Controller Class
class SearchController {
  constructor() {};

  //search documents considering query strings
  async get(req, res) {
    //get the request queries
    let page = req.query.page;
    let limit = req.query.limit;
    let role = req.query.role;
    let accessRight = req.query.accessRight;

    if (!page || page <= 0) page = 1;
    page = Number(page);
    if (!limit || limit <= 0) limit = 0;
    limit = Number(limit);

    //retrieves the role if its valid
    let roleInfo = await Role.findOne({
      title: role
    });

    //retrieves the access field if its valid
    const access = await Access.findOne({
      level: accessRight
    });

    //stores the document retrieved
    let docs;

    // executes if only the role was passed as a query parameter
    if (role && !accessRight) {
      if (!roleInfo) return res.status(400).send('invalid request');
      docs = await Document.find({
        ownerRole: roleInfo.title
      }).sort('-createdAt').skip(page * limit - limit).limit(limit);
    };

    // executes if only the accessRight was passed as a query parameter
    if (accessRight && !role) {
      if (!access) return res.status(400).send('invalid request');
      docs = await Document.find({
        accessRight: access.level
      }).sort('-createdAt').skip(page * limit - limit).limit(limit);
    };

    // executes if the accessRight and role was passed as query parameters
    if (accessRight && role) {
      if (!access) return res.status(400).send('invalid request');
      if (!roleInfo) return res.status(400).send('invalid request');
      docs = await Document.find({
        accessRight: access.level,
        ownerRole: roleInfo.title
      }).sort('-createdAt').skip(page * limit - limit).limit(limit);
    };

    // executes if no filter was passed
    if (!accessRight && !role) {
      docs = await Document.find().sort('-createdAt').skip(page * limit - limit).limit(limit);
    };

    //returns all the found documents if no queries are specified
    res.status(200).send(docs);
  };

};

export {
  SearchController
};