import mongoose from 'mongoose';

//Document Schema
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

//Document Model
const DocumentM = mongoose.model('DocumentM', documentSchema);

export {
  DocumentM
};
