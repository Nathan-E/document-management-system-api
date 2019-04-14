//Authorisation function
export default (req, res, next) => {
  //checks if the user is an admin
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');

  next();
}