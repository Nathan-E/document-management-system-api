import mongoose from 'mongoose';

//Type Schema
const typeSchema = new mongoose.Schema({
  //title of a unique document type
  title: {
    type: String,
    min: 5,
    max: 25,
    unique: true,
    required: true
  }
});

//Type Model
const Type = mongoose.model('Type', typeSchema);


export {
  Type
};
