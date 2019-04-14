import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Joi from 'joi';
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
import {
  rolesRouter,
  typesRouter,
  usersRouter,
  documentRouter
} from './routes/index';
dotenv.config();

const app = express();

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Document Management System',
      version: '1.0.0',
      description: 'API documentation using swagger'
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

//environment variable
let db = process.env.DATABASE;
let jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

if (process.env.NODE_ENV === 'test') db = process.env.TEST_DATABASE;

//middlewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use('/api/v1/roles', rolesRouter);
app.use('/api/v1/types', typesRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/documents', documentRouter);


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