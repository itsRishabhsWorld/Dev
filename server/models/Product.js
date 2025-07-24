const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  genericName: {
    type: String,
    required: [true, 'Generic name is required'],
    trim: true
  },
  brandName: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Antibiotics',
      'Analgesics',
      'Antacids',
      'Antihistamines',
      'Cardiovascular',
      'Diabetes',
      'Respiratory',
      'Dermatology',
      'Neurology',
      'Oncology',
      'Pediatrics',
      'Vitamins & Supplements',
      'Other'
    ]
  },
  dosageForm: {
    type: String,
    required: [true, 'Dosage form is required'],
    enum: [
      'Tablet',
      'Capsule',
      'Syrup',
      'Injection',
      'Cream',
      'Ointment',
      'Drops',
      'Inhaler',
      'Patch',
      'Other'
    ]
  },
  strength: {
    type: String,
    required: [true, 'Strength is required'],
    trim: true
  },
  packSize: {
    type: String,
    required: [true, 'Pack size is required'],
    trim: true
  },
  batchNumber: {
    type: String,
    required: [true, 'Batch number is required'],
    unique: true,
    trim: true
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  manufacturingDate: {
    type: Date,
    required: [true, 'Manufacturing date is required'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'Manufacturing date cannot be in the future'
    }
  },
  price: {
    mrp: {
      type: Number,
      required: [true, 'MRP is required'],
      min: [0, 'MRP cannot be negative']
    },
    costPrice: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: [0, 'Cost price cannot be negative']
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative']
    }
  },
  stock: {
    quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0
    },
    minStockLevel: {
      type: Number,
      required: [true, 'Minimum stock level is required'],
      min: [0, 'Minimum stock level cannot be negative'],
      default: 10
    },
    unit: {
      type: String,
      required: [true, 'Stock unit is required'],
      enum: ['Pieces', 'Bottles', 'Boxes', 'Strips', 'Vials'],
      default: 'Pieces'
    }
  },
  supplier: {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true
    },
    contact: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  sideEffects: [{
    type: String,
    trim: true
  }],
  contraindications: [{
    type: String,
    trim: true
  }],
  storage: {
    temperature: String,
    conditions: String
  },
  prescriptionRequired: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Discontinued'],
    default: 'Active'
  },
  images: [{
    type: String // URLs to product images
  }],
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 1 });
productSchema.index({ genericName: 1 });
productSchema.index({ category: 1 });
productSchema.index({ batchNumber: 1 });
productSchema.index({ expiryDate: 1 });
productSchema.index({ 'stock.quantity': 1 });

// Virtual for checking if product is expired
productSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Virtual for checking if stock is low
productSchema.virtual('isLowStock').get(function() {
  return this.stock.quantity <= this.stock.minStockLevel;
});

// Pre-save middleware to update the updatedBy field
productSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedBy = this.createdBy; // This should be set from the controller
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);