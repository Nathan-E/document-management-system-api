import {
  Document,
  Role,
  Access
} from '../models/index';

const searchDocument = {};

searchDocument.get = async (req, res) => {
  //get the request queries
  let page = req.query.page;
  let limit = req.query.limit;
  let role = req.query.role;
  let accessRight = req.query.accessRight;
  // console.log(page, limit);
  //checks if the role is valid
  let roleInfo = await Role.findOne({
    title: role
  });


  const access = await Access.findOne({
    level: accessRight
  });

  //checks if the access right is valid

  let docs;

  // executes if only the role was passed as a query
  if (role && !accessRight) {
    if (!roleInfo) return res.status(400).send('invalid request');
    docs = await Document.find({
      ownerRole: roleInfo.title
    }).sort('-createdAt');
  };

  // executes if only the accessRight was passed
  if (accessRight && !role) {
    if (!access) return res.status(400).send('invalid request');
    docs = await Document.find({
      accessRight: access.level
    }).sort('-createdAt');
  };

  // executes if the accessRight and role was passed
  if (accessRight && role) {
    if (!access) return res.status(400).send('invalid request');
    if (!roleInfo) return res.status(400).send('invalid request');
    docs = await Document.find({
      accessRight: access.level,
      ownerRole: roleInfo.title
    }).sort('-createdAt');
  };

  // executes if no filter was passed
  if (!accessRight && !role) {
    docs = await Document.find().sort('-createdAt');
  };

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
};

export { searchDocument };