const express = require("express");

const router = express.Router();
const jobCategoryController = require("../app/controllers/JobCategoryController.controller");

router.get("/all", jobCategoryController.getAllJobCategories);
router.post("/new", jobCategoryController.createJobCategry);

module.exports = router;