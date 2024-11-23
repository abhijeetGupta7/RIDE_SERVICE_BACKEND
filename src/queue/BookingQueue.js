const { Queue } = require('bullmq');
const client = require('../config/redis-config');

const bookingQueue=new Queue('bookingQueue', {
    connection: client
});

async function addBookingJobtoQueue(payload) {
    try {
        await bookingQueue.add('new-booking', payload, {
          attempts: 3, // Retry the job 3 times if it fails
          backoff: 5000, // Wait for 5 seconds before retrying
        });
        console.log('Booking Job added to the queue');
      } catch (error) {
        console.error('Failed to add Booking job to queue', error);
    }
} 

module.exports=addBookingJobtoQueue;