import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

//middlewares
app.use(express.json);

//app PORT
const port = process.env.PORT;

//app listens on the specified PORT
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})