const mongoose = require("mongoose");

/**
 * Connect to MongoDB
 * This function handles the connection to the MongoDB database using Mongoose.
 * It's an async function because database connections are asynchronous operations.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    /**
     * process.exit(1)
     * We exit the process with a failure code (1) because the application
     * cannot function correctly without a database connection.
     */
    process.exit(1);
  }
};

module.exports = connectDB;
