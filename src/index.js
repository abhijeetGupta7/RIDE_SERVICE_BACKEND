const express = require('express');
const { serverConfig } = require("./config");
const apiRouter = require('./routes');
const { connecToDB } = require('./config/db-config');
const { connectToRedis } = require('./config/redis-config');
const cors = require("cors");
const { Server } = require('socket.io'); 
const http = require('http');
const startBookingWorker = require('./workers/bookingWorker');
const LocationService = require('./services/location-service');
const socketMiddleware = require('./middlewares/socket-middleware');
const locationService = new LocationService();

const app = express();

// Global Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());

// Socket.io Setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5501",
        methods: ['GET', 'POST', 'PATCH', 'PUT']
    }
});

// Socket Middleware - MUST come before routes to provide access to `io`
app.use(socketMiddleware(io));

// API Routes
app.use("/api", apiRouter);

// Example API endpoint
app.get("/api/ping", (req, res) => {
    return res.status(200).json({
        msg: "PONG"
    });
});

// Socket.io Connection Handling
io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('setUserSocketId', async (data) => {
        const socketData = JSON.parse(data); // Parse the JSON string back into an object
        // call the location service for setting the userId - socketId in redisCache
        await locationService.setUserSocketId(socketData.userId, socketData.role, socket.id);
        console.log("socketData: ", socketData);
    });
});

// Start Server
server.listen(serverConfig.PORT, async () => {
    console.log(`Server is listening at PORT ${serverConfig.PORT}`);
    await connecToDB();
    startBookingWorker(io);
});
