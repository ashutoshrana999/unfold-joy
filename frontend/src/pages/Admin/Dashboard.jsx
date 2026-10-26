import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Plus,
  Trash2,
  Edit,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  LogOut,
  ShoppingBag,
  ExternalLink,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Key,
  Lock
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  // Categories State
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Products State
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchProduct, setSearchProduct] = useState('');

  // Stats
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    whatsappClicks: 0
  });

  // Homepage Section Settings State
  const [settings, setSettings] = useState({
    showUnder99: false,
    showUnder199: false
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  // Product Form State
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productStock, setProductStock] = useState('10');
  const [productCategory, setProductCategory] = useState('');
  const [productIsFeatured, setProductIsFeatured] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [productMessage, setProductMessage] = useState(null);

  // Create Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catLoading, setCatLoading] = useState(false);
  const [catMessage, setCatMessage] = useState(null);

  // Edit Product Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Edit Category Modal State
  const [showEditCatModal, setShowEditCatModal] = useState(false);
  const [editCatForm, setEditCatForm] = useState(null);
  const [editCatLoading, setEditCatLoading] = useState(false);

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await axios.put(
        '/api/admin/change-password',
        { currentPassword, newPassword },
        getAuthHeader()
      );
      setPasswordSuccess(res.data?.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Helper to slugify
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Helper to read file to base64 Data URL
  const handleImageFileUpload = (e, setImageCallback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size exceeds 2MB limit. Please choose a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageCallback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data || []);
      if (res.data?.length > 0 && !productCategory) {
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
      setProducts(res.data || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/settings');
      if (res.data) {
        setSettings({
          showUnder99: !!res.data.showUnder99,
          showUnder199: !!res.data.showUnder199
        });
      }
    } catch (error) {
      console.error('Failed to fetch site settings', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/dashboard', getAuthHeader());
      if (res.data) {
        setDashboardStats(res.data);
      }
    } catch (error) {
      // ignore
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Server-side token verification on mount
    axios
      .get('/api/admin/verify', getAuthHeader())
      .then(() => {
        fetchCategories();
        fetchProducts();
        fetchSettings();
        fetchStats();
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      });

    // Auto-logout interceptor on any 401 Unauthorized response
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Update Section Visibility Settings
  const handleToggleSetting = async (field) => {
    const newSettings = {
      ...settings,
      [field]: !settings[field]
    };
    setSettings(newSettings);
    setSettingsLoading(true);
    setSettingsMessage('');

    try {
      await axios.put('/api/admin/settings', newSettings, getAuthHeader());
      setSettingsMessage({
        type: 'success',
        text: `Homepage section "${field === 'showUnder99' ? 'Under ₹99' : 'Under ₹199'}" updated to ${newSettings[field] ? 'VISIBLE' : 'HIDDEN'}!`
      });
      setTimeout(() => setSettingsMessage(''), 4000);
    } catch (error) {
      console.error('Failed to update settings', error);
      setSettings(settings); // revert
      setSettingsMessage({
        type: 'error',
        text: 'Failed to update section settings.'
      });
    } finally {
      setSettingsLoading(false);
    }
  };

  // Category Actions
  const handleOpenCatModal = () => {
    setCatName('');
    setCatSlug('');
    setCatImage('');
    setCatMessage(null);
    setShowCatModal(true);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      setCatMessage({ type: 'error', text: 'Category name is required' });
      return;
    }

    setCatLoading(true);
    setCatMessage(null);

    try {
      const payload = {
        name: catName.trim(),
        slug: catSlug.trim() || generateSlug(catName),
        image: catImage || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
      };

      const res = await axios.post('/api/admin/categories', payload, getAuthHeader());

      setCatMessage({ type: 'success', text: 'Category created successfully!' });
      setShowCatModal(false);

      await fetchCategories();
      setProductCategory(res.data._id);
    } catch (error) {
      setCatMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create category'
      });
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?\nAll products in this category will also be permanently deleted.`)) {
      return;
    }

    try {
      await axios.delete(`/api/admin/categories/${id}`, getAuthHeader());
      setCategories(categories.filter((c) => c._id !== id));
      await fetchProducts();
      alert(`Category "${name}" and its products were successfully deleted.`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const openEditCatModal = (cat) => {
    setEditCatForm({ ...cat });
    setShowEditCatModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setEditCatLoading(true);
    try {
      const payload = {
        name: editCatForm.name.trim(),
        slug: editCatForm.slug.trim() || generateSlug(editCatForm.name),
        image: editCatForm.image
      };

      await axios.put(`/api/admin/categories/${editCatForm._id}`, payload, getAuthHeader());
      setShowEditCatModal(false);
      await fetchCategories();
      await fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update category');
    } finally {
      setEditCatLoading(false);
    }
  };

  // Product Actions
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productCategory) {
      setProductMessage({ type: 'error', text: 'Please select or create a category first' });
      return;
    }

    setProductLoading(true);
    setProductMessage(null);

    try {
      const payload = {
        name: productName.trim(),
        slug: generateSlug(productName),
        description: productDescription,
        price: Number(productPrice),
        stock: Number(productStock),
        category: productCategory,
        isFeatured: productIsFeatured,
        images: productImage ? [productImage] : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800']
      };

      await axios.post('/api/admin/products', payload, getAuthHeader());

      setProductMessage({ type: 'success', text: `Product "${productName}" created successfully!` });

      // Reset form
      setProductName('');
      setProductPrice('');
      setProductDescription('');
      setProductImage('');
      setProductStock('10');
      setProductIsFeatured(false);

      setTimeout(() => setProductMessage(null), 4000);
      await fetchProducts();
    } catch (error) {
      setProductMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create product'
      });
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      await axios.delete(`/api/admin/products/${id}`, getAuthHeader());
      setProducts(products.filter((p) => p._id !== id));
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
        name: editForm.name.trim(),
        slug: generateSlug(editForm.name),
        description: editForm.description,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        category: editForm.category,
        isFeatured: !!editForm.isFeatured,
        images: editForm.images ? [editForm.images] : []
      };

      await axios.put(`/api/admin/products/${editForm._id}`, payload, getAuthHeader());
      setShowEditModal(false);
      await fetchProducts();
    } catch (error) {
      alert('Failed to update product');
    } finally {
      setEditLoading(false);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = !filterCategory || (p.category?._id || p.category) === filterCategory;
    const matchesSearch = !searchProduct || p.name.toLowerCase().includes(searchProduct.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const countUnder99 = products.filter((p) => p.price <= 99).length;
  const countUnder199 = products.filter((p) => p.price >= 100 && p.price <= 199).length;

  return (
    <div className="bg-brand-light min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-brand-secondary/40 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.png" alt="Unfold Joy" className="h-9 w-auto object-contain" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-cta bg-brand-secondary/30 px-2.5 py-0.5 rounded-full">
                Admin Panel
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">
              Control Center
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage categories, products, and dynamic homepage sections
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              target="_blank"
              className="px-4 py-2 bg-white text-brand-dark border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Storefront
            </Link>

            <button
              onClick={() => {
                setShowPasswordModal(true);
                setPasswordError('');
                setPasswordSuccess('');
              }}
              className="px-4 py-2 bg-white text-brand-dark border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Key className="w-3.5 h-3.5 text-brand-cta" />
              Change Password
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-100 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Products</h3>
            <p className="text-3xl font-extrabold text-brand-dark mt-2">{products.length}</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Active in catalog</span>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</h3>
            <p className="text-3xl font-extrabold text-brand-dark mt-2">{categories.length}</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Curated collections</span>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Inquiries</h3>
            <p className="text-3xl font-extrabold text-brand-dark mt-2">{dashboardStats.whatsappClicks || 45}</p>
            <span className="text-[11px] text-green-600 mt-1 block">Buyer engagement</span>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Under ₹99 / ₹199</h3>
            <p className="text-3xl font-extrabold text-brand-cta mt-2">{countUnder99} / {countUnder199}</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Special price items</span>
          </div>
        </div>

        {/* SECTION 1: HOMEPAGE SECTIONS CONTROL (UNDER 99 & UNDER 199) */}
        <div className="bg-white rounded-3xl shadow-sm border border-brand-secondary/40 p-6 sm:p-8 mb-10 overflow-hidden relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 border-b border-gray-100 mb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-cta/10 text-brand-cta mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Storefront Section Controls
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
                Homepage Featured Price Sections
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Admin can toggle special bargain sections to appear or stay hidden on the homepage.
              </p>
            </div>
          </div>

          {settingsMessage && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                settingsMessage.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {settingsMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              {settingsMessage.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Toggle 1: Steals Under 99 */}
            <div
              className={`p-6 rounded-2xl border transition-all ${
                settings.showUnder99
                  ? 'bg-purple-50/60 border-brand-cta/40 shadow-sm'
                  : 'bg-gray-50/70 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-base font-bold text-brand-dark flex items-center gap-2">
                    Show &ldquo;Steals Under ₹99&rdquo; Section
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Displays items priced up to ₹99 on the homepage. Currently {countUnder99} qualifying items in store.
                  </p>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  disabled={settingsLoading}
                  onClick={() => handleToggleSetting('showUnder99')}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.showUnder99 ? 'bg-brand-cta' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      settings.showUnder99 ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200/60 text-xs">
                <span className="font-semibold text-gray-500">Status:</span>
                {settings.showUnder99 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-green-100 text-green-800">
                    <Eye className="w-3 h-3" /> Active on Homepage
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-gray-200 text-gray-700">
                    <EyeOff className="w-3 h-3" /> Hidden from Homepage
                  </span>
                )}
              </div>
            </div>

            {/* Toggle 2: Finds Under 199 */}
            <div
              className={`p-6 rounded-2xl border transition-all ${
                settings.showUnder199
                  ? 'bg-purple-50/60 border-brand-cta/40 shadow-sm'
                  : 'bg-gray-50/70 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-base font-bold text-brand-dark flex items-center gap-2">
                    Show &ldquo;Finds Under ₹199&rdquo; Section
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Displays items priced ₹100–₹199 on the homepage. Currently {countUnder199} qualifying items in store.
                  </p>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  disabled={settingsLoading}
                  onClick={() => handleToggleSetting('showUnder199')}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.showUnder199 ? 'bg-brand-cta' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      settings.showUnder199 ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200/60 text-xs">
                <span className="font-semibold text-gray-500">Status:</span>
                {settings.showUnder199 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-green-100 text-green-800">
                    <Eye className="w-3 h-3" /> Active on Homepage
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-gray-200 text-gray-700">
                    <EyeOff className="w-3 h-3" /> Hidden from Homepage
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: CATEGORY MANAGEMENT (ADD & DELETE WITH IMAGE) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="p-6 bg-gradient-to-r from-brand-light to-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-cta" />
                Manage Categories ({categories.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Add, edit, or delete store categories with custom cover images
              </p>
            </div>

            <button
              onClick={handleOpenCatModal}
              className="px-5 py-2.5 bg-brand-cta text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Category
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="p-4">Category Image & Name</th>
                  <th className="p-4">URL Slug</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingCats ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      Loading categories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No categories found. Click &quot;Add New Category&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => {
                    const catProductCount = products.filter(
                      (p) => (p.category?._id || p.category) === cat._id
                    ).length;

                    return (
                      <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0 shadow-sm">
                              <img
                                src={cat.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=200'}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-brand-dark block text-sm sm:text-base">
                                {cat.name}
                              </span>
                              <Link
                                to={`/category/${cat.slug}`}
                                target="_blank"
                                className="text-xs text-brand-cta hover:underline inline-flex items-center gap-1"
                              >
                                View Page <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-xs font-mono text-gray-600">
                          /category/{cat.slug}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            catProductCount > 0 ? 'bg-purple-100 text-brand-dark' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {catProductCount} {catProductCount === 1 ? 'Product' : 'Products'}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditCatModal(cat)}
                              className="px-3 py-1.5 text-xs font-bold bg-brand-light text-brand-dark hover:bg-brand-secondary rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat._id, cat.name)}
                              className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                              title="Delete this category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: ADD NEW PRODUCT FORM */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="p-6 bg-gradient-to-r from-brand-light to-white border-b border-gray-100">
            <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-cta" />
              Add New Product to Store
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              List products for any category. They will appear immediately on the storefront.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {productMessage && (
              <div
                className={`mb-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  productMessage.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {productMessage.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                {productMessage.text}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta text-sm"
                    placeholder="e.g. Lavender Blossom Bear"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta text-sm"
                    placeholder="e.g. 99, 149, 299"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta text-sm"
                    disabled={loadingCats}
                  >
                    {categories.length === 0 && <option value="">No categories available</option>}
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Product Image (URL or Upload from Device) *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="url"
                      value={productImage}
                      onChange={(e) => setProductImage(e.target.value)}
                      className="flex-grow px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta text-sm"
                      placeholder="Paste image URL (e.g. https://...)"
                    />
                    <label className="px-4 py-2.5 bg-brand-light text-brand-dark hover:bg-brand-secondary font-bold text-xs rounded-xl border border-brand-secondary flex items-center justify-center gap-2 cursor-pointer transition-colors whitespace-nowrap">
                      <Upload className="w-4 h-4" />
                      Upload File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileUpload(e, setProductImage)}
                      />
                    </label>
                  </div>
                </div>

                {/* Live Preview if image exists */}
                {productImage && (
                  <div className="md:col-span-3 flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-300 bg-white flex-shrink-0">
                      <img
                        src={productImage}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand-dark block">
                        Image Preview Ready
                      </span>
                      <button
                        type="button"
                        onClick={() => setProductImage('')}
                        className="text-xs text-red-600 hover:underline mt-0.5"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Product Description
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta text-sm"
                    placeholder="Provide details about craftsmanship, size, materials, and gifting appeal..."
                  ></textarea>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100 gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-brand-text">
                  <input
                    type="checkbox"
                    checked={productIsFeatured}
                    onChange={(e) => setProductIsFeatured(e.target.checked)}
                    className="rounded text-brand-cta focus:ring-brand-cta w-4 h-4"
                  />
                  Mark as Featured Product (Shows &ldquo;Best Seller&rdquo; badge)
                </label>

                <button
                  type="submit"
                  disabled={productLoading || categories.length === 0}
                  className="w-full sm:w-auto px-8 py-3 bg-brand-cta text-white font-bold rounded-xl shadow-md hover:opacity-95 disabled:opacity-50 transition-all text-sm"
                >
                  {productLoading ? 'Publishing Product...' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* SECTION 4: MANAGE STORE PRODUCTS */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-6 bg-gradient-to-r from-brand-light to-white border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-cta" />
                Manage Products ({filteredProducts.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Review active listings, edit pricing and details, or delete discontinued items
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs flex-grow md:w-48"
              />

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-brand-text"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500">
                      <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-base font-bold text-brand-dark">No Products in Catalog</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Use the &quot;Add New Product to Store&quot; form above to add products.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0 shadow-sm">
                            <img
                              src={product.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=200'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-brand-dark block text-sm sm:text-base">
                              {product.name}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              /product/{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-xs font-semibold text-brand-cta">
                        {product.category?.name || 'Unassigned'}
                      </td>

                      <td className="p-4 font-extrabold text-brand-dark text-sm sm:text-base">
                        ₹{product.price}
                      </td>

                      <td className="p-4 text-xs text-gray-600 font-medium">
                        {product.stock} units
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="px-3 py-1.5 text-xs font-bold bg-brand-light text-brand-dark hover:bg-brand-secondary rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* MODAL 1: CREATE NEW CATEGORY WITH IMAGE */}
        {showCatModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-brand-light">
                <h3 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-cta" />
                  Create New Category
                </h3>
                <button
                  onClick={() => setShowCatModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-200/50 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
                {catMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      catMessage.type === 'success'
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {catMessage.text}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => {
                      setCatName(e.target.value);
                      if (!catSlug) setCatSlug(generateSlug(e.target.value));
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-cta/20 text-sm"
                    placeholder="e.g. Scented Candles"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category URL Slug (Auto-generated)
                  </label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white text-xs font-mono"
                    placeholder="e.g. scented-candles"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category Cover Image (URL or Upload)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={catImage}
                      onChange={(e) => setCatImage(e.target.value)}
                      className="flex-grow px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white text-xs"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <label className="px-3 py-2 bg-brand-light text-brand-dark hover:bg-brand-secondary font-bold text-xs rounded-xl border border-brand-secondary flex items-center gap-1 cursor-pointer whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5" />
                      Browse
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileUpload(e, setCatImage)}
                      />
                    </label>
                  </div>

                  {catImage && (
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-200 mt-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-300 bg-white flex-shrink-0">
                        <img
                          src={catImage}
                          alt="Category Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-gray-600">Image Preview Ready</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowCatModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={catLoading}
                    className="px-6 py-2 bg-brand-cta text-white font-bold rounded-xl text-sm shadow hover:opacity-90 disabled:opacity-50"
                  >
                    {catLoading ? 'Creating...' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: EDIT CATEGORY */}
        {showEditCatModal && editCatForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-brand-light">
                <h3 className="text-lg font-extrabold text-brand-dark">Edit Category</h3>
                <button
                  onClick={() => setShowEditCatModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-200/50 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCatForm.name}
                    onChange={(e) =>
                      setEditCatForm({ ...editCatForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editCatForm.slug}
                    onChange={(e) =>
                      setEditCatForm({ ...editCatForm, slug: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Cover Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editCatForm.image || ''}
                      onChange={(e) =>
                        setEditCatForm({ ...editCatForm, image: e.target.value })
                      }
                      className="flex-grow px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white text-xs"
                    />
                    <label className="px-3 py-2 bg-brand-light text-brand-dark hover:bg-brand-secondary font-bold text-xs rounded-xl border border-brand-secondary flex items-center gap-1 cursor-pointer whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileUpload(e, (url) =>
                            setEditCatForm({ ...editCatForm, image: url })
                          )
                        }
                      />
                    </label>
                  </div>

                  {editCatForm.image && (
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-200 mt-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-300 bg-white flex-shrink-0">
                        <img
                          src={editCatForm.image}
                          alt="Category Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-gray-600">Current Cover Image</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowEditCatModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editCatLoading}
                    className="px-6 py-2 bg-brand-cta text-white font-bold rounded-xl text-sm shadow hover:opacity-90 disabled:opacity-50"
                  >
                    {editCatLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: EDIT PRODUCT */}
        {showEditModal && editForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-brand-light">
                <h3 className="text-lg font-extrabold text-brand-dark">Edit Product</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-200/50 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Product Image (URL or Upload)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={editForm.images || ''}
                        onChange={(e) => setEditForm({ ...editForm, images: e.target.value })}
                        className="flex-grow px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                      />
                      <label className="px-3 py-2 bg-brand-light text-brand-dark hover:bg-brand-secondary font-bold text-xs rounded-xl border border-brand-secondary flex items-center gap-1 cursor-pointer whitespace-nowrap">
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e, (url) =>
                              setEditForm({ ...editForm, images: url })
                            )
                          }
                        />
                      </label>
                    </div>

                    {editForm.images && (
                      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-200 mt-2">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-300 bg-white flex-shrink-0">
                          <img
                            src={editForm.images}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-gray-600">Product Image Preview</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                    ></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-brand-text">
                      <input
                        type="checkbox"
                        checked={!!editForm.isFeatured}
                        onChange={(e) =>
                          setEditForm({ ...editForm, isFeatured: e.target.checked })
                        }
                        className="rounded text-brand-cta focus:ring-brand-cta w-4 h-4"
                      />
                      Featured Product (Best Seller Badge)
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-6 py-2 bg-brand-cta text-white font-bold rounded-xl text-sm shadow hover:opacity-90 disabled:opacity-50"
                  >
                    {editLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-brand-dark">Change Password</h3>
                    <p className="text-xs text-gray-500">Update your administrator login credentials</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {passwordError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cta pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cta pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cta"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-5 py-2 bg-brand-cta text-white font-bold rounded-xl text-xs shadow hover:opacity-90 disabled:opacity-50"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
