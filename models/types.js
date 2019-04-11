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

//validates the role schema
const validate = role => {
  const schema = {
    title: Joi.string().min(5).max(25).required()
  }

  return Joi.validate(role, schema);
}

export { Type, validate};
