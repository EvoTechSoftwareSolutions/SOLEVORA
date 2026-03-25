import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ProductModal = ({ isOpen, onClose, onProductSaved, product = null }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        categoryId: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEdit = !!product;

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
                    image_url: product.image_url || ''
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stock_quantity: '',
                    categoryId: '',
                    image_url: ''
                });
            }
        }
    }, [isOpen, product, isEdit]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock_quantity: parseInt(formData.stock_quantity)
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm transition-all animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
                {/* Modal Header */}
                <div className="px-8 py-5 flex justify-between items-center border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
                        <p className="text-sm text-gray-500 mt-1">{isEdit ? 'Update product details in your inventory' : 'Fill in the details to add to your inventory'}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="px-8 py-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center">
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                            <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter product name (e.g. SoleRunner V1)"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select 
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none appearance-none bg-no-repeat bg-[right_1rem_center]"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundSize: '1.5em' }}
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                            <input 
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                            <input 
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                required
                                placeholder="0"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                            <input 
                                type="text"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://unsplash.com/..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Describe the key features and materials..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f66d3b] focus:border-transparent transition-all outline-none resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-10 flex gap-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all ${loading ? 'bg-orange-300' : 'bg-[#f66d3b] hover:bg-orange-600 hover:shadow-orange-200'}`}
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
