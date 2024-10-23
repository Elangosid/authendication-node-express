const Product = require('../models/productModel');

// GET products with filtering
exports.getFilteredProducts = async (req, res) => {
  try {
    // Extract query parameters
    const { name, createdBefore, createdAfter, inStock } = req.query;

    // Create a filter object to build the query dynamically
    const filter = {};

    // Filter by name (case-insensitive, partial match)
    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // 'i' makes the search case-insensitive
    }

    // Filter by created date (before or after a certain date)
    if (createdBefore) {
      filter.createdAt = { ...filter.createdAt, $lte: new Date(createdBefore) }; // Products created before the date
    }
    if (createdAfter) {
      filter.createdAt = { ...filter.createdAt, $gte: new Date(createdAfter) }; // Products created after the date
    }

    // Filter by stock availability (inStock flag)
    if (inStock !== undefined) {
      filter.stock = inStock === 'true' ? { $gt: 0 } : { $eq: 0 }; // inStock=true means stock > 0
    }

    // Fetch the filtered products from the database
    const products = await Product.find(filter).exec();

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products with filters:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
