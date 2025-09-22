import { Router } from "express";
import { getRecentAlerts } from "../controllers/alert.controller.js";

const router = Router()
router.get("/",getRecentAlerts)
export default router;