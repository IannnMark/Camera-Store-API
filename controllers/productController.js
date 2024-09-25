const Product = require("../models/product");
const errorHandler = require("../utils/error");


exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}