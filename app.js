const express = require('express');
const app = express();

// dotenv config
const dotenv = require('dotenv');
dotenv.config({});
const PORT = process.env.PORT || 3001;

// cors config
const cors = require('cors');
app.use(cors());

// Database Connect
const connectionDB = require('./src/config/connectionDB.config');
connectionDB()

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup APIs
const packageRouter = require('./src/routes/package.route');
const leadRouter = require('./src/routes/lead.route');
app.use('/api/v1/tt',packageRouter);
app.use('/api/v1/tt',leadRouter)

app.listen(PORT, (error) => {
    if (error) {
        console.log("❌ Error in stablish server: ", error);
    } else {
        console.log(`✅ Server is running on ${PORT} port number`);
    }
});
