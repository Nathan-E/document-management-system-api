import mongoose from 'mongoose';

//Role Schema
const roleSchema = new mongoose.Schema({
  //title of roles (admin, regular)
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

export {
  Role,
  roleSchema
};
