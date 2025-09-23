import { Router } from "express";
import { getData, getDataById,updateDataById } from "../controllers/system.controller.js";

const router = Router()

router.get("/", getData);
router.get("/:id",getDataById);
router.patch("/:id",updateDataById );


export default router;