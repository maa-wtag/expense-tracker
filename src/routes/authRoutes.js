import express from "express";
import passport from "../config/passport.js";
import { registerUser, authUser } from "../controllers/authController.js";
const router = express.Router();

// Registration (no auth)
router.post("/register", registerUser);

// Login with Passport local
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  authUser
);

export default router;
