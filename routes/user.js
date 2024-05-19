import express from "express";
import {deleteUser, getAllUserforAdmin, getMyProfile, login, logout, register} from "../controllers/user.js";
import { isAuthenticated, isAuthenticatedAdmin } from "../middelwares/auth.js";

const router = express.Router();

router.post("/new",isAuthenticatedAdmin, register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me",isAuthenticated,getMyProfile);
router.get("/getAllUsers",isAuthenticatedAdmin, getAllUserforAdmin);
router.delete("/deleteUser/:userId",isAuthenticatedAdmin,deleteUser);

export default router; 