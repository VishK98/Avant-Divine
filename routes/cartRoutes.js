const express = require("express");
const {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

// Add to cart
router.post("/add", addToCart);

// Get cart for a user
router.get("/user/:userId", getCart);

// Update cart item quantity
router.put("/update/:cartItemId", updateCartItem);

// Delete cart item
router.delete("/delete/:cartItemId", deleteCartItem);

// Clear entire cart for a user
router.delete("/clear/:userId", clearCart);

module.exports = router;
