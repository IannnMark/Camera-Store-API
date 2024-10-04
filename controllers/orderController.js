const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");


exports.newOrder = async (req, res, next) => {

    const { orderItems, paymentInfo, itemsPrice, totalPrice, screenshot, referenceNumber } = req.body;

    if (!orderItems || !paymentInfo || !itemsPrice || !totalPrice) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields",
        });
    }

    try {
        const order = await Order.create({
            orderItems,
            paymentInfo,
            itemsPrice,
            totalPrice,
            screenshot,
            referenceNumber,
            user: req.user.id,
        })
        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
}