import express from 'express';
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
  getUserProfile,
  getUser
} from '../controllers/user.controller.js';

import { verifyToken } from '../utils/varifyUser.js';

const UserRouter = express.Router();

UserRouter.get('/test', test);
// Get user profile (no token required)
UserRouter.get('/profile/:id', getUserProfile);
// Update user (token required)
UserRouter.post('/update/:id', verifyToken, updateUser);
// Delete user (token required)
UserRouter.delete('/delete/:id', verifyToken, deleteUser);
// Get user listings (token required)
UserRouter.get('/listings/:id', verifyToken, getUserListings);
// Get user info (token required)
UserRouter.get('/:id', verifyToken, getUser);

export default UserRouter;
