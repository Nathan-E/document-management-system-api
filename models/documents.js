import mongoose from 'mongoose';
import Joi from 'joi';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 255
  },
  type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Type',
      required: true
  },
  owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  ownerRole: {
    type: String,
    required: true
  },
  content: {
    type: String,
    minlength: 255,
    maxlength: 32768,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  accessRight: {
    type: String,
    default: 'public'
  },
  modifiedAt: {
    type: Date,
    default: null
  },
  userStatus: {
    type: Boolean,
    default: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

const Document = mongoose.model('Document', documentSchema);

const validate = document => {
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
}

export { Document, validate };