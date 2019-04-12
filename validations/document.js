import Joi from 'joi';

//Validates the document fields
const validateDocument = document => {
  const schema = {
    title: Joi.string().min(10).required(),
    typeId: Joi.string().required(),
    ownerId: Joi.string().required(),
    content: Joi.string().min(255).max(32768).required(),
    ownerRole: Joi.string().required(),
    accessRight: Joi.string(),
    modifiedAt: Joi.date(),
    userStatus: Joi.boolean(),
    deleted: Joi.boolean
  }

  return Joi.validate(document, schema);
};

export {
  validateDocument
};