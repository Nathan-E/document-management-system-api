import mongoose from 'mongoose';
import {
  populateDatabase
} from './seeder_class';

//set database to remote
let db = process.env.REMOTE_DATABASE;

//connects to the database
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log(`Connected to ${db}...`))
  .catch((e) => {
    console.log(e.message)
  });

//populates the database
populateDatabase();
