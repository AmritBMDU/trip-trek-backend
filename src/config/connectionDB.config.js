const mongoose = require('mongoose');

const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error("❌ Database connection failed: ", error.message)
    }
}

// Handle MongoDB connection events


mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB Connected!");
});

mongoose.connection.on("disconnected", () => {
    console.log("⚠ MongoDB Disconnected! Reconnecting...");
});

mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB Reconnected!");
});

mongoose.connection.on("disconnecting", () => {
    console.log("⚠ MongoDB Disconnecting...");
});

mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
});

mongoose.connection.on("close", () => {
    console.log("🔴 MongoDB Connection Closed!");
});

mongoose.connection.on("fullsetup", () => {
    console.log("✅ MongoDB Replica Set is Fully Setup!");
});

mongoose.connection.on("all", () => {
    console.log("✅ All MongoDB Nodes Connected!");
});

mongoose.connection.on("reconnectFailed", () => {
    console.error("❌ MongoDB Reconnection Failed! Manual intervention needed.");
});


module.exports = connectionDB;