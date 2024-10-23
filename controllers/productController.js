const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');

// CREATE a product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const images = req.files.map(file => file.path); // Get uploaded images
    
    const product = new Product({
      name,
      description,
      price,
      images,
      stock
    });
    
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// READ all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// READ single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// UPDATE a product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const images = req.files.map(file => file.path); // Get new uploaded images

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name,
      description,
      price,
      images, // Replace images with the new ones
      stock
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach(image => {
        const imagePath = path.join(__dirname, '..', 'uploads', image); 
        console.log(`Attempting to delete image at path: ${imagePath}`);

        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath); // Try deleting the image file
            console.log(`Deleted image: ${imagePath}`);
          } catch (err) {
            console.error(`Error deleting image at ${imagePath}:`, err);
            return res.status(500).json({ message: `Error deleting image at ${imagePath}`, error: err.message });
          }
        } else {
          console.log(`Image not found at path: ${imagePath}`);
        }
      });
    }
    // Remove the product from the database
    await Product.deleteOne({ _id: product._id }); 
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Server error during product deletion:', error); // Log the full error details
    res.status(500).json({ message: 'Server error', error: error.message }); // Send the actual error message back
  }
};