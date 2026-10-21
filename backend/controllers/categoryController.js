const Category = require('../models/Category');
const Product = require('../models/Product');
const mongoose = require('mongoose');

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

// Public: Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories' });
  }
};

// Public: Get single category by slug
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (typeof slug !== 'string') {
      return res.status(400).json({ message: 'Invalid slug parameter' });
    }
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving category' });
  }
};

// Admin: Create category
const adminCreateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    let { slug } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (!slug || typeof slug !== 'string' || !slug.trim()) {
      slug = generateSlug(name);
    } else {
      slug = generateSlug(slug);
    }

    // Check if slug already exists; if so, append random suffix
    const existing = await Category.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const category = new Category({
      name: name.trim(),
      slug,
      image: typeof image === 'string' && image ? image : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category' });
  }
};

// Admin: Update category
const adminUpdateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const { name, image, slug: providedSlug } = req.body;
    const updateData = {};

    if (name && typeof name === 'string') updateData.name = name.trim();
    if (image !== undefined && typeof image === 'string') updateData.image = image;
    if (providedSlug && typeof providedSlug === 'string') {
      updateData.slug = generateSlug(providedSlug);
    } else if (name && typeof name === 'string') {
      updateData.slug = generateSlug(name);
    }

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category' });
  }
};

// Admin: Delete category
const adminDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    // Delete or remove category products if any
    await Product.deleteMany({ category: id });

    res.json({ message: 'Category and associated products removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category' });
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory
};
