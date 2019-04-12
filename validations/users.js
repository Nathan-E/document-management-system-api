import Joi from 'joi';

const usersValidator = {};

//Validates the user payload
usersValidator.validate = user => {
  const schema = {
    firstname: Joi.string().min(5).max(50).required(),
    lastname: Joi.string().min(5).max(50).required(),
    role: Joi.string().required(),
    username: Joi.string().min(5).max(25).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(5).max(225).required(),
    deleted: Joi.boolean()
  }

  return Joi.validate(user, schema);
};

//validate login payload
usersValidator.validateLogin = req => {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.required()
  };
  return Joi.validate(req, schema);
}

//validate put request payload
usersValidator.validateUpdate = user => {
  const schema = {
    firstname: Joi.string().min(5).max(50),
    lastname: Joi.string().min(5).max(50),
    password: Joi.string().min(5).max(225),
  }

  return Joi.validate(user, schema);
};

export { usersValidator };