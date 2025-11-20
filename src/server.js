// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import meetRoutes from "./routes/meetRoutes.js";

dotenv.config();

const app = express();

// ------------------ CORS ------------------
// Allow your frontend origin to access this backend
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL; use "*" only for development
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

// ------------------ Routes ------------------
app.use("/api/meet", meetRoutes);

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
