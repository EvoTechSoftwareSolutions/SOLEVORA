import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon, ArrowUpTrayIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const BASE_URL = 'http://localhost:5001';

const ProductModal = ({ isOpen, onClose, onProductSaved, product = null }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Basic Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        discountPrice: '',
        categoryId: '',
        gender: 'All',
        size_range: '',
        image_url: '',
        image_url_2: '',
        stock_quantity: 0
    });

    // Stock/Size State (for when creating new products)
    const [stocks, setStocks] = useState([{ size: '7', costPrice: '', quantity: '' }]);

    // Image Upload State
    const [images, setImages] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploading, setUploading] = useState({ image_url: false, image_url_2: false });

    // Stock Arrival Logic (for editing)
    const [incomingStock, setIncomingStock] = useState('');
    const [incomingPrice, setIncomingPrice] = useState('');
    const [showStockHelper, setShowStockHelper] = useState(false);

    const isEdit = !!product;

    // Fetch Categories
    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    const { data } = await axios.get(`${BASE_URL}/api/category`);
                    setCategories(data.data || []);
                } catch (err) {
                    console.error('Error fetching categories:', err);
                }
            };
            fetchCategories();
        }
    }, [isOpen]);

    // Pre-fill or Reset Form
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
                    gender: product.gender || 'All',
                    size_range: product.size_range || '',
                    image_url: product.image_url || '',
                    image_url_2: product.image_url_2 || '',
                    stock_quantity: product.stock_quantity || 0
                });
                setStocks(product.stocks || [{ size: '7', costPrice: '', quantity: '' }]);
                setImagePreviews(product.images?.map(img => `${BASE_URL}${img.url}`) || []);
            } else {
                setFormData({
                    name: '',
                    slug: '',
                    description: '',
                    price: '',
                    discountPrice: '',
                    categoryId: '',
                    gender: 'All',
                    size_range: '',
                    image_url: '',
                    image_url_2: '',
                    stock_quantity: 0
                });
                setStocks([{ size: '7', costPrice: '', quantity: '' }]);
                setImages([]);
                setImagePreviews([]);
            }
        }
    }, [isOpen, product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        setImagePreviews(previews);
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(prev => ({ ...prev, [field]: true }));
        const data = new FormData();
        data.append('image', file);

        try {
            const res = await axios.post(`${BASE_URL}/api/upload`, data);
            setFormData(prev => ({ ...prev, [field]: res.data.url }));
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(prev => ({ ...prev, [field]: false }));
        }
    };

    const applyStockArrival = () => {
        if (!incomingStock || !incomingPrice) return;
        
        setFormData(prev => ({
            ...prev,
            isNewBatch: true,
            added_quantity: parseInt(incomingStock),
            price: parseFloat(incomingPrice)
        }));
        
        alert(`New Batch Prepared: ${incomingStock} units. Click 'Update Product' to save.`);
        setIncomingStock('');
        setIncomingPrice('');
        setShowStockHelper(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            data.append('stocks', JSON.stringify(stocks));
            images.forEach(file => data.append('images', file));

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (isEdit) {
                await axios.put(`${BASE_URL}/api/products/${product.id}`, formData, config);
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Product Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded-lg p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug</label>
                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full border rounded-lg p-2" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full border rounded-lg p-2 h-24" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full border rounded-lg p-2">
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full border rounded-lg p-2">
                                <option value="All">All</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>
                    </div>

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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                            <div className="relative">
                                <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required className="w-full border rounded-lg p-2" />
                                {isEdit && (
                                    <button type="button" onClick={() => setShowStockHelper(!showStockHelper)} className="absolute right-2 top-2 text-xs text-orange-600 font-bold hover:underline">
                                        + New Batch
                                    </button>
                                )}
                            </div>
                            {showStockHelper && (
                                <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-100 space-y-2">
                                    <input type="number" placeholder="Incoming Qty" value={incomingStock} onChange={(e) => setIncomingStock(e.target.value)} className="w-full p-1 text-sm border rounded" />
                                    <input type="number" placeholder="Incoming Price" value={incomingPrice} onChange={(e) => setIncomingPrice(e.target.value)} className="w-full p-1 text-sm border rounded" />
                                    <button type="button" onClick={applyStockArrival} className="w-full py-1 bg-orange-500 text-white text-xs rounded font-bold">Apply</button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Size Range</label>
                            <input type="text" name="size_range" value={formData.size_range} onChange={handleChange} placeholder="e.g. 6-12" className="w-full border rounded-lg p-2" />
                        </div>
                    </div>

                    {!isEdit && (
                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold">Initial Stock per Size</h3>
                                <button type="button" onClick={() => setStocks([...stocks, { size: '', costPrice: '', quantity: '' }])} className="text-blue-600 text-sm flex items-center">
                                    <PlusIcon className="w-4 h-4 mr-1" /> Add Size
                                </button>
                            </div>
                            {stocks.map((s, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input placeholder="Size" value={s.size} onChange={(e) => handleStockChange(i, 'size', e.target.value)} className="w-20 border rounded p-1 text-sm" />
                                    <input placeholder="Cost" type="number" value={s.costPrice} onChange={(e) => handleStockChange(i, 'costPrice', e.target.value)} className="flex-1 border rounded p-1 text-sm" />
                                    <input placeholder="Qty" type="number" value={s.quantity} onChange={(e) => handleStockChange(i, 'quantity', e.target.value)} className="w-24 border rounded p-1 text-sm" />
                                    <button type="button" onClick={() => setStocks(stocks.filter((_, idx) => idx !== i))} className="text-red-500"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium mb-2">Images</label>
                        <div className="flex flex-wrap gap-2">
                            {imagePreviews.map((src, i) => (
                                <img key={i} src={src} className="w-20 h-20 object-cover rounded border" alt="preview" />
                            ))}
                            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed rounded cursor-pointer hover:bg-gray-50">
                                <ArrowUpTrayIcon className="w-6 h-6 text-gray-400" />
                                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t">
                        <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg font-semibold">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-blue-300">
                            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;