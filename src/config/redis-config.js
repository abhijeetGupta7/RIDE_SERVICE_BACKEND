const Redis = require("ioredis");
const { REDIS_URI } = require("./server-config");

const client = new Redis(REDIS_URI, {
    maxRetriesPerRequest: null,
});   

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.log("Error occurred while connecting to Redis: ", err);
});

module.exports=client;


