const Product = require("../models/productModels");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//add product
const addProduct = async (req, res) => {
    try {
        const info = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            sizes: JSON.parse(req.body.sizes),
            ingredients: JSON.parse(req.body.ingredients),
            popular: req.body.popular,
        };

        const image = req.file;

        //confirm data
        switch (true) {
            case !info.name:
                return res.status(400).json({
                    message: "Name are required",
                });
            case !info.price:
                return res.status(400).json({
                    message: "Price are required",
                });
            case !info.category:
                return res.status(400).json({
                    message: "Category are required",
                });
            case !image:
                return res.status(400).json({
                    message: "Image are required",
                });
        }
        //check for duplicate
        const name = info.name;
        const duplicate = await Product.findOne({ name })
            .select("-image")
            .lean()
            .exec();
        if (duplicate) {
            return res.status(409).json({
                message: "Product is already exist",
            });
        }
        const products = new Product({
            ...info,
        });

        if (image) {
            products.image.data = fs.readFileSync(image.path);
            products.image.contentType = image.mimetype;
        }

        await products.save();

        res.status(200).json({
            message: "Product has been added",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while adding product",
        });
    }
};

//get product
const getProduct = async (req, res) => {
    try {
        const products = await Product.find({})
            .select("-image")
            .populate("category")
            .sort("-createdAt");

        //confirm data
        if (!products) {
            return res.status(404).json({
                message: "Products not found",
            });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while getting Products",
        });
    }
};

//update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const info = {
            name: req.body.name,
            image: {
                data: req.file && fs.readFileSync(req.file.path),
                contentType: req.file && req.file.mimetype,
            },
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            sizes: JSON.parse(req.body.sizes),
            ingredients: JSON.parse(req.body.ingredients),
            popular: req.body.popular ? req.body.popular : false,
        };

        //check id if exist
        if (!id) {
            return res.status(400).json({
                message: "ID is required",
            });
        }

        const products = await Product.findByIdAndUpdate(
            id,
            {
                ...info,
            },
            { new: true }
        );

        if (!products) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        await products.save();
        res.status(200).send({
            message: `Product Updated Successfully`,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in updating product",
        });
    }
};

//delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "ID require",
            });
        }
        await Product.findByIdAndDelete(id);

        res.status(200).json({
            message: `Product  Deleted Sucessfully`,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while deleting product ",
        });
    }
};

//get image
const getImage = async (req, res) => {
    try {
        const id = req.params.pid;

        const image = await Product.findById(id).select("image");

        if (!image || image === "undefined" || null) {
            res.status(400).json({
                message: "No image Found",
            });
        }
        if (image.image.data) {
            res.set("Content-type", image.image.contentType);
            res.status(200).send(image.image.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in getting Image",
        });
    }
};

// upload file or image controller
const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, "./Images");
    },
    filename: (req, file, cd) => {
        cd(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage: storage,
}).single("image");

module.exports = {
    addProduct,
    getProduct,
    upload,
    deleteProduct,
    updateProduct,
    getImage,
};
