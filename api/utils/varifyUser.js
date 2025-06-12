// api/utils/verifyUser.js
import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';


export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("token" ,token)

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  jwt.verify(token, 'irshad_secret_key_123', (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));
    req.user = user;
    next();
  });
};
