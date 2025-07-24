const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Private
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('status').optional().isIn(['Active', 'Inactive', 'Discontinued']).withMessage('Invalid status'),
  query('lowStock').optional().isBoolean().withMessage('Low stock must be boolean'),
  query('expired').optional().isBoolean().withMessage('Expired must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      lowStock,
      expired
    } = req.query;

    // Build filter object
    let filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { brandName: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { batchNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;

    // Handle special filters
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$stock.quantity', '$stock.minStockLevel'] };
    }

    if (expired === 'true') {
      filter.expiryDate = { $lt: new Date() };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email'),
      Product.countDocuments(filter)
    ]);

    // Add virtual fields
    const productsWithVirtuals = products.map(product => {
      const productObj = product.toObject({ virtuals: true });
      return productObj;
    });

    res.json({
      products: productsWithVirtuals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// @route   GET /api/products/stats
// @desc    Get product statistics
// @access  Private
router.get('/stats', authenticate, async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      expiredProducts,
      categoriesStats
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'Active' }),
      Product.countDocuments({ $expr: { $lte: ['$stock.quantity', '$stock.minStockLevel'] } }),
      Product.countDocuments({ expiryDate: { $lt: new Date() } }),
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      totalProducts,
      activeProducts,
      lowStockProducts,
      expiredProducts,
      categoriesStats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productWithVirtuals = product.toObject({ virtuals: true });
    res.json(productWithVirtuals);

  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (pharmacist, manager, admin)
router.post('/', authenticate, authorize('pharmacist', 'manager', 'admin'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
  body('genericName').trim().isLength({ min: 2 }).withMessage('Generic name must be at least 2 characters'),
  body('manufacturer').trim().isLength({ min: 2 }).withMessage('Manufacturer must be at least 2 characters'),
  body('category').isIn([
    'Antibiotics', 'Analgesics', 'Antacids', 'Antihistamines', 'Cardiovascular',
    'Diabetes', 'Respiratory', 'Dermatology', 'Neurology', 'Oncology',
    'Pediatrics', 'Vitamins & Supplements', 'Other'
  ]).withMessage('Invalid category'),
  body('dosageForm').isIn([
    'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream',
    'Ointment', 'Drops', 'Inhaler', 'Patch', 'Other'
  ]).withMessage('Invalid dosage form'),
  body('strength').trim().isLength({ min: 1 }).withMessage('Strength is required'),
  body('packSize').trim().isLength({ min: 1 }).withMessage('Pack size is required'),
  body('batchNumber').trim().isLength({ min: 1 }).withMessage('Batch number is required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('manufacturingDate').isISO8601().withMessage('Valid manufacturing date is required'),
  body('price.mrp').isFloat({ min: 0 }).withMessage('MRP must be a positive number'),
  body('price.costPrice').isFloat({ min: 0 }).withMessage('Cost price must be a positive number'),
  body('price.sellingPrice').isFloat({ min: 0 }).withMessage('Selling price must be a positive number'),
  body('stock.quantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  body('stock.minStockLevel').isInt({ min: 0 }).withMessage('Minimum stock level must be a non-negative integer'),
  body('supplier.name').trim().isLength({ min: 2 }).withMessage('Supplier name must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    // Check if batch number already exists
    const existingProduct = await Product.findOne({ batchNumber: req.body.batchNumber });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this batch number already exists' });
    }

    // Validate dates
    const expiryDate = new Date(req.body.expiryDate);
    const manufacturingDate = new Date(req.body.manufacturingDate);
    
    if (expiryDate <= manufacturingDate) {
      return res.status(400).json({ message: 'Expiry date must be after manufacturing date' });
    }

    const product = new Product({
      ...req.body,
      createdBy: req.user._id
    });

    await product.save();
    
    const populatedProduct = await Product.findById(product._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Product created successfully',
      product: populatedProduct.toObject({ virtuals: true })
    });

  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product with this batch number already exists' });
    }
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (pharmacist, manager, admin)
router.put('/:id', authenticate, authorize('pharmacist', 'manager', 'admin'), [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
  body('price.mrp').optional().isFloat({ min: 0 }).withMessage('MRP must be a positive number'),
  body('price.costPrice').optional().isFloat({ min: 0 }).withMessage('Cost price must be a positive number'),
  body('price.sellingPrice').optional().isFloat({ min: 0 }).withMessage('Selling price must be a positive number'),
  body('stock.quantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key === 'price' || key === 'stock' || key === 'supplier' || key === 'storage') {
        product[key] = { ...product[key], ...req.body[key] };
      } else {
        product[key] = req.body[key];
      }
    });

    product.updatedBy = req.user._id;
    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct.toObject({ virtuals: true })
    });

  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (manager, admin)
router.delete('/:id', authenticate, authorize('manager', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// @route   POST /api/products/:id/update-stock
// @desc    Update product stock
// @access  Private (pharmacist, manager, admin)
router.post('/:id/update-stock', authenticate, authorize('pharmacist', 'manager', 'admin'), [
  body('quantity').isInt().withMessage('Quantity must be an integer'),
  body('operation').isIn(['add', 'subtract', 'set']).withMessage('Operation must be add, subtract, or set')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { quantity, operation } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let newQuantity;
    switch (operation) {
      case 'add':
        newQuantity = product.stock.quantity + quantity;
        break;
      case 'subtract':
        newQuantity = product.stock.quantity - quantity;
        break;
      case 'set':
        newQuantity = quantity;
        break;
    }

    if (newQuantity < 0) {
      return res.status(400).json({ message: 'Stock quantity cannot be negative' });
    }

    product.stock.quantity = newQuantity;
    product.updatedBy = req.user._id;
    await product.save();

    res.json({
      message: 'Stock updated successfully',
      product: product.toObject({ virtuals: true })
    });

  } catch (error) {
    console.error('Update stock error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error while updating stock' });
  }
});

module.exports = router;