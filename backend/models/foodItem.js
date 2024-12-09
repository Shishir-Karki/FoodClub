const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, default: ""},
    details: {type: String, default: ""},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    isVeg: {type: Boolean, required: true},
    imgUrl: {type: String, default: "https://static.wixstatic.com/media/91e241_475faa4fa56341f3878699dde5ab4904~mv2.jpg/v1/fill/w_666,h_444,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/91e241_475faa4fa56341f3878699dde5ab4904~mv2.jpg"},
    rating: {type: Number, default: 0},
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true},
    discount: {type: Number, default: 0},
    reviews:{
        type:[
            {
                user:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                rating: {type: Number, required: true},
                comment: {type: String, required: true}
            }
        ],
        default: [],
    },
    deliveryTime: {type: Number, required: true},
    availableQuantity: {type: Number, required: true},
}, {timestamps: true});



module.exports = mongoose.model("FoodItem", foodItemSchema);
