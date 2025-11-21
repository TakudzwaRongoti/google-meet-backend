import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export const googleOAuthRedirect = (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
  ].join(" ");

  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes}&access_type=offline&prompt=consent`;

  res.redirect(oauthUrl);
};

export const googleOAuthCallback = async (req, res) => {
  const code = req.query.code;
  const userId = req.query.user_id;

  if (!code || !userId) {
    return res.status(400).send("Missing authorization code or user ID");
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("Token response:", tokenData);
      return res.status(400).send("Failed to obtain access token from Google");
    }

    // Save tokens to Supabase
    const { data, error } = await supabase
      .from("profiles")
      .update({
        google_access_token: tokenData.access_token,
        google_refresh_token: tokenData.refresh_token,
        google_token_expiry: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      })
      .eq("id", userId)
      .select();

    console.log("Supabase update:", data, error);

    if (error) return res.status(500).send("Failed to save tokens in Supabase");

    res.send("Google account connected successfully! You can close this page.");
  } catch (err) {
    console.error("OAuth error:", err);
    res.status(500).send("Internal server error during OAuth");
  }
};
