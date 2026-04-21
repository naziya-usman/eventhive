/**
 * Load Environment Variables
 * We call this at the very top to ensure that all subsequent imports
 * and code have access to the variables defined in our .env file.
 */
require("dotenv").config();

/**
 * Import Dependencies
 * express: The web framework used to build our API.
 * cors: Middleware to enable Cross-Origin Resource Sharing, allowing our frontend to talk to this server.
 */
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

/**
 * Initialize Express Application
 * This 'app' object will be used to configure routes and middleware.
 */
const app = express();

/**
 * Global Middleware
 * cors(): Allows requests from different origins (essential for frontend-backend communication).
 * express.json(): Parses incoming JSON requests, making the data available in req.body.
 */
app.use(cors());
app.use(express.json());

/**
 * Connect to Database
 * We establish the database connection before starting the server to ensure
 * the app is ready to handle requests.
 */
connectDB();

/**
 * Health Check Route
 * A simple endpoint to verify that the server is running and responsive.
 * It returns the current server time to help debug time-sync issues.
 */
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        time: new Date()
    });
});

/**
 * Start Server
 * The server listens on a port defined in environment variables or defaults to 5000.
 * This separation allows for flexible deployment configurations.
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
