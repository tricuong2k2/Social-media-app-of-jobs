const express = require("express");

const router = express.Router();
const { uploadImage } = require("../config/multer");

const adminController = require("../app/controllers/AdminController.controller");

router.post("/member/info/:mid", adminController.updateMemberInfo);
router.delete("/member/avatar/:mid", adminController.deleteMemberAvatar);
router.post("/member/avatar/:mid", uploadImage.single("file"), adminController.updateMemberAvatar);
router.post("/posted-job/delete", adminController.deletePostedJob);
router.post("/posted-job/enable", adminController.enablePostedJobs);
router.post("/posted-job/hidden", adminController.hiddenPostedJobs);
router.delete("/avatar", adminController.deleteAvatar);
router.post("/avatar", uploadImage.single("file"), adminController.updateAvatar);
router.post("/info", adminController.updateAdminInfo);
router.get("/info", adminController.getAdminInfo);
router.post("/:role/delete", adminController.deleteMembers);
router.get("/list/posted-job", adminController.getListPostedJob);
router.get("/list/companies", adminController.getListCompanies);
router.post("/verify", adminController.verifyMembers);
router.post("/enable", adminController.enableMembers);
router.post("/hidden", adminController.hiddenMembers);
router.get("/list/:role", adminController.getListMembers);
router.get("/statistic/:role", adminController.statisticByMonth);
router.get("/statistic/jobs", adminController.statisticPostedJobs);
router.get("/overview", adminController.overviewInfo);

module.exports = router;