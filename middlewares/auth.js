import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) return res.status(400).send('Invalid token.');

    req.user = decoded;
    next();
  });
}