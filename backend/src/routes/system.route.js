import { Router } from "express";
// import { getData, getDataById, updateDataById } from "../controllers/system.controller.js";

const router = Router()

// router.get("/", getData);
// router.get("/:id", getDataById);
// router.patch("/:id", updateDataById);


router.get("/status", async (req, res) => {
    res.send({
        "status": "active",
        "lastUpdated": "2025-09-23T12:10:00Z"
    })
});

router.get("/metrics", async (req, res) => {
    res.send({
        "totalAlerts": 85,
        "criticalAlerts": 5,
        "blockedAlerts": 10,
        "last24hAlerts": 20
    }
    )
});

router.get("/uptime", async (req, res) => {
    res.send({
        "uptime": 86400
    }
    )
});

router.patch("/settings", async (req, res) => {
    res.send({
        "detectionThreshold": 80
    }
    )
});
export default router;