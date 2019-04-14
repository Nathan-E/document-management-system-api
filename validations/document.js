import Joi from 'joi';

//Validates the document resources
const validateDocument = document => {
  const schema = {
    title: Joi.string().min(10).required(),
    type: Joi.string().required(),
    content: Joi.string().min(5).required(),
    accessRight: Joi.number().required(),
  }

  return Joi.validate(document, schema);
};

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
  validateDocument,
  validateDocumentUpdate
};
