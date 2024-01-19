const express = require("express");
const productsController = require("../controller/productsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router
    .route("/")
    .post(
        authMiddleware.protect,
        authMiddleware.isAdmin,
        productsController.upload,
        productsController.addProduct
    )
    .get(productsController.getProduct);
router.get("/getimage/:pid", productsController.getImage);
router.put(
    "/:id",
    authMiddleware.protect,
    authMiddleware.isAdmin,
    productsController.upload,
    productsController.updateProduct
);
router.delete(
    "/:id",
    authMiddleware.protect,
    authMiddleware.isAdmin,
    productsController.deleteProduct
);

module.exports = router;
