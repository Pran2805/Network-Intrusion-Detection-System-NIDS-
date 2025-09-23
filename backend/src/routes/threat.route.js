import { Router } from "express";
import { getStatistics, getTypes } from "../controllers/threat.controller.js";

const router = Router()

router.get("/statistics", getStatistics);
router.get("/types", getTypes);


export default router;