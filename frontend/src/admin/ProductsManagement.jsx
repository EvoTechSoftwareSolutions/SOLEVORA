import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductModal from './ProductModal';
import { 
    HiOutlinePlus, 
    HiOutlinePencil, 
    HiOutlineTrash, 
    HiOutlineFilter, 
    HiOutlineDownload, 
    HiOutlineChevronLeft, 
    HiOutlineChevronRight,
    HiOutlineCube,
    HiOutlineExclamationCircle,
    HiOutlineRefresh
} from "react-icons/hi";

const ProductsManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Inventory synchronization failure:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Erase this unit from the magnitude network?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Unit erasure failure:', error);
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        setIsModalOpen(false);
        fetchProducts();
    };

    const filteredProducts = products.filter(p => {
        if (activeTab === 'all') return true;
        if (activeTab === 'low') return p.stock > 0 && p.stock < 10;
        if (activeTab === 'out') return p.stock === 0;
        return true;
    });

    return (
        <div className="flex flex-col gap-10 animate-fadeIn relative z-10 selection:bg-primary/20 italic">
            
            {/* Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic">INVENTORY <span className="text-primary italic">CORE</span></h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-1">Magnitude Asset Management • Real-time Quantization</p>
                </div>
                <div className="flex gap-4 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none h-14 px-6 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary hover:border-secondary transition-all active:scale-95 shadow-sm">
                        <HiOutlineDownload size={20} />
                        Export Manifest
                    </button>
                    <button 
                        onClick={openAddModal}
                        className="flex-1 lg:flex-none h-14 px-8 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20 active:scale-95"
                    >
                        <HiOutlinePlus size={20} />
                        Inject New Unit
                    </button>
                </div>
            </header>

            {/* Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Magnitude', value: products.length, icon: <HiOutlineCube />, color: 'bg-primary text-white shadow-primary/20' },
                    { label: 'Critically Low', value: products.filter(p => p.stock < 10 && p.stock > 0).length, icon: <HiOutlineExclamationCircle />, color: 'bg-rose-500 text-white shadow-rose-500/20' },
                    { label: 'Stock Cycle Status', value: 'Nominal', icon: <HiOutlineRefresh />, color: 'bg-secondary text-white shadow-secondary/20' },
                ].map((stat, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden group ${stat.color}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[9px] font-black uppercase tracking-[.25em] opacity-60">{stat.label}</span>
                            <span className="text-3xl font-black italic">{stat.value}</span>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">{stat.icon}</div>
                    </div>
                ))}
            </section>

            {/* Table Area */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex gap-2">
                        {['all', 'low', 'out'].map((t) => (
                            <button 
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-secondary text-white shadow-lg shadow-secondary/10' : 'text-gray-400 hover:text-secondary'}`}
                            >
                                {t === 'all' ? 'All Units' : t === 'low' ? 'Low Stock' : 'Out of Mesh'}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <HiOutlineFilter className="hover:text-primary cursor-pointer transition-colors" size={20} />
                        <div className="w-px h-6 bg-slate-100" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{filteredProducts.length} Results</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left italic border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="py-6 px-8">Unit Specification</th>
                                <th className="py-6 px-8">Stock Level</th>
                                <th className="py-6 px-8 text-center">Procurement Value</th>
                                <th className="py-6 px-8 text-center">Status</th>
                                <th className="py-6 px-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="5" className="py-20 text-center animate-pulse text-[10px] font-bold text-gray-300 uppercase tracking-widest">Hydrating Inventory Mesa...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="5" className="py-20 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">No Asset Fragments Detected in this Vector</td></tr>
                            ) : filteredProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                             <div className="w-14 h-14 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 shrink-0 group-hover:scale-110 transition-transform">
                                                <img src={p.image_url} alt="" className="w-full h-full object-contain" />
                                             </div>
                                             <div className="flex flex-col">
                                                <h4 className="text-xs font-black uppercase tracking-tighter text-secondary leading-tight truncate max-w-[200px]">{p.name}</h4>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: #SV-{p.id.toString().slice(-6).toUpperCase()} • {p.category}</p>
                                             </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="w-32 flex flex-col gap-2">
                                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                                <span className={p.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}>{p.stock} Units</span>
                                                <span className="text-gray-300">/ 100</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                                <div className="rounded-full transition-all duration-1000" style={{ width: `${Math.min(p.stock, 100)}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <span className="text-xs font-black text-secondary">${p.price}</span>
                                    </td>
                                    <td className="py-6 px-8 text-center text-[8px]">
                                         <span className={`inline-block px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                                            p.stock === 0 ? 'bg-rose-50 text-rose-500' : 
                                            p.stock < 10 ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-600'
                                         }`}>
                                            {p.stock === 0 ? 'Out of mesh' : p.stock < 10 ? 'Critical' : 'Nominal'}
                                         </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEditModal(p)} className="w-9 h-9 rounded-xl bg-slate-100 text-gray-400 hover:bg-secondary hover:text-white transition-all flex items-center justify-center shadow-sm active:scale-90"><HiOutlinePencil size={18} /></button>
                                            <button onClick={() => handleDelete(p.id)} className="w-9 h-9 rounded-xl bg-slate-100 text-gray-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm active:scale-90"><HiOutlineTrash size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <footer className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/20 italic">
                     <span className="text-[9px] font-black text-gray-300 uppercase tracking-[.3em]">Showing Index {filteredProducts.length > 0 ? '1' : '0'}–{filteredProducts.length} of {products.length} Units</span>
                     <div className="flex items-center gap-3">
                         <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-gray-400 hover:bg-secondary hover:text-white transition-all disabled:opacity-30"><HiOutlineChevronLeft size={20} /></button>
                         <div className="flex gap-1">
                            {[1].map(n => <button key={n} className="w-10 h-10 rounded-xl bg-secondary text-white text-[10px] font-black shadow-lg shadow-secondary/10">{n}</button>)}
                         </div>
                         <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-gray-400 hover:bg-secondary hover:text-white transition-all disabled:opacity-30"><HiOutlineChevronRight size={20} /></button>
                     </div>
                </footer>
            </section>

            {isModalOpen && (
                <ProductModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSave} 
                    product={editingProduct} 
                />
            )}

            <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-[.4em] opacity-50 pb-8 italic">Inventory Grid Neural Sync v2.6 • SoleVora Network</p>

        </div>
    );
};

export default ProductsManagement;
