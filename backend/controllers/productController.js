const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const generateSlug = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Public: Get all active products (with filters)
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, maxPrice, minPrice, limit } = req.query;
    
    let query = { isActive: true };
    
    if (category && typeof category === 'string') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          query.category = cat._id;
        } else {
          return res.json([]);
        }
      }
    }
    
    if (search && typeof search === 'string') {
      const sanitizedSearch = escapeRegex(search.trim());
      if (sanitizedSearch) {
        query.name = { $regex: sanitizedSearch, $options: 'i' };
      }
    }

    if (maxPrice || minPrice) {
      query.price = {};
      const numMax = Number(maxPrice);
      const numMin = Number(minPrice);
      if (!isNaN(numMax) && numMax >= 0) query.price.$lte = numMax;
      if (!isNaN(numMin) && numMin >= 0) query.price.$gte = numMin;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    let queryExec = Product.find(query).populate('category', 'name slug image').sort(sortOption);

    if (limit && !isNaN(Number(limit))) {
      const parsedLimit = Math.min(Math.max(1, Number(limit)), 100); // capped between 1 and 100
      queryExec = queryExec.limit(parsedLimit);
    }

    const products = await queryExec;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

// Public: Get product by slug
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (typeof slug !== 'string') {
      return res.status(400).json({ message: 'Invalid product slug' });
    }
    const product = await Product.findOne({ slug, isActive: true }).populate('category', 'name slug image');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product' });
  }
};

// Admin: Get all products
const adminGetProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name slug image').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving admin products' });
  }
};

// Admin: Create product
const adminCreateProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (!productData.name || typeof productData.name !== 'string') {
      return res.status(400).json({ message: 'Product name is required' });
    }

    if (!productData.slug || !productData.slug.trim()) {
      productData.slug = generateSlug(productData.name);
    } else {
      productData.slug = generateSlug(productData.slug);
    }

    // Check slug collision
    const existing = await Product.findOne({ slug: productData.slug });
    if (existing) {
      productData.slug = `${productData.slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const product = new Product(productData);
    const createdProduct = await product.save();
    const populated = await Product.findById(createdProduct._id).populate('category', 'name slug image');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// Admin: Update product
const adminUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const updateData = { ...req.body };
    if (updateData.name && !updateData.slug) {
      updateData.slug = generateSlug(updateData.name);
    } else if (updateData.slug) {
      updateData.slug = generateSlug(updateData.slug);
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true }).populate('category', 'name slug image');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// Admin: Delete product
const adminDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
};
