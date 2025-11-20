import express from "express";
import { googleOAuthRedirect, googleOAuthCallback } from "../controllers/oauthController.js";

const router = express.Router();

// Redirect the user to Google OAuth consent screen
router.get("/google", googleOAuthRedirect);

// Callback endpoint that Google will redirect to after consent
router.get("/google/callback", googleOAuthCallback);

export default router;
