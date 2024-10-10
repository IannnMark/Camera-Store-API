const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});



const allowedOrigins = ['https://camera-store-client.vercel.app/'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));



app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);


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