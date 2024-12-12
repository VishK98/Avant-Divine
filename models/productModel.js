const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  colors: [{ type: String }], 
  price: { type: Number, required: true },
  
  productInfo: {
    material: { type: String, required: true },
    weight: { type: String, required: true },
    countryOfOrigin: { type: String, required: true },
    dimensions: { type: String, required: true },
    type: { type: String, required: true },
  },
  
  shippingAndReturns: { type: String }, 
}, { timestamps: true }); 

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
