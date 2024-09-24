const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    modelName: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    productCategory: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
        },
    ],
    stock: {
        type: Number,
        required: true,
        maxLength: [5, "Product stock cannot exceed 5 characters"],
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);