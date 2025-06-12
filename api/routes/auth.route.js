// ✅ Route definitions for authentication
import express from 'express';
import { google, signOut, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

// ✅ Route for user signup
router.post("/signup", signup);

// ✅ Route for user signin
router.post("/signin", signin);

// ✅ Route for Google sign-in
router.post('/google', google);

// ✅ Route for logging out
router.get('/signOut', signOut);

export default router;
