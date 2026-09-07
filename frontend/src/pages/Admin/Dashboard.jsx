import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Products State
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');

  // Product Form State
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productStock, setProductStock] = useState('10');
  const [productCategory, setProductCategory] = useState('');
  const [productLoading, setProductLoading] = useState(false);
  const [productMessage, setProductMessage] = useState('');

  // Create Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catLoading, setCatLoading] = useState(false);
  const [catMessage, setCatMessage] = useState('');

  // Edit Product Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Edit Category Modal State
  const [showEditCatModal, setShowEditCatModal] = useState(false);
  const [editCatForm, setEditCatForm] = useState(null);
  const [editCatLoading, setEditCatLoading] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
      if (res.data.length > 0 && !productCategory) {
        setProductCategory(res.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoadingCats(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/admin/products', getAuthHeader());
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCatLoading(true);
    setCatMessage('');

    try {
      const payload = {
        name: catName,
        slug: generateSlug(catName),
        image: catImage
      };
      
      const res = await axios.post('/api/admin/categories', payload, getAuthHeader());
      
      setCatMessage({ type: 'success', text: 'Category created successfully!' });
      setCatName('');
      setCatImage('');
      setShowCatModal(false);
      
      // Refresh categories and select the new one
      await fetchCategories();
      setProductCategory(res.data._id);
    } catch (error) {
      setCatMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create category' });
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? This might affect products under it.')) return;
    try {
      await axios.delete(`/api/admin/categories/${id}`, getAuthHeader());
      setCategories(categories.filter(c => c._id !== id));
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const openEditCatModal = (category) => {
    setEditCatForm(category);
    setShowEditCatModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setEditCatLoading(true);
    try {
      const payload = {
        name: editCatForm.name,
        slug: generateSlug(editCatForm.name),
        image: editCatForm.image
      };

      await axios.put(`/api/admin/categories/${editCatForm._id}`, payload, getAuthHeader());
      setShowEditCatModal(false);
      fetchCategories();
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update category');
    } finally {
      setEditCatLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    setProductMessage('');

    try {
      const payload = {
        name: productName,
        slug: generateSlug(productName),
        description: productDescription,
        price: Number(productPrice),
        stock: Number(productStock),
        category: productCategory,
        images: productImage ? [productImage] : []
      };

      await axios.post('/api/admin/products', payload, getAuthHeader());
      
      setProductMessage({ type: 'success', text: 'Product created successfully!' });
      
      // Reset form
      setProductName('');
      setProductPrice('');
      setProductDescription('');
      setProductImage('');
      setProductStock('10');
      
      setTimeout(() => setProductMessage(''), 3000);
      fetchProducts();
    } catch (error) {
      setProductMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create product' });
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/admin/products/${id}`, getAuthHeader());
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const openEditModal = (product) => {
    setEditForm({ 
      ...product, 
      category: product.category?._id || product.category,
      images: product.images?.length > 0 ? product.images[0] : ''
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const payload = {
        name: editForm.name,
        slug: generateSlug(editForm.name),
        description: editForm.description,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        category: editForm.category,
        images: editForm.images ? [editForm.images] : []
      };

      await axios.put(`/api/admin/products/${editForm._id}`, payload, getAuthHeader());
      setShowEditModal(false);
      fetchProducts();
    } catch (error) {
      alert('Failed to update product');
    } finally {
      setEditLoading(false);
    }
  };

  const filteredProducts = filterCategory 
    ? products.filter(p => (p.category?._id || p.category) === filterCategory) 
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹ 14,500</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">WhatsApp Clicks</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">45</p>
        </div>
      </div>

      {/* Manage Categories Section */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden mb-12">
        <div className="p-6 bg-brand-light border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-dark">Manage Categories</h2>
          <button 
            onClick={() => setShowCatModal(true)}
            className="px-4 py-2 bg-brand-cta text-white rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            + New Category
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-sm text-gray-600">Category</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingCats ? (
                <tr>
                  <td colSpan="2" className="p-8 text-center text-gray-500">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="2" className="p-8 text-center text-gray-500">No categories found.</td>
                </tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={cat.image || 'https://via.placeholder.com/50'} 
                          alt={cat.name}
                          className="w-12 h-12 rounded object-cover border border-gray-200"
                        />
                        <div>
                          <span className="font-medium text-brand-dark block">{cat.name}</span>
                          <span className="text-xs text-gray-500">/{cat.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditCatModal(cat)}
                          className="px-3 py-1 text-sm bg-brand-light text-brand-dark rounded hover:bg-brand-secondary transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden mb-12">
        <div className="p-6 bg-brand-light border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-dark">Add New Product</h2>
        </div>
        
        <div className="p-6">
          {productMessage && (
            <div className={`mb-6 p-4 rounded-md ${productMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {productMessage.text}
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Product Name</label>
                <input 
                  type="text" required 
                  value={productName} onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta focus:border-brand-cta" 
                  placeholder="e.g., Pink Teddy Bear"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Price (₹)</label>
                <input 
                  type="number" required min="0"
                  value={productPrice} onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta focus:border-brand-cta" 
                  placeholder="e.g., 299"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Category</label>
                <select 
                  required 
                  value={productCategory} onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta focus:border-brand-cta"
                  disabled={loadingCats}
                >
                  {loadingCats ? <option>Loading...</option> : categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Initial Stock</label>
                <input 
                  type="number" required min="0"
                  value={productStock} onChange={(e) => setProductStock(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta focus:border-brand-cta" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-text mb-1">Image URL</label>
                <input 
                  type="url" required
                  value={productImage} onChange={(e) => setProductImage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta focus:border-brand-cta" 
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-text mb-1">Description</label>
                <textarea 
                  required rows="3"
                  value={productDescription} onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta focus:border-brand-cta" 
                  placeholder="Describe the product..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={productLoading}
                className="px-8 py-3 bg-brand-cta text-white font-bold rounded-md shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {productLoading ? 'Saving...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Manage Products Section */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="p-6 bg-brand-light border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-xl font-bold text-brand-dark">Manage Products</h2>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-brand-text whitespace-nowrap">Filter by:</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta focus:border-brand-cta"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-sm text-gray-600">Product</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Price</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Stock</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Category</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/50'} 
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover border border-gray-200"
                        />
                        <span className="font-medium text-brand-dark">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-brand-text">₹ {product.price}</td>
                    <td className="p-4 text-brand-text">{product.stock}</td>
                    <td className="p-4 text-brand-text">
                      {product.category?.name || 'Unknown'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="px-3 py-1 text-sm bg-brand-light text-brand-dark rounded hover:bg-brand-secondary transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product._id)}
                          className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-brand-light">
              <h3 className="text-lg font-bold text-brand-dark">Edit Product</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-brand-dark">&times;</button>
            </div>
            
            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">Product Name</label>
                  <input 
                    type="text" required 
                    value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">Price (₹)</label>
                  <input 
                    type="number" required min="0"
                    value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">Category</label>
                  <select 
                    required 
                    value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta"
                  >
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">Stock</label>
                  <input 
                    type="number" required min="0"
                    value={editForm.stock} onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-text mb-1">Image URL</label>
                  <input 
                    type="url" required
                    value={editForm.images} onChange={(e) => setEditForm({...editForm, images: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-text mb-1">Description</label>
                  <textarea 
                    required rows="3"
                    value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta" 
                  ></textarea>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button 
                  type="button" onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={editLoading}
                  className="px-4 py-2 bg-brand-cta text-white rounded-md hover:opacity-90 disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-brand-light">
              <h3 className="text-lg font-bold text-brand-dark">Create New Category</h3>
              <button onClick={() => setShowCatModal(false)} className="text-gray-400 hover:text-brand-dark">&times;</button>
            </div>
            
            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              {catMessage && (
                <div className={`p-3 rounded-md text-sm ${catMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {catMessage.text}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Category Name</label>
                <input 
                  type="text" required 
                  value={catName} onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta" 
                  placeholder="e.g., Wallets"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Cover Image URL</label>
                <input 
                  type="url" required 
                  value={catImage} onChange={(e) => setCatImage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta" 
                  placeholder="https://..."
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={catLoading}
                  className="px-4 py-2 bg-brand-cta text-white rounded-md hover:opacity-90 disabled:opacity-50"
                >
                  {catLoading ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCatModal && editCatForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-brand-light">
              <h3 className="text-lg font-bold text-brand-dark">Edit Category</h3>
              <button onClick={() => setShowEditCatModal(false)} className="text-gray-400 hover:text-brand-dark">&times;</button>
            </div>
            
            <form onSubmit={handleUpdateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Category Name</label>
                <input 
                  type="text" required 
                  value={editCatForm.name} onChange={(e) => setEditCatForm({...editCatForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Cover Image URL</label>
                <input 
                  type="url" required 
                  value={editCatForm.image} onChange={(e) => setEditCatForm({...editCatForm, image: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta" 
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button 
                  type="button" onClick={() => setShowEditCatModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={editCatLoading}
                  className="px-4 py-2 bg-brand-cta text-white rounded-md hover:opacity-90 disabled:opacity-50"
                >
                  {editCatLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
