import mongoose from 'mongoose';
import Joi from 'joi';

//Type Schema
const typeSchema = new mongoose.Schema({
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