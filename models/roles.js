import mongoose from 'mongoose';
import Joi from 'joi';

//Role Schema
const roleSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 4,
    max: 10,
    unique: true,
    required: true
  }
});

//Role Model
const Role = mongoose.model('Role', roleSchema);

//validation function for the role schema
const validate = role => {
  const schema = {
    title: Joi.string().min(4).max(10).required()
  }

  return Joi.validate(roleSchema, schema);
}

export { Role, validate};