import mongoose from 'mongoose';

//Access schema
const accessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  degree: {
    type: Number,
    required: true
  }
});

//Document Model
const Access = mongoose.model('Access', accessSchema);

export {
  Access
};
