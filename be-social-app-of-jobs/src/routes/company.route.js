const express = require("express");

const router = express.Router();
const { uploadImage } = require("../config/multer");
const companyController = require("../app/controllers/CompanyController.controller");

router.delete("/logo", companyController.deleteCompanyLogo);
router.post("/logo", uploadImage.single("file"), companyController.updateCompanyLogo);
router.post("/enable-job/", companyController.enablePostedJobs);
router.post("/hidden-job/", companyController.hiddenPostedJobs);
router.post("/post-job", companyController.postJob);
router.get("/jobs", companyController.getJobsOfCompany);
router.post("/info", companyController.updateCompanyInfo);
router.get("/info", companyController.getCompanyInfo);

module.exports = router;