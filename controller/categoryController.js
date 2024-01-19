const Category = require("../models/categoryModel");

//add category
const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        //confirm name data
        if (!name) {
            return res.status(400).json({
                message: "Name is Required",
            });
        }

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(200).json({
                message: "Category already exist",
            });
        }
        //create new category
        await new Category({
            name,
        }).save();

        res.status(200).json({
            message: `Category has been added`,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in creating category",
        });
    }
};

// get Category
const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find({});

        //confirm categories data
        if (!categories) {
            return res.status(404).json({
                message: "Categories not found",
            });
        }

        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({
            message: "Error while getting Categoies",
        });
    }
};

//update category
const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        switch (true) {
            case !name:
                return res.status(400).json({
                    message: "Name are required",
                });
            case !id:
                return res.status(400).json({
                    message: "ID is required",
                });
        }
        //check for duplicate
        const duplicate = await Category.findOne({ name }).lean().exec();

        //allow updates to original category
        if (duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({
                message: "Duplicate Category",
            });
        }

        //update category
        await Category.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json({
            message: `Category ${name} Updated`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while Updating Category ",
        });
    }
};

// delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({
                message: "ID is required",
            });
        }

        const deletedCategory = await Category.findByIdAndRemove(id);

        res.status(200).send({
            message: `Category ${deletedCategory.name} has been deleted `,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while Deleting Category ",
        });
    }
};

module.exports = {
    addCategory,
    updateCategory,
    getAllCategory,
    deleteCategory,
};
