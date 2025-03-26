const mongoose = require('mongoose');
const slugify = require('slugify');

console.log('Initializing Product model...');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be a positive number'],
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    discountExpire: {
      type: Date,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    tags: [String],
    sku: {
      type: String,
      unique: true,
    },
    images: [
      {
        url: String,
        alt: String,
        isFeatured: {
          type: Boolean,
          default: false,
        },
      },
    ],
    videos: [
      {
        url: String,
        title: String,
      },
    ],
    inventory: {
      type: Number,
      required: [true, 'Please add inventory quantity'],
      min: [0, 'Inventory cannot be negative'],
      default: 0,
    },
    minPurchaseQuantity: {
      type: Number,
      default: 1,
    },
    maxPurchaseQuantity: {
      type: Number,
    },
    variants: [
      {
        name: String, // e.g., "Color", "Size", etc.
        options: [
          {
            value: String, // e.g., "Red", "XL", etc.
            additionalPrice: {
              type: Number,
              default: 0,
            },
            inventory: {
              type: Number,
              default: 0,
            },
            sku: String,
            images: [String],
          },
        ],
      },
    ],
    specifications: [
      {
        name: String,
        value: String,
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
      set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    shippingInfo: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      shippingFee: Number,
      estimatedDeliveryTime: String,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'outOfStock', 'discontinued'],
      default: 'active',
    },
    language: {
      type: String,
      enum: ['en', 'fa'],
      default: 'en',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create product slug from the name
ProductSchema.pre('save', function (next) {
  console.log(`Creating slug for product: ${this.name}`);
  this.slug = slugify(this.name, { lower: true });
  console.log(`Product slug created: ${this.slug}`);
  next();
});

// Generate SKU if not provided
ProductSchema.pre('save', function (next) {
  if (!this.sku) {
    console.log('Generating SKU for product...');
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.sku = `${this.category.toString().substring(0, 3)}-${randomStr}`;
    console.log(`SKU generated: ${this.sku}`);
  }
  next();
});

// Virtual for reviews
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

// Calculate and update average rating when saving
ProductSchema.methods.updateAverageRating = async function () {
  console.log(`Updating average rating for product: ${this._id}`);
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    {
      $match: { product: this._id },
    },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    this.ratingsAverage = stats[0].avgRating;
    this.ratingsQuantity = stats[0].numReviews;
    console.log(`Updated rating: ${this.ratingsAverage} (${this.ratingsQuantity} reviews)`);
  } else {
    this.ratingsAverage = 0;
    this.ratingsQuantity = 0;
    console.log('No reviews found, rating reset to 0');
  }

  await this.save({ validateBeforeSave: false });
};

console.log('Product model initialized');

module.exports = mongoose.model('Product', ProductSchema); 