const mongoose=require("mongoose");

const bookingSchema=new mongoose.Schema({
    passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "passengerId can't be null"],
        ref: 'User'
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'User'
    },
    source: {
        latitude: {
            type: String,
            required: [true, "can't be null"]
        },
        longitude: {
            type: String,
            required: [true, "can't be null"]
        }
    },
    destination: {
        latitude: {
            type: String,
            required: [true, "can't be null"]
        },
        longitude: {
            type: String,
            required: [true, "can't be null"]
        }
    },
    fare: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending','cancelled','confirmed','completed'],
        default: 'pending'
    },
    rating: {
        type: Number
    },
    feedback: {
        type: String
    } 
})

const Booking=mongoose.model('booking',bookingSchema);

module.exports=Booking;