const express = require("express");

const router = express.Router();
const { uploadImage, uploadResume } = require("../config/multer");
const candidateController = require("../app/controllers/CandidateController.controller");

router.get("/company-applied", candidateController.getCompanyApplied);
router.get("/applied", uploadImage.single("file"), candidateController.getJobApplied);
router.get("/resumes/", candidateController.getResumes)
router.delete("/resume/:resumeId", candidateController.deleteResume);
router.post("/resumes/", uploadResume.single("file"), candidateController.updateResumes);
router.delete("/avatar/", candidateController.deleteAvatar);
router.post("/avatar/", uploadImage.single("file"), candidateController.updateAvatar);
router.post("/info/", candidateController.updateInfo);
router.get("/info/", candidateController.getInfo);
router.get("/applied-jobs/", candidateController.getAppliedJobs);
router.get("/all-saved-jobs/", candidateController.getAllSavedJobs);
router.post("/save-job/", candidateController.saveJob);

module.exports = router;
