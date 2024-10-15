const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    orderItems: [
        {
            modelName: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
            },
            regularPrice: {
                type: Number,
                min: 0,
            },
            discountPrice: {
                type: Number,
                min: 0,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product",
            },
        },
    ],

    paymentInfo: {
        type: String,
        required: true,
    },

    itemsPrice: {
        type: Number,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Pending",
    },
    screenShot: {
        type: Array,
    },
    referenceNumber: {
        type: String,
    },

    isDeleted: { type: Boolean, default: false },
    deleteAt: { type: Date, default: null },


}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema);