const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const errorHandler = require("../utils/error");


exports.newOrder = async (req, res, next) => {

    const { orderItems, paymentInfo, itemsPrice, totalPrice, screenShot, referenceNumber } = req.body;

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
            screenShot,
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

exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', ["username", "paymentInfo"]);

    try {
        if (!order) {
            return next(errorHandler(404, "No Order found with this ID"));
        }
        res.status(200).json({
            success: true,

            order,
        });
    } catch (error) {
        next(error);
    }
}