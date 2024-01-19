const express = require("express");
const categoryController = require("../controller/categoryController");

const router = express.Router();

router
    .route("/")
    .get(categoryController.getAllCategory)
    .post(categoryController.addCategory);

router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
