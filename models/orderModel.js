const mongoose = require("mongoose");

const Product = require("../models/productModels");
const { OrderStatus } = require("../utils/orderStatus");
const { Schema } = mongoose;

const OrderItemSchema = new Schema(
    {
        food: { type: Product.schema, required: true },
        quantity: { type: Number, required: true },
        size: {
            name: String,
            price: Number,
        },
        extras: [
            {
                name: String,
                price: Number,
            },
        ],
        price: {
            type: Number,
            required: true,
        },
    },
    {
        _id: false,
    }
);

// OrderItemSchema.pre("validate", function (next) {
//     this.price = this.food.price * this.quantity;
//     next();
// });

const orderSchema = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phoneNumber: { type: Number, required: true },
        zipcode: {
            type: Number,
            required: true,
        },
        items: { type: [OrderItemSchema], required: true },
        totalPrice: { type: Number, required: true },
        totalQuantity: { type: Number, required: true },
        delivery: { type: String, required: true },
        status: {
            type: String,
            default: OrderStatus.PENDING,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);
