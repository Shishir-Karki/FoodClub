const FoodItem = require("../models/foodItem");


const filterData = (food, params) => {
    const { searchString = "", rating = 0, maxprice = 1000000, discount, category, isVeg = false } = params;
    return food.filter((item) => {
        return (
            item.name.toLowerCase().includes(searchString.toLowerCase()) ||
            item.category.toLowerCase().includes(searchString.toLowerCase()) ||
            item.restaurantId.toLowerCase().includes(searchString.toLowerCase())
        ) &&
            item.maxprice <= parseInt(maxprice) &&
            item.rating >= parseInt(rating) &&
            item.discount >= parseInt(discount) &&
            (!Boolean(isVeg) ? true : Boolean(item.isVeg)) &&
            item.category === category
    })
}



// exports.getAllFoodItems = async (req, res) => {

//     FoodItem.find({})
//         .then((food) => {
//             const data = filterData(food, req.params);

//             res.send({
//                 status: "success",
//                 food: data
//             });
//         })
//         .catch((err) => {
//             res.send({
//                 message: "Food item not found",
//                 error: err.message
//             });
//         })
// }

exports.getFoodItems = async (req, res) => {
    try {
        const foodItems = await FoodItem.find({});
        res.status(200).json({
            status: "success",
            food: foodItems
        });
    } catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).json({
            status: "failed",
            message: "Error fetching food items",
            error: error.message
        });
    }
};

exports.getFoodItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const foodItem = id 
            ? await FoodItem.findById(id)
            : await FoodItem.find({}); // If no ID, return all items
        
        if (!foodItem) {
            return res.status(404).json({
                status: "failed",
                message: "Food item not found"
            });
        }

        res.status(200).json({
            status: "success",
            food: foodItem
        });
    } catch (error) {
        console.error('Error fetching food item:', error);
        res.status(500).json({
            status: "failed",
            message: "Error fetching food item",
            error: error.message
        });
    }
    const { restaurantId = null } = req.params;
    if (restaurantId) {
        FoodItem.find({ restaurantId })
            .then((food) => {
                const data = filterData(food, req.params);
                return res.send({
                    status: "success",
                    food: data
                });
            })
            .catch((err) => {
                return res.send({
                    message: "Food item not found",
                    error: err.message
                });
            })
    } else {

        FoodItem.find({ restaurantId })
            .then((food) => {
                const data = filterData(food, req.params);
                res.send({
                    status: "success",
                    food: data
                });

            })
            .catch((err) => {
                res.send({
                    message: "Food item not found",
                    error: err.message
                });
            })
    }
}

exports.addFoodItem = async (req, res) => {
    try {
        const { name, price, discount, category, isVeg, availableQuantity, deliveryTime, imgUrl } = req.body;
        
        // Log the incoming request data and user info
        console.log('Request body:', req.body);
        console.log('User from token:', req.user);
        
        const restaurantId = req.user._id; // This should now match the token's userId
        
        const foodItem = new FoodItem({ 
            name, 
            price, 
            discount, 
            category, 
            isVeg, 
            availableQuantity, 
            deliveryTime, 
            imgUrl, 
            restaurantId
        });

        const savedFood = await FoodItem.create(foodItem);
        
        res.status(200).json({
            status: "success",
            message: "Food item added successfully",
            food: savedFood
        });
    } catch (err) {
        console.error('Add food item error:', err);
        res.status(500).json({
            status: "failed",
            message: "Food item not added",
            error: err.message
        });
    }
}


exports.updateFoodItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const updatedFood = await FoodItem.findByIdAndUpdate(
            id, 
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedFood) {
            return res.status(404).json({
                status: "failed",
                message: "Food item not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Food item updated successfully",
            food: updatedFood
        });
    } catch (error) {
        console.error('Update food item error:', error);
        res.status(500).json({
            status: "failed",
            message: "Food item not updated",
            error: error.message
        });
    }
};

exports.deleteFoodItem = async(req, res)=>{
    const {id} = req.params;
    FoodItem.findByIdAndDelete(id)
    .then((food)=>{
        res.send({
            status: "success",
            food: food
        });
    })
    .catch((err)=>{
        res.send({
            message: "Food item not deleted",
            error: err.message
        });
    })
}

