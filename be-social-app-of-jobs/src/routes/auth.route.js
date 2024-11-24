const express = require("express");

const router = express.Router();
const authController = require("../app/controllers/AuthController.controller");
const { verifyJwt } = require("../app/middlewares/jwtMiddleware");

router.post("/navigation", authController.navigation);
router.get("/logout", verifyJwt, authController.logout);
router.post("/send-mail", authController.sendMail);
router.get("/verify", authController.verifyEmail);
router.post("/sign-up/employer", authController.employerRegister);
router.post("/sign-up/candidate", authController.candidateRegister);
router.post("/login", authController.loginWithPassword);

module.exports = router;