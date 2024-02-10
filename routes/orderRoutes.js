const express = require("express");
const orderController = require("../controller/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router
    .route("/")
    .post(authMiddleware.protect, orderController.addOrder)
    .get(authMiddleware.protect, orderController.getUserOrder)
    .put(
        authMiddleware.protect,
        authMiddleware.isAdmin,
        orderController.changeOrderStatus
    )
    .delete(
        authMiddleware.protect,
        authMiddleware.isAdmin,
        orderController.deleteOrder
    );
router.get(
    "/getallstatus",
    authMiddleware.protect,
    orderController.getAllOrderStatus
);
router.get(
    "/getallorder",
    authMiddleware.protect,
    authMiddleware.isAdmin,
    orderController.getAllOrder
);

module.exports = router;
