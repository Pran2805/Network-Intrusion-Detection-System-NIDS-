import { Router } from "express";
import alertRouter from "./alert.route.js"

const router = Router()

router.use("/alerts", alertRouter)

export default router;