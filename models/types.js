import mongoose from 'mongoose';
import Joi from 'joi';

const typeSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 5,
    max: 50,
    unique: true,
    required: true
  }
});

const Type = mongoose.model('Type', typeSchema);
