const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { upload } = require('../middleware/uploadMiddleware'); // Multer setup for uploading images
const { protect } = require('../middleware/authMiddleware');  // Authentication middleware
const { getFilteredProducts } = require('../controllers/getFilteredProducts');

const router = express.Router();

// Filtering route should be defined before any ID-based routes
router.get('/filterproducts', protect, getFilteredProducts); // Assuming you want to protect this route

// Create product (requires authentication and image upload)
router.post('/', protect, upload.array('images', 5), createProduct);

// Get all products
router.get('/', getProducts);

// Get a single product by ID
router.get('/:id', getProductById); // This should come after filterproducts

// Update a product (requires authentication and image upload)
router.put('/:id', protect, upload.array('images', 5), updateProduct);

// Delete a product (requires authentication)
router.delete('/:id', protect, deleteProduct);

module.exports = router;
