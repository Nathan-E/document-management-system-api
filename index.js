import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Joi from 'joi';
import { rolesRouter, typesRouter, usersRouter } from './routes/index';
dotenv.config();

const app = express();

//environment variable
let db = process.env.DATABASE;
let jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

if (process.env.NODE_ENV === 'test') db = process.env.TEST_DATABASE;

//middlewares
app.use(express.json());
app.use('/api/v1/roles', rolesRouter);
app.use('/api/v1/types', typesRouter);
app.use('/api/v1/users', usersRouter);


Joi.objectId = require('joi-objectid')(Joi);



//database connection
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log(`Connected to ${db}...`));

if (!jwtPrivateKey) {
  throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
}

//app PORT
const port = process.env.PORT;

//app listens on the specified PORT
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}...`));
}

export default app;