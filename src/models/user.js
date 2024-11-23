const bcrypt=require('bcrypt');
const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required:[true,"Name can't be empty"]
    },
    email: {
        type: String,
        unique: true,
        required:[true,"Email can't be empty"]
    },
    password: {
        type: String,
        required:[true,"Password can't be empty"]
    },
    role: {
        type: String,
        enum: ['passenger','driver']
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'   
        },
        coordinates: {
            type: [Number],
            default: [0,0]
        }
    }
})

// this is pre save middleware(hook) that runs before a document is saved in db
userSchema.pre('save', async function encryptPass(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password,this.password);   
}


const User = mongoose.model('User',userSchema);
module.exports=User;
