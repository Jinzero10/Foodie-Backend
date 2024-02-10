const OrderStatus = require("../utils/orderStatus");
const Order = require("../models/orderModel");

//add order
const addOrder = async (req, res) => {
    try {
        const order = req.body;

        if (!order) {
            return res.status(400).json("Cart Is Empty!");
        }
        const newOrder = new Order({ ...order, user: req.id });
        await newOrder.save();
        res.status(200).json({
            message: `Order has been added`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while getting adding orders",
        });
    }
};
//get all order status
const getAllOrderStatus = async (req, res) => {
    try {
        const allStatus = Object.values(OrderStatus);

        res.status(200).send(allStatus);
    } catch (err) {
        res.status(500).json({
            message: "Error while getting Orders status",
        });
    }
};
//change order status
const changeOrderStatus = async (req, res) => {
    const { selectedItem, id } = req.body;

    try {
        const statuses = Object.values(OrderStatus).flatMap(Object.values);
        if (!statuses.includes(selectedItem)) {
            return res.status(400).json({ error: "Invalid status provided" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status: selectedItem },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({
            message: "Order status has been updated",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error while getting changing Orders status",
        });
    }
};
//get order for user
const getUserOrder = async (req, res) => {
    try {
        const order = await Order.find({ user: req.id })
            .select("-image")
            .sort("-createdAt");

        if (!order) {
            return res.status(400).json("No orders");
        }
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({
            message: "Error while getting orders",
        });
    }
};
//get all order for admin only
const getAllOrder = async (req, res) => {
    try {
        const allOrder = await Order.find({})
            .select("-image")
            .sort("-createdAt");

        if (!allOrder) {
            return res.status(400).json("No orders");
        }
        res.status(200).json({ allOrder });
    } catch (error) {
        res.status(500).json({
            message: "Error while getting orders",
        });
    }
};

// delete Order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(404).json({
                message: "Order ID is required",
            });
        }
        const order = await Order.findById(id).exec();

        if (!order) {
            return res.status(400).json({ message: "Order not Found" });
        }

        await order.deleteOne();

        res.status(200).json({
            message: "Order had been Deleted",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while Deleting Order ",
        });
    }
};
module.exports = {
    addOrder,
    getUserOrder,
    getAllOrder,
    deleteOrder,
    getAllOrderStatus,
    changeOrderStatus,
};
