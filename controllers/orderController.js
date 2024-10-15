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



exports.myOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id });

        res.status(200).json({
            success: true,

            orders,
        })
    } catch (error) {
        next(error);
    }
}

exports.allOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate("user", ["username"]);

        let totalAmount = 0;

        orders.forEach((order) => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        })
    } catch (error) {
        next(error);
    }
}

exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        // Check if the order exists
        if (!order) {
            return next(errorHandler(404, "Order not found!"));
        }

        // Check if the order is already received
        if (order.orderStatus === "Received") {
            return next(errorHandler(400, "This order is already received"));
        }

        // Check the new status from the request body
        const newStatus = req.body.status;

        // If the new status is "Received", update stock for each order item
        if (newStatus === "Received") {
            await Promise.all(order.orderItems.map(async (item) => {
                console.log("Updating stock for product ID:", item.product);
                const product = await Product.findById(item.product);

                // Check if the product exists
                if (!product) {
                    console.warn(`Product with ID ${item.product} not found. Skipping stock update.`);
                    return; // Skip updating stock if the product is not found
                }

                // Update the stock
                product.stock = product.stock - item.quantity;
                await product.save({ validateBeforeSave: false });
            }));
        }

        // Update the order status
        order.orderStatus = newStatus;

        // Save the updated order
        const updatedOrder = await order.save();

        res.status(200).json({
            success: true,
            order: updatedOrder // Return the updated order details
        });

    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(errorHandler(404, "Order not found"));
    }

    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted");
    } catch (error) {
        next(error);
    }
}

exports.softDeleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findByIdAndUpdate(
            id,
            { isDeleted: true, deletedAt: Date() },
            { new: true }
        );

        if (!order) {
            return next(errorHandler(404, "Order not found"));
        }

        res.status(200).json("Order has been archived successfully");
    } catch (error) {
        next(error);
    }
}

exports.restoreOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findByIdAndUpdate(
            id,
            { isDeleted: false, deletedAt: null },
            { new: true }
        )

        if (!order) {
            return next(errorHandler(404, "Order not found"));
        }

        res.status(200).json("Order restored successfully");
    } catch (error) {
        next(error);
    }
}


exports.getAdminSoftDeletedOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ isDeleted: true }).populate("user", ["username"]);

        let totalAmount = 0;

        orders.forEach((order) => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        })
    } catch (error) {
        next(error);
    }
}
