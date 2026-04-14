import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ProductModal = ({ isOpen, onClose, onProductSaved, product = null }) => {
    // categories for dropdown
    const [categories, setCategories] = useState([]);
    // form data for product
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        categoryId: '',
        image_url: '',
        image_url_2: '',
        image_url_3: '',
        image_url_4: '',
        gender: 'All',
        sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12', '13'],
        size_range: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEdit = !!product;
// run only when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (isEdit) {
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    stock_quantity: product.stock_quantity || '',
                    categoryId: product.categoryId || '',
                    image_url: product.image_url || '',
                    image_url_2: product.image_url_2 || '',
                    image_url_3: product.image_url_3 || '',
                    image_url_4: product.image_url_4 || '',
                    gender: product.gender || 'All',
                    sizes: (typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes) || ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12', '13'],
                    size_range: product.size_range || ''
                });
            } else {
                // reset form for new product
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stock_quantity: '',
                    categoryId: '',
                    image_url: '',
                    image_url_2: '',
                    image_url_3: '',
                    image_url_4: '',
                    gender: 'All',
                    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12', '13'],
                    size_range: ''
                });
            }
        }
    }, [isOpen, product, isEdit]);
// get categories from backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data);
            if (response.data.length > 0 && !formData.categoryId && !isEdit) {
                setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
// handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
// submit form (create or update product)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
     // convert values before sending
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock_quantity: parseInt(formData.stock_quantity),
                sizes: JSON.stringify(formData.sizes)
            };

            let response;
            if (isEdit) {
                response = await axios.put(`http://localhost:5000/api/products/${product.id}`, payload);
            } else {
                response = await axios.post('http://localhost:5000/api/products', payload);
            }

            if (response.status === 200 || response.status === 201) {
                onProductSaved(response.data);
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || `Error ${isEdit ? 'updating' : 'creating'} product. Please try again.`);
            console.error(`Error ${isEdit ? 'updating' : 'creating'} product:`, error);
        } finally {
            setLoading(false);
        }
    };
// don't render if modal is closed
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm transition-all animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
                {/* Modal Header */}
                <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
                        <p className="text-xs text-gray-500 mt-1">{isEdit ? 'Update product details in your inventory' : 'Fill in the details to add to your inventory'}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="px-6 py-4">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center">
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Name</label>
                            <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter product name (e.g. SoleRunner V1)"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category</label>
                            <select 
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none appearance-none bg-no-repeat bg-[right_1rem_center]"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundSize: '1.2em' }}
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Price ($)</label>
                            <input 
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Stock Quantity</label>
                            <input 
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                required
                                placeholder="0"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gender</label>
                            <select 
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none appearance-none bg-no-repeat bg-[right_1rem_center]"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundSize: '1.2em' }}
                            >
                                <option value="All">All</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>

                        {/* Size Range */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Size Range</label>
                            <input 
                                type="text"
                                name="size_range"
                                value={formData.size_range}
                                onChange={handleChange}
                                placeholder="e.g. 6-13"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Main Image URL</label>
                            <input 
                                type="text"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://unsplash.com/..."
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Additional Image URLs */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Image URL 2</label>
                            <input type="text" name="image_url_2" value={formData.image_url_2} onChange={handleChange} placeholder="Optional secondary image URL" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Image URL 3</label>
                            <input type="text" name="image_url_3" value={formData.image_url_3} onChange={handleChange} placeholder="Optional third image URL" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Image URL 4</label>
                            <input type="text" name="image_url_4" value={formData.image_url_4} onChange={handleChange} placeholder="Optional fourth image URL" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none" />
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                placeholder="Describe the key features and materials..."
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold text-white shadow-md transition-all ${loading ? 'bg-orange-300' : 'bg-[#f66d3b] hover:bg-orange-600'}`}
                        >
                            {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Product' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
