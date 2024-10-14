const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch (error) {
        next(error);
    }
};

exports.signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User not found"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong Credentials"));
        const token = jwt.sign({ id: validUser._id, role: validUser.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        //destructuring ng password para hindi makita kapag tinest sa backend
        const { password: pass, ...rest } = validUser._doc;
        res
            .cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure only in production
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Cross-origin settings
                maxAge: 24 * 60 * 60 * 1000, // Set cookie to expire in 1 day
            })
            .status(200)
            .json(rest);
    } catch (error) {
        next(error);
    }
};

exports.signOut = async (req, res, next) => {
    try {
        res.clearCookie("access_token");
        res.status(200).json("User has been logged out");
    } catch (error) {
        next(error);
    }
}

exports.google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = user._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() +
                    Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword,
                avatar: req.body.photo,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000,
                })
                .status(200)
                .json(rest)
        }
    } catch (error) {
        next(error);
    }

}