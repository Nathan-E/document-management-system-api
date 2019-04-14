import mongoose from 'mongoose';

//Access schema
const accessSchema = new mongoose.Schema({
  //access level name
  name: {
    type: String,
    required: true
  },
  //access level
  level: {
    type: String,
    required: true
  }
});

//Document Model
const Access = mongoose.model('Access', accessSchema);

export {
  Access
};
