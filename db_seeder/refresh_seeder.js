import mongoose from 'mongoose';
import {
  seed,
  roles,
  access,
  types
} from './seeder_class';
import {
  Role,
  Document,
  Access,
  Type,
  User
} from "../models/index";

let db = process.env.REMOTE_DATABASE;

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log(`Connected to ${db}...`))
  .catch((e) => {
    console.log(e.message)
  });


async function repopulate() {
  await Document.deleteMany({});
  await User.deleteMany({});

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

repopulate();