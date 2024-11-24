const express = require("express");

const router = express.Router();
const { roleVerify } = require("../app/middlewares/roleMiddleware");

const jobController = require("../app/controllers/JobController.controller");
const applicationController = require("../app/controllers/ApplicationController.controller");

router.get("/search", jobController.searchJobs);
router.get("/info/:jobId", jobController.getJobInfo);
router.post("/apply", roleVerify("candidate"), applicationController.applyForJob);
router.get("/suggestion", jobController.getAllJobs);

module.exports = router;