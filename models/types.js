import mongoose from 'mongoose';
import Joi from 'joi';

const typeSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 5,
    max: 25,
    unique: true,
    required: true
  }
});

const Type = mongoose.model('Type', typeSchema);

const validate = role => {
  const schema = {
    title: Joi.string().min(5).max(25).required()
  }

  return Joi.validate(typeSchema, schema);
}