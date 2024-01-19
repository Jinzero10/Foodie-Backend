const express = require("express");
const authController = require("../controller/authController");

const router = express.Router();

router.post("/", authController.login);
router.get("/refresh", authController.refresh);
router.post("/logout", authController.logout);

module.exports = router;