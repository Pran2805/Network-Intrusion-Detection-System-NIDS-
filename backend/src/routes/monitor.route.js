import { Router } from "express";
import { pastAnamolies, recentAnamolies } from "../controllers/monitor.controller.js";

const router = Router()

router.route("/recent").get(recentAnamolies)
router.route("/activity").get(pastAnamolies)

// websocket
// monitor path

export default router;