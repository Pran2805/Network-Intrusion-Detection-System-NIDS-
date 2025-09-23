import { Router } from "express";
import { NetworkTopology, NetworkTraffic } from "../controllers/network.controller.js";

const router = Router()

router.get("/topology",NetworkTopology);
router.get("/traffic", NetworkTraffic);
// websocket connection

export default router;