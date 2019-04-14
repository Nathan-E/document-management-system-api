import Joi from 'joi';

//validates the type resource
const validateType = role => {
  const schema = {
    title: Joi.string().min(5).max(25).required()
  }

  return Joi.validate(role, schema);
}

export {
  validateType
};