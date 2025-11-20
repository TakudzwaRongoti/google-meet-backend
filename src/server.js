import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import meetRoutes from "./routes/meetRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/meet", meetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
