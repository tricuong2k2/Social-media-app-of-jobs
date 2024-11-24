const express = require("express");

const router = express.Router();
const applicationController = require("../app/controllers/ApplicationController.controller");
const { roleVerify } = require("../app/middlewares/roleMiddleware");
const { uploadResume } = require("../config/multer");

router.post("/apply/new-resume", roleVerify("candidate"), uploadResume.single("file"), applicationController.applyForJobWithUploadNewResume);
router.post("/apply/uploaded-resume", roleVerify("candidate"), applicationController.applyForJob);

module.exports = router;