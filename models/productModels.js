const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            data: Buffer,
            contentType: String,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        description: {
            type: String,
        },
        sizes: [
            {
                name: String,
                price: Number,
            },
        ],
        ingredients: [
            {
                name: String,
                price: Number,
            },
        ],

        popular: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);
