const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductImagesById, // Add this function
} = require("../controllers/productController"); // Ensure this points to the correct path

const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

// Add product with image upload
router.post("/add", upload.array("images", 5), addProduct);

// Get all products
router.get("/all", getAllProducts);

// Get product by ID
router.get("/:id", getProductById);

// Update product
router.put("/update/:id", upload.array("images", 5), updateProduct);

// Delete product
router.delete("/delete/:id", deleteProduct);

// Get images of a product by ID
router.get("/products/:id/images", getProductImagesById); // Use the imported function directly

module.exports = router;
