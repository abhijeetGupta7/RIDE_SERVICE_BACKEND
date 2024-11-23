const client = require("../config/redis-config");

class LocationService {
    constructor() {
        this.redisClient=client;
    }

    // storing userId - socketId as     driver:123 - socketId1,   passenger:432 - socketId2
    async setUserSocketId(userId, role, socketId) {
        console.log(`${role}:${userId} , ${socketId}`)
        await this.redisClient.set(`${role}:${userId}` , socketId);
    }

    async getUserSocketId(userId,role) {
        try {
            const s= await this.redisClient.get(`${role}:${userId}`);
            return s;
        } catch (error) {
            console.log("Cannot get from redis", error);
        }
    }

    async addDriverLocation(driverId, latitude, longitude) {
        try {
           return await this.redisClient.geoadd('drivers', longitude, latitude, driverId);
        } catch (error) {
          console.log("Cannot add to redis", error);
        }
    }

    async getNearByDrivers(latitude,longitude) {
        console.log(latitude, longitude);
        const nearbyDrivers = await this.redisClient.georadius(
            'drivers',
            longitude, 
            latitude,
            "5",        // 5 km
            'km', 
            'WITHCOORD'
        );
        return nearbyDrivers;
    }


    async storeNotifiedDriverIds(bookingId, driverIds) {
        try {
            await this.redisClient.sadd(`notifiedDrivers:${bookingId}`, ...driverIds);
            console.log(`Added drivers ${driverIds.join(', ')} to the set for booking ${bookingId}`);
        } catch (error) {
            console.error(`Failed to add drivers to booking ${bookingId}:`, error);
        }
    }

    
    async getNotifiedDriverIds(bookingId) {
        try {
            // Fetch all driver IDs for the specified booking from the Redis set
            const driverIds = await this.redisClient.smembers(`notifiedDrivers:${bookingId}`);    
            console.log(`Fetched notified driver IDs for booking ${bookingId}: ${driverIds.join(', ')}`);
            return driverIds; 
        } catch (error) {
            console.error(`Error fetching notified driver IDs for booking ${bookingId}:`, error);
            return []; 
        }
    }
    
}

module.exports=LocationService;