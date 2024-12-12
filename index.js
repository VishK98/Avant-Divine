// index.js (Backend Server - Node.js/Express)

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conversion rate constant
const EUR_TO_INR = 90;

// In-memory cart data (You can replace this with a database for persistent storage)
let cartItems = [];

// Calculate price in INR
const calculatePriceInINR = (priceInEUR, quantity = 1) => {
  return (priceInEUR * quantity * EUR_TO_INR).toFixed(2);
};

// Calculate cart subtotal
const calculateCartSubtotal = () => {
  return cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
};

// API Routes

// Get all cart items
app.get("/api/cart", (req, res) => {
  res.json(cartItems);
});

// Add item to cart or update quantity
app.post("/api/cart", (req, res) => {
  const { id, name, price, quantity } = req.body;

  // Check if the item already exists in the cart
  const existingItemIndex = cartItems.findIndex((item) => item.id === id);
  if (existingItemIndex !== -1) {
    // Update the quantity of the existing item
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    // Add the new item to the cart
    cartItems.push({ id, name, price, quantity });
  }

  res.status(200).json({ message: "Item added to cart", cartItems });
});

// Update item quantity in cart
app.put("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const itemIndex = cartItems.findIndex((item) => item.id === parseInt(id));
  if (itemIndex !== -1) {
    // Update the quantity of the item
    cartItems[itemIndex].quantity = Math.max(
      0,
      cartItems[itemIndex].quantity + quantity
    );
    if (cartItems[itemIndex].quantity === 0) {
      cartItems.splice(itemIndex, 1); // Remove the item if quantity becomes 0
    }
    res.json({ message: "Cart updated", cartItems });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Remove item from cart
app.delete("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  const itemIndex = cartItems.findIndex((item) => item.id === parseInt(id));
  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1); // Remove the item from the cart
    res.json({ message: "Item removed from cart", cartItems });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Get cart subtotal
app.get("/api/cart/subtotal", (req, res) => {
  const subtotal = calculateCartSubtotal();
  res.json({ subtotal });
});

// Get price of an item in INR
app.post("/api/cart/price", (req, res) => {
  const { priceInEUR, quantity } = req.body;
  const priceInINR = calculatePriceInINR(priceInEUR, quantity);
  res.json({ priceInINR });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
