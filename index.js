import express from 'express';

const app = express();

//middlewares
app.use(express.json);

//app PORT
const port = process.env.PORT || 5000;

//app listens on the specified PORT
app.listen(port, () => {
  console.log(`Listining on port ${port}`);
})