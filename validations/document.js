import Joi from 'joi';

//Validates the document resources
const validateDocument = document => {
  const schema = {
    title: Joi.string().min(10).required(),
    type: Joi.string().required(),
    content: Joi.string().required(),
    accessRight: Joi.number().required(),
    modifiedAt: Joi.date(),
    userStatus: Joi.boolean(),
    deleted: Joi.boolean()
  }

  return Joi.validate(document, schema);
};

export {
  validateDocument
};
