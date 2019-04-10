import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const db = process.env.DATABASE;

//middlewares
app.use(express.json);

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log(`Connected to ${db}...`));


//app PORT
const port = process.env.PORT;

//app listens on the specified PORT
if (process.env.NODE_ENV !== 'test') {
  app.listen(port), () => console.log(`Listening on port ${port}...`);
}

export default app;