const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const cookieParser = require("cookie-parser");

dotenv.config();

mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB");
})
    .catch(err => {
        console.log(err);
    });

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server is listening on port 3000");

});

app.use("/api/auth", authRoutes);
app.user("/api/user", userRoutes);


//middleware to handle possible errors

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});