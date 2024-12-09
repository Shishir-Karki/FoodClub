const express = require("express");
const router = express.Router();
const { getFoodItems, getFoodItemById, addFoodItem, updateFoodItem, deleteFoodItem } = require("../controllers/food");
const giveAccess = require("../middlewares/giveAccess");
const auth = require("../middlewares/auth");

router.get("/", getFoodItems);
router.get("/:id", getFoodItemById);

// Fix the middleware chain
router.post("/", 
    auth,
    giveAccess(["ADMIN", "SUPERADMIN"]),
    addFoodItem
);

router.put("/:id", 
    auth,
    giveAccess(["ADMIN", "SUPERADMIN"]),
    updateFoodItem
);

router.delete("/:id", 
    auth,
    giveAccess(["ADMIN", "SUPERADMIN"]),
    deleteFoodItem
);

module.exports = router;