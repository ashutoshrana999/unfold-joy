const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Admin = require('./models/Admin');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // 1. Create Admin
    await Admin.deleteMany();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    await Admin.create({
      name: 'Admin',
      email: 'admin@unfoldjoy.com',
      passwordHash
    });
    console.log('Admin seeded (admin@unfoldjoy.com / admin123).');

    // Clear existing products and categories
    await Category.deleteMany();
    await Product.deleteMany();

    // 2. Create Categories
    const categoryData = [
      { name: 'Teddy Bears', slug: 'teddy-bears', image: 'https://images.unsplash.com/photo-1570458462283-718e8d89e92d?auto=format&fit=crop&q=80&w=800' },
      { name: 'Earrings', slug: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800' },
      { name: 'Rings', slug: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b8e32e?auto=format&fit=crop&q=80&w=800' },
      { name: 'Bracelets', slug: 'bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
      { name: 'Gift Box', slug: 'gift-box', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800' },
      { name: 'Neckpieces', slug: 'neckpieces', image: 'https://images.unsplash.com/photo-1599643478514-4a1208922bf6?auto=format&fit=crop&q=80&w=800' },
      { name: 'Anklets', slug: 'anklets', image: 'https://images.unsplash.com/photo-1629851614745-0951a3194a28?auto=format&fit=crop&q=80&w=800' },
      { name: 'Hair Accessories', slug: 'hair-accessories', image: 'https://images.unsplash.com/photo-1596443425406-8b0de29f2736?auto=format&fit=crop&q=80&w=800' }
    ];

    const categories = await Category.insertMany(categoryData);
    console.log('Categories seeded.');

    const productsToSeed = [];

    const getPrice = (i) => {
      if (i === 1) return 89;
      if (i === 2) return 99;
      if (i === 3) return 149;
      if (i === 4) return 199;
      return 299 + (i * 20);
    };

    const keywordMap = {
      'teddy-bears': 'teddybear',
      'earrings': 'earrings',
      'rings': 'rings,jewelry',
      'bracelets': 'bracelet',
      'gift-box': 'giftbox',
      'neckpieces': 'necklace',
      'anklets': 'anklet',
      'hair-accessories': 'hair,accessory'
    };

    // Helper to generate 10 products
    const generateProducts = (catName, catSlug, catId) => {
      const keyword = keywordMap[catSlug] || catSlug;
      for (let i = 1; i <= 10; i++) {
        const uniqueImage = `https://loremflickr.com/800/800/${keyword}?lock=${i}`;
        productsToSeed.push({
          name: `Premium ${catName} Style ${i}`,
          slug: `${catSlug}-style-${i}`,
          description: `Beautiful and elegant ${catName.toLowerCase()} crafted to bring joy. Perfect for gifting or treating yourself.`,
          category: catId,
          price: getPrice(i),
          images: [uniqueImage],
          stock: 20 + i,
          isFeatured: i <= 2
        });
      }
    };

    // Generate products for all 8 categories
    categoryData.forEach(cd => {
      const cat = categories.find(c => c.slug === cd.slug);
      generateProducts(cd.name, cd.slug, cat._id);
    });

    await Product.insertMany(productsToSeed);
    console.log(`${productsToSeed.length} Products seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
