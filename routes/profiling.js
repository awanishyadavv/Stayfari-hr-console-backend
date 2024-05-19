import express from "express";
import {loadAccess, loadData } from "../controllers/profiling.js";
import {isAuthenticated} from "../middelwares/auth.js";

const router = express.Router();
router.get("/loadAccess/:userId",isAuthenticated, loadAccess);
router.get("/loadData/:userId",isAuthenticated, loadData);

export default router;