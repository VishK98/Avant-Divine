const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Add an item to the cart
const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
        data: {},
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({
      status: true,
      message: "Product added to cart",
      data: { cart },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      status: false,
      message: "Error adding to cart",
      data: { error: error.message },
    });
  }
};

// Get the cart for a user
const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price"
    );
    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Cart not found",
        data: {},
      });
    }

    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * item.productId.price;
    }, 0);

    res.status(200).json({
      status: true,
      message: "Cart fetched successfully",
      data: { cart, totalPrice },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      status: false,
      message: "Error fetching cart",
      data: { error: error.message },
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  const { userId, productId, action } = req.body; // action can be "increment" or "decrement"

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Cart not found",
        data: {},
      });
    }

    // Find the specific item in the cart
    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item) {
      return res.status(404).json({
        status: false,
        message: "Product not found in cart",
        data: {},
      });
    }

    // Increment or decrement the quantity
    if (action === "increment") {
      item.quantity += 1;
    } else if (action === "decrement") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        return res.status(400).json({
          status: false,
          message: "Cannot decrease quantity below 1",
          data: {},
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid action. Use 'increment' or 'decrement'.",
        data: {},
      });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      status: true,
      message: `Cart item quantity ${
        action === "increment" ? "increased" : "decreased"
      } successfully`,
      data: { cart },
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      status: false,
      message: "Error updating cart item",
      data: { error: error.message },
    });
  }
};

// Delete a cart item
const deleteCartItem = async (req, res) => {
  const { cartItemId } = req.params;

  try {
    const cart = await Cart.findOne({ "items._id": cartItemId });
    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Cart item not found",
        data: {},
      });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== cartItemId
    );
    await cart.save();

    res.status(200).json({
      status: true,
      message: "Cart item deleted successfully",
      data: { cart },
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({
      status: false,
      message: "Error deleting cart item",
      data: { error: error.message },
    });
  }
};

// Clear the entire cart for a user
const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Cart not found",
        data: {},
      });
    }

    res.status(200).json({
      status: true,
      message: "Cart cleared successfully",
      data: {},
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      status: false,
      message: "Error clearing cart",
      data: { error: error.message },
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
