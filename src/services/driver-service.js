const DriverRepository = require("../repositories/driver-repository");
const LocationService = require("./location-service");

class DriverService {
    #driverRepository
    constructor() {
        this.locationService=new LocationService();
        this.#driverRepository=new DriverRepository();
    }

    async getAllBookings(driverId) {
        try {
            const driver=await this.#driverRepository.getdriverById(driverId);
            if(!driver) {
                throw new Error("No driver exist for the given driver id");
            }
            const driverBookings=await this.#driverRepository.getAllBookings(driverId);
            return driverBookings;
        } catch (error) {
            throw error;
        }
    }

    
// FUTURE TODO:
// as of Now we are using api calls to update the driver Loction in Redis GeoDB as well as MongoDb,
// but in future, we can easily update the location in real time, using the webSocket
// here,as the passsenger and driver both are connected to the app, so say for driver, we will send the 
// current location from the frontend at some frequent intervals, along with the driverId, and then update it 
// in the redis GeoDB only, bcz mongoDB operations are costly and takes time, same can be done for the client also,
// in database, we can make updation at largeInterval or only at start and end of ride
async updateDriverLocation(data) {
        try {

            const driver=await this.#driverRepository.get(data.driverId);
            if(!driver) {
                throw new Error("No driver found dor the given Driver Id")
            } 
            
            // Update Driver Location in the Redis GEO DB
            await this.locationService.addDriverLocation(data.driverId, data.latitude, data.longitude);
            
            // Update Driver location in the Mongo DB
            const response=await this.#driverRepository.update(
                data.driverId,
                {
                    location: {
                        type: "Point",
                        coordinates: [parseFloat(data.latitude),parseFloat(data.longitude)] 
                    }
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

}
module.exports=DriverService;