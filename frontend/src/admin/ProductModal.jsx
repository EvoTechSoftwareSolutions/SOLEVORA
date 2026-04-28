import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon, ArrowUpTrayIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const BASE_URL = 'http://localhost:5001';

const ProductModal = ({ isOpen, onClose, onProductSaved, product = null }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
const [suggestions, setSuggestions] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
    // Basic Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        discountPrice: '',
        categoryId: '',
        gender: 'ALL',
    });

    // Stock/Size State
    const [stocks, setStocks] = useState([{ size: '7', costPrice: '', quantity: '' }]);

    // Image State
    const [images, setImages] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]); 
    const [allProducts, setAllProducts] = useState([]);

useEffect(() => {
  const fetchAll = async () => {
    const res = await axios.get(`${BASE_URL}/api/products/all`);
    setAllProducts(res.data.data || []);
  };

  fetchAll();
}, []);
    // 1. Fetch Categories
    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    const { data } = await axios.get(`${BASE_URL}/api/category`);
                    console.log("API RESPONSE:", data);
                    setCategories(data.data || []);
                     
                } catch (err) {
                    console.error('Error fetching categories:', err);
                }
            };
            fetchCategories();
        }
    }, [isOpen]);

    // 2. Pre-fill or Reset Form
    useEffect(() => {
        if (isOpen) {
            if (product) {
                setFormData({
                    name: product.name || '',
                    slug: product.slug || '',
                    description: product.description || '',
                    price: product.price || '',
                    discountPrice: product.discountPrice || '',
                    categoryId: product.categoryId || '',
                    gender: product.gender || 'ALL',
                });
                setStocks(product.stocks || [{ size: '7', costPrice: '', quantity: '' }]);
                setImagePreviews(product.images?.map(img => `${BASE_URL}${img.url}`) || []);
            } else {
                setFormData({ name: '', slug: '', description: '', price: '', discountPrice: '', categoryId: '', gender: 'ALL' });
                setStocks([{ size: '7', costPrice: '', quantity: '' }]);
                setImages([]);
                setImagePreviews([]);
            }
        }
    }, [isOpen, product]);


// for auto complete
const handleNameChange = (e) => {
  const value = e.target.value;

  setFormData((prev) => ({
    ...prev,
    name: value,
  }));

  setSearchTerm(value);

  if (value.length > 1) {
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered);
    setShowDropdown(true);
  } else {
    setShowDropdown(false);
  }
};

const handleSelectProduct = (product) => {
  setFormData({
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    discountPrice: product.discountPrice,
    categoryId: product.categoryId,
    gender: product.gender,
  });

  setStocks(product.stocks || []);
  setImagePreviews(
    product.images?.map((img) => `${BASE_URL}${img.url}`) || []
  );

  setShowDropdown(false);
};
 const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
        ...prev,
        [name]: name === "categoryId" ? Number(value) : value
    }));
};

    const handleStockChange = (index, field, value) => {
        const updated = [...stocks];
        updated[index][field] = value;
        setStocks(updated);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...previews]);
    };

    const handleRemoveImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            
    Object.entries(formData).forEach(([key, value]) => {
  if (value !== undefined && value !== null && value !== '') {
    data.append(key, value);
  }
});
            
            data.append('stocks', JSON.stringify(stocks || []));

            images.forEach(file => data.append('images', file));

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (product) {
                await axios.put(`${BASE_URL}/api/products/${product.id}`, data, config);
            } else {
                await axios.post(`${BASE_URL}/api/products`, data, config);
            }

            onProductSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 py-4 flex justify-between items-center border-b z-10">
                    <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><XMarkIcon className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
  <label className="block text-sm font-medium mb-1">
    Product Name
  </label>

  <input
    type="text"
    value={formData.name}
    onChange={handleNameChange}
    className="w-full border p-2 rounded"
    placeholder="Type product name..."
  />

  {/* DROPDOWN */}
  {showDropdown && suggestions.length > 0 && (
    <div className="absolute z-50 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
      {suggestions.map((item) => (
        <div
          key={item.id}
          onClick={() => handleSelectProduct(item)}
          className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
        >
          {item.name}
        </div>
      ))}
    </div>
  )}
</div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium mb-1">Slug</label>
                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full border rounded-lg p-2" />
                        </div>
                    </div>
                       <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <input type="text" name="description" value={formData.description} onChange={handleChange} required className="w-full border rounded-lg p-2" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium mb-1">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-2"
                            >
                                <option value="ALL">All</option>
                                <option value="MEN">Men</option>
                                <option value="WOMEN">Women</option>
                                <option value="KIDS">Kids</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
  <label className="block text-sm font-medium mb-1">Category</label>

  <select
    name="categoryId"
    value={formData.categoryId}
    onChange={handleChange}
    required
    className="w-full border rounded-lg p-2"
  >
    <option value="">Select Category</option>

    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </select>
</div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Price (Rs.)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border rounded-lg p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Discount Price</label>
                            <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full border rounded-lg p-2" />
                        </div>
                    </div>

                    {/* Stocks Section */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-700">Stock & Sizes</h3>
                            <button type="button" onClick={() => setStocks([...stocks, { size: '', costPrice: '', quantity: '' }])} className="text-sm flex items-center text-blue-600">
                                <PlusIcon className="w-4 h-4 mr-1" /> Add Size
                            </button>
                        </div>
                        {stocks.map((stock, idx) => (
                            <div key={idx} className="grid grid-cols-4 gap-2 mb-2 items-end">
                                <input placeholder="Size" value={stock.size} onChange={(e) => handleStockChange(idx, 'size', e.target.value)} className="border rounded-lg p-2 text-sm" />
                                <input placeholder="Cost" type="number" value={stock.costPrice} onChange={(e) => handleStockChange(idx, 'costPrice', e.target.value)} className="border rounded-lg p-2 text-sm" />
                                <input placeholder="Qty" type="number" value={stock.quantity} onChange={(e) => handleStockChange(idx, 'quantity', e.target.value)} className="border rounded-lg p-2 text-sm" />
                                <button type="button" onClick={() => setStocks(stocks.filter((_, i) => i !== idx))} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Images */}
                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium mb-2">Product Images</label>
                        <div className="flex flex-wrap gap-3 mb-3">
                            {imagePreviews.map((src, i) => (
                                <div key={i} className="relative group">
                                    <img src={src} alt={`preview ${i+1}`} className="w-20 h-20 object-cover rounded-lg border" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                <ArrowUpTrayIcon className="w-6 h-6 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-1">Add Images</span>
                                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">Upload multiple images. All images will be displayed.</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg font-semibold">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-blue-300">
                            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;