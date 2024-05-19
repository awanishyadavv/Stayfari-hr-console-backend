import express from "express";
import { convertToJson, getAllDataFileName, getDataRangeWithFileId, updateData } from "../controllers/data.js";
import { upload } from "../middelwares/multer.js";
import { isAuthenticated, isAuthenticatedAdmin } from "../middelwares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticatedAdmin, upload.single('uploaded_file'), convertToJson);
router.put("/update/:userId", isAuthenticated, updateData);
router.get("/getAllDataFileName", isAuthenticatedAdmin, getAllDataFileName);
router.get("/getDataRangeWithFileId/:id", isAuthenticatedAdmin, getDataRangeWithFileId);

export default router;
