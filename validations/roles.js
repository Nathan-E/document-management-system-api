import Joi from 'joi';

//validation function for the role resourc
e
const validateRole = role => {
  const schema = {
    title: Joi.string().min(4).max(10).required()
  }

  return Joi.validate(role, schema);
};

export {
  validateRole
};
