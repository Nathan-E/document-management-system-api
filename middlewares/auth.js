import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

//Authenication
export default (req, res, next) => {
  const token = req.header('x-auth-token');
  //return 401 if there is no token
  if (!token) return res.status(401).send('Access denied. No token provided.');

  //verifies the token send
  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) return res.status(400).send('Invalid token.');

    //decodes the token
    req.user = decoded;
    next();
  });
}
