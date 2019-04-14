import mongoose from 'mongoose';

//Document Schema
const documentSchema = new mongoose.Schema({
  //document title
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 255
  },
  //document type id
  type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
    required: true
  },
  //owner's id (user)
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  //user's role ( admin or regular)
  ownerRole: {
    type: String,
    required: true
  },
  //document content
  content: {
    type: String,
    required: true,
  },
  //time created
  createdAt: {
    type: Date,
    default: Date.now()
  },
  //access degree
  accessRight: {
    type: Number,
    default: 4
  },
  //time modified
  modifiedAt: {
    type: Date,
    default: null
  },
  //holds id user is deleted
  userStatus: {
    type: Boolean,
    default: true
  },
  //tells if the document has been deleted
  deleted: {
    type: Boolean,
    default: false
  }
});

//Document Model
const Document = mongoose.model('Document', documentSchema);

export {
  Document
};
