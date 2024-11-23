// to attach the io object in the request object
const socketMiddleware = (io) => (req, res, next) => {
    req.io = io; // Attach the io instance to the request object
    next(); 
};

module.exports = socketMiddleware;
