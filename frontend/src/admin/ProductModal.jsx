import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineX, HiOutlineCloudUpload, HiOutlineDuplicate, HiOutlineCube, HiOutlineCurrencyDollar } from "react-icons/hi";

const ProductModal = ({ isOpen, onClose, onSave, product = null }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        image_url: '',
        image_url_2: '',
        image_url_3: '',
        image_url_4: ''
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
                    stock: product.stock || '',
                    categoryId: product.categoryId || '',
                    image_url: product.image_url || '',
                    image_url_2: product.image_url_2 || '',
                    image_url_3: product.image_url_3 || '',
                    image_url_4: product.image_url_4 || ''
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stock: '',
                    categoryId: '',
                    image_url: '',
                    image_url_2: '',
                    image_url_3: '',
                    image_url_4: ''
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
            console.error('Category retrieval failure:', error);
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
                stock: parseInt(formData.stock)
            };

            if (isEdit) {
                await axios.put(`http://localhost:5000/api/products/${product.id}`, payload);
            } else {
                await axios.post('http://localhost:5000/api/products', payload);
            }
            onSave();
        } catch (error) {
            setError(error.response?.data?.message || `Protocol mismatch during ${isEdit ? 'refactoring' : 'injection'}.`);
            console.error('Transaction failure:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn italic selection:bg-primary/20">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn">
                
                {/* Header */}
                <header className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-secondary italic">{isEdit ? 'Refactor' : 'Inject'} <span className="text-primary">Unit</span></h2>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[.3em] mt-1">Magnitude Specification Protocol v2.6</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-90">
                        <HiOutlineX size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-10 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-100">
                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3">
                             <HiOutlineExclamationCircle size={18} />
                             {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-8">
                        {/* Name */}
                        <div className="col-span-2 flex flex-col gap-2 group">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Unit Designation (Name)</label>
                            <input 
                                type="text" name="name" value={formData.name} onChange={handleChange} required
                                placeholder="CORE MAGNITUDE MODEL"
                                className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest"
                            />
                        </div>

                        {/* Category */}
                        <div className="flex flex-col gap-2 group">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Classification</label>
                            <div className="relative">
                                <select 
                                    name="categoryId" value={formData.categoryId} onChange={handleChange} required
                                    className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest appearance-none"
                                >
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                                <HiOutlineDuplicate className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col gap-2 group">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Procurement Value ($)</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xs leading-none mt-[1px]">$</span>
                                <input 
                                    type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required
                                    className="w-full h-14 pl-10 pr-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest"
                                />
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="flex flex-col gap-2 group">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Quantity (Units)</label>
                            <div className="relative">
                                <HiOutlineCube className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input 
                                    type="number" name="stock" value={formData.stock} onChange={handleChange} required
                                    className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="col-span-2 flex flex-col gap-2 group">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Technical intelligence (Description)</label>
                            <textarea 
                                name="description" value={formData.description} onChange={handleChange} rows="3"
                                className="w-full p-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest resize-none"
                            />
                        </div>

                        {/* Image URLs */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                             {[
                                { label: 'Primary Vector', name: 'image_url' },
                                { label: 'Auxiliary 01', name: 'image_url_2' },
                                { label: 'Auxiliary 02', name: 'image_url_3' },
                                { label: 'Auxiliary 03', name: 'image_url_4' },
                             ].map((img) => (
                                <div key={img.name} className="flex flex-col gap-2 group/img">
                                     <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within/img:text-primary transition-colors">{img.label}</label>
                                     <div className="relative">
                                        <HiOutlineCloudUpload className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input 
                                            type="text" name={img.name} value={formData[img.name]} onChange={handleChange} 
                                            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-[10px] uppercase tracking-widest"
                                        />
                                     </div>
                                </div>
                             ))}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <footer className="p-10 border-t border-slate-50 bg-slate-50/30 flex gap-4">
                    <button type="button" onClick={onClose} className="flex-1 h-14 bg-white border border-slate-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95">Abort Mission</button>
                    <button 
                        onClick={handleSubmit} disabled={loading}
                        className="flex-[2] h-14 bg-secondary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-secondary/10 active:scale-95 disabled:opacity-50 group"
                    >
                        {loading ? 'Transmitting Data...' : isEdit ? 'Commit Refactor' : 'Initialize Injection'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ProductModal;
