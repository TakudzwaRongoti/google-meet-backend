import { Router } from "express";
import { createMeeting } from "../controllers/meetController.js";

const router = Router();

// POST /api/meet/create
router.post("/create", createMeeting);

export default router;
