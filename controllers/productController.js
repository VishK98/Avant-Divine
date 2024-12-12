const Product = require("../models/productModel");

// Add a new product
const addProduct = async (req, res) => {
  try {
    // Get uploaded image paths
    const imagePaths = req.files.map((file) => file.path);

    // Extract product details from the request body
    const {
      name,
      description,
      sizes,
      colors,
      price,
      productInfo,
      shippingAndReturns,
    } = req.body;

    // Create a new product document
    const newProduct = new Product({
      name,
      description,
      images: imagePaths, // Store the uploaded image paths
      sizes: JSON.parse(sizes), // Convert sizes to an array
      colors: JSON.parse(colors), // Convert colors to an array
      price,
      productInfo: JSON.parse(productInfo), // Parse productInfo object
      shippingAndReturns,
    });

    // Save the new product to the database
    await newProduct.save();

    // Send success response
    res.status(201).json({
      message: "Product added successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedImages = req.files?.map((file) => file.path); // Map uploaded images

  try {
    // Include uploaded images if provided
    if (updatedImages?.length) {
      updatedData.images = updatedImages;
    }

    // Find the product by ID and update it
    const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// Get all images of a product by ID
const getProductImagesById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      images: product.images,
    });
  } catch (error) {
    console.error("Error fetching product images:", error);
    res.status(500).json({ message: "Error fetching product images", error: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductImagesById,
};
