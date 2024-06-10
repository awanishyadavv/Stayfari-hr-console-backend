import express from "express";
import { isAuthenticated, isAuthenticatedAdmin } from "../../middelwares/auth.js";

import { 
    extensionCandidateData,
    addNewCall,
    scheduleInterview,
    getCandidatesByStage,
    getCandidateByEmail, 
    addNewReferral,
    changeStage,
    listInterviews,
    isInterviewCompleted
} from "../../controllers/hr/humanResource.js";

const router = express.Router();

router.post("/newExtensionCandidate", extensionCandidateData);
router.get("/candidates/stage/:stage",isAuthenticated, getCandidatesByStage);
router.post("/change_stage/:email",isAuthenticated, changeStage);
router.post("/addNewCall",isAuthenticated, addNewCall);
router.post("/scheduleInterview",isAuthenticated, scheduleInterview);
router.get("/list-interviews",isAuthenticated, listInterviews);
router.post("/isInterviewCompleted", isInterviewCompleted);
router.post("/addNewReferral",isAuthenticated, addNewReferral);
router.get("/candidates/email/:email",isAuthenticated, getCandidateByEmail);

export default router;
