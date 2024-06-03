import express from "express";
import { saveProfile } from '../controllers/extension.js';
const router = express.Router();

router.post('/saveProfile', saveProfile);

export default router;