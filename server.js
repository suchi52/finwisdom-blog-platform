require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const authenticateToken = require("./middleware/authenticateToken");
const categoryRoutes =
    require("./routes/categoryRoutes");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
// Database connection
const db = require("./db");

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to FinWisdom API"
    });
});

// Test database
app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1 AS test", (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "FinWisdom database is working",
            result
        });
    });
});

app.get("/api/protected", authenticateToken, (req, res) => {

    res.json({
        message: "You have access to this protected route",
        user: req.user
    });

});

app.listen(PORT, () => {
    console.log(`FinWisdom server running on http://localhost:${PORT}`);
});