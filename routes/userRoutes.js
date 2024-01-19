const express = require("express");
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router
    .route("/")
    .get(
        authMiddleware.protect,
        authMiddleware.isAdmin,
        userController.getAllUsers
    )
    .post(userController.registerUser)
    .delete(
        authMiddleware.protect,
        authMiddleware.isAdmin,
        userController.deleteUser
    );

router
    .route("/profile")
    .get(authMiddleware.protect, userController.getUserProfile)
    .put(authMiddleware.protect, userController.updateUserProfile);
router.get(
    "/test",

    authMiddleware.isAdmin,
    authMiddleware.testController
);

module.exports = router;
