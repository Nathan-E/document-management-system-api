import mongoose from 'mongoose';
import Joi from 'joi';

const roleSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 4,
    max: 10,
    unique: true,
    required: true
  }
});

const Role = mongoose.model('Role', roleSchema);