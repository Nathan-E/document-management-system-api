import mongoose from 'mongoose';
import {
  Role,
  Access,
  Type,
} from "../models/index";
import {seed, roles, access, types} from './seeder_class';

let db = process.env.REMOTE_DATABASE;

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log(`Connected to ${db}...`))
  .catch((e) => {
    console.log(e.message)
  });

async function populateDatabase() {
  const role = await Role.find();
  const accesses = await Access.find();
  const type = await Type.find();
  if (role.length <= 0) await Role.collection.insertMany(roles);
  if (accesses.length <= 0) await Access.collection.insertMany(access);
  if (type.length <= 0) await Type.collection.insertMany(types);

  const seeder = new seed();
  await seeder.seedUsers(20);
  await seeder.seedDocuments(100);
};

populateDatabase();


export {
  populateDatabase
};