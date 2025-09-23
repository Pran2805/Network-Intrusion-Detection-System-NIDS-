import { Router } from "express";
import alertRouter from "./alert.route.js"
import monitorRouter from "./monitor.route.js"
import networkRouter from './network.route.js'
import threatRouter from './threat.route.js'
import securityRouter from './system.route.js'
const router = Router()

router.use("/alerts", alertRouter)
router.use("/monitor", monitorRouter)
router.use("/network", networkRouter)
router.use("/threats", threatRouter)
router.use("/security", securityRouter)

export default router;