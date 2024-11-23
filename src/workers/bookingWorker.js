const { Worker } = require('bullmq');
const client = require('../config/redis-config');
const LocationService = require('../services/location-service');

const locationService=new LocationService();

const startBookingWorker = async(io) => {
    const bookingWorker = new Worker('bookingQueue', async (job) => {
        console.log("Processing Booking Job");
        console.log(`Job id ${job.id} \njob Name: ${job.name} \nJob Data: ${JSON.stringify(job.data)}`);
        // Booking Processing Logic
        const bookingData=job.data;
        const source=bookingData.source;
        
        //1. find near by drivers for the booking
        const nearbyDrivers=await locationService.getNearByDrivers(source.latitude,source.longitude);
        console.log(`Nearby Drivers ${nearbyDrivers}`);

        //2. Give notification to all the nearby Drivers
        const notifiedDriverIds = [];
        for (const driver of nearbyDrivers) {
            console.log('DIKH RHE SARE ',driver);
            const driverId = driver[0];
            const driverSocketId = await locationService.getUserSocketId(driverId,'driver'); 
            io.to(driverSocketId).emit('new-bookingNotification', JSON.stringify(bookingData));
            notifiedDriverIds.push(driverId);
            await locationService.storeNotifiedDriverIds(bookingData._id, notifiedDriverIds)
        }


    }, {
        connection: client
    });





    // Listen for completed jobs
    bookingWorker.on('completed', (job) => {
        console.log(`Job ${job.id} has been completed!`);
    });

    // Listen for failed jobs
    bookingWorker.on('failed', (job, err) => {
        console.error(`Job ${job.id} failed with error:`, err);
    });

    // Handle errors in the worker
    bookingWorker.on('error', (err) => {
        console.error('Worker error:', err);
    });
};


// function to start the worker
module.exports = startBookingWorker;
