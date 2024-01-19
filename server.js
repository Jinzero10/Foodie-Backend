require("dotenv").config();
const express = require("express");
const app = express();
const erroMiddleware = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const connectDB = require("./config/db");

const port = process.env.PORT || 8000;

connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//api/users
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/order", orderRoutes);

// static image folder
app.use("/Images", express.static("./Images"));

app.use(erroMiddleware.notFound);
app.use(erroMiddleware.errrorHandler);

app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

app.listen(port, () => {
    console.log(`server running...${port}`);
});
