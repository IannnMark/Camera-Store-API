const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const errorHandler = require("../utils/error");

exports.updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update you own account"))
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })
        const { password, ...rest } = updateUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }

}

//Delete own account
exports.deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account"));
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token');
        res.status(200).json("User has been deleted")
    } catch (error) {
        next(error);
    }
}

exports.allUsers = async (req, res, next) => {
    const users = await User.find({ isDeleted: false });
    res.status(200).json({
        success: true,
        users,
    });
}


//Delete user for admin
exports.eraseUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    try {
        if (!user) {
            return next(errorHandler(404, "User not found"))
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(error);
    }
}

exports.softDeleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            { isDeleted: true, deletedAt: Date() },
            { new: true }
        );
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        res.status(200).json("User archived successfully");
    } catch (error) {
        next(error);
    }
}

exports.restoreUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            { isDeleted: false, deletedAt: null },
            { new: true }
        );
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        res.status(200).json("User successfully restored");
    } catch (error) {
        next(error);
    }
}

exports.getAdminSoftDeletedUsers = async (req, res, next) => {
    const users = await User.find({ isDeleted: true });
    res.status(200).json({
        success: true,
        users,
    });
}