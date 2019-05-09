export default (err, req, res, next) => {
  //Handles uncaught error in app routes
  if (err) return res.status(500).send('Something went wrong!!!');
};