import Joi from 'joi';

//Validates the document fields
const validateDocument = document => {
  const schema = {
    title: Joi.string().min(10).required(),
    type: Joi.string().required(),
    content: Joi.string().max(32768).required(),
    accessRight: Joi.string().required(),
    modifiedAt: Joi.date(),
    userStatus: Joi.boolean(),
    deleted: Joi.boolean()
  }

  return Joi.validate(document, schema);
};

export {
  validateDocument
};
