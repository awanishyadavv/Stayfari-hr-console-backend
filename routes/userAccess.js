import express from "express";
import {giveAccess, removeAccess} from "../controllers/userAccess.js";
import {isAuthenticatedAdmin } from "../middelwares/auth.js";

const router = express.Router();

router.put("/updateAccess/:userId",isAuthenticatedAdmin,giveAccess);
router.delete("/removeAccess/:userId",isAuthenticatedAdmin, removeAccess);

export default router;