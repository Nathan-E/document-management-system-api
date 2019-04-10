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
  type: {
    id: {
      type: mongoose.Schema.Types.ObjectId(),
      ref: 'Type',
      required: true
    }
  },
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId(),
      ref: 'User',
      required: true
    }
  },
  ownerRole: {
    type: String,
    required: true
  },
  content: {
    type: String,
    minlength: 10,
    maxlength: 1024,
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