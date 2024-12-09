const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
    },
    username:{
        type: String,
        required: true,
        unique:true,

    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
    address:{
        type:String,
    },
    phone:{
        type:String,
    },
    role:{
        type:String,
        default: 'CUSTOMER',
        enum: ["CUSTOMER", "ADMIN","SUPERADMIN"]
    }
},
{timestamps: true}
);

const User = mongoose.model('User', userSchema);
module.exports = User;