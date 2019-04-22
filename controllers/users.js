import {
  User, Document, Role
} from '../models/index';
import {
  usersValidator
} from '../validations/index';
import _ from 'lodash';
import bcrypt from 'bcrypt';

//User Controller
class User{
  constructor(){};

// POST /signup
//signs up a user
async signup(req, res) {
  //validates the request input field
  const {
    error
  } = usersValidator.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checks if user already exist
  let user = await User.findOne({
    email: req.body.email
  });
  if (user) return res.status(400).send('User already exist');

  //checks if a valid role is passed in the request body
  if (req.body.role === 'admin') return res.status(400).send('invalid role');
  const role = await Role.findOne({
    title: req.body.role
  });
  if (!role) return res.status(400).send('Invalid role.');
  //hashs the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  //creates the user
  user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    role: role._id,
    username: req.body.username,
    email: req.body.email,
    password: password
  })

  //saves the user
  await user.save();

  res.send('New user created!!!');
};

// POST /login
//Allow an authenicated user to log in
async login(req, res) {
  //validates the request body
  const {
    error
  } = usersValidator.validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checks up the user by the request body email field
  let user = await User.findOne({
    email: req.body.email
  });
  if (!user) return res.status(400).send('Invalid email or password');
  if (user.deleted) return res.status(400).send('User does not exist');

  //valids the user request password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  //generates a unique token for the user
  const token = user.generateAuthToken();

  //set the token in the header
  res.setHeader('x-auth-token', token);
  res.send('User logged in');
};

//GET /: id / documents
async getUserDocuments(req, res) {
  //get the request queries
  let page = req.query.page;
  let limit = req.query.limit;
  //checks if the user exist
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("Invalid request");
  //returns the documents within the user access right
  const docs = await Document.find({
    owner_id: user._id
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
  if (start != 0 && limit) {
    chuncks = docs.slice(start, stop);
    return res.status(200).send(chuncks);
  }
  //returns all the found documents if no queries are specified
  res.status(200).send(docs);
};
}







// POST /logout
//logs a user out
userController.logout = async (req, res) => {
  //get the token from the header
  let token = req.headers['x-auth-token'];
  if (!token) return res.status(400).send('invalid request');

  //deletes the token
  delete req.headers['x-auth-token'];
  //set token to empty string if deleted
  token = '';

  res.setHeader('x-auth-token', token);
  res.send('User logged out');
};

// GET /
//returns all users
userController.get = async (req, res) => {
  //gets all users and sort by firstname
  const user = await User.find().sort('firstname');

  res.send(user);
}

// GET /:id
//gets a specific user
userController.getById = async (req, res) => {
  //checks for the user
  const user = await User.findById(req.params.id);
  //returns 404 if the user have been deleted or does not exist
  if (!user || user.deleted) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
};


// PUT /:id
userController.put = async (req, res) => {
  //validates the request body
  const {
    error
  } = usersValidator.validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const check = req.params.id.toString() === req.user._id;
  if(!check) return res.status(403).send('invald token');
  
  //checks for the user
  let user = await User.findById(req.params.id);
  //returns 400 if user does not exist
  if (!user || user.deleted) return res.status(400).send('User does not exist');
  //hashs the password if it exist in the request body
  const salt = await bcrypt.genSalt(10);
  const password = req.body.password ? await bcrypt.hash(req.body.password, salt) : user.password;

  //updates the user
  user = await User.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      firstname: req.body.firstname || user.firstname,
      lastname: req.body.lastname || user.lastname,
      password: password
    }
  }, {
    new: true
  });

  res.status(200).send(user);
};

// DELETE /:id
userController.delete = async (req, res) => {
  //check for the user with the passed id
  let user = await User.findById(req.params.id);
  //returns 400 if the user does not exist or has been deleted
  if (!user || user.deleted) return res.status(400).send('User does not exist');

  //updates the user
  user = await User.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      deleted: true
    }
  }, {
    new: true
  });

  res.status(200).send(user);
};

export {
  userController
};
