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

exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(errorHandler(404, "Product not found"));
    }

    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");
    } catch (error) {
        next(error);
    }
}

exports.updateProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(errorHandler(404, "Product not found!"));
    }

    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updateProduct);
    } catch (error) {
        next(error);
    }
}

exports.getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,

            products,
        });
    } catch (error) {
        next(error);
    }
}

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

exports.getProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === "false") {
            offer = { $in: [false, true] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || "createdAt";
        const order = req.query.order || "desc";

        const products = await Recipe.find({
            modelName: { $regex: searchTerm, $options: 'i' },
            brand: { $regex: searchTerm, $options: 'i' },
            offer,
        }).sort(
            { [sort]: order }
        ).limit(limit).skip(startIndex);

        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}