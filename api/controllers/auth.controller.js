import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ✅ Signup a new user
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10); // ✅ encrypt password
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

// ✅ Sign in an existing user
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, 'User not found'));

    const isPasswordCorrect = bcryptjs.compareSync(password, user.password);
    if (!isPasswordCorrect)
      return next(errorHandler(401, 'Invalid email or password'));

    const token = jwt.sign({ id: user._id }, 'irshad_secret_key_123'); // ✅ Hardcoded JWT key

    const { password: pass, ...rest } = user._doc;
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'Lax',
         secure: true, // set true in production with HTTPS
   
      })
      .json(rest); // ✅ return user without password
  } catch (error) {
    return next(errorHandler(404, error));
  }
};

// ✅ Google login
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, 'irshad_secret_key_123'); 
     
      const { password: pass, ...rest } = user._doc;
      res
  res
  .status(200)
  .cookie('access_token', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: true, // true if HTTPS
  })
  .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, 'irshad_secret_key_123'); // ✅ hardcoded
        console.log("token11" , token)
      const { password: pass, ...rest } = newUser._doc;
      res
  .status(200)
  .cookie('access_token', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: true, // true if HTTPS
  })
  .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// ✅ Signout user (clear token)
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
