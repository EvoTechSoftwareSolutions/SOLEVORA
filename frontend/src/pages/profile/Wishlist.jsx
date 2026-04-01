import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { 
    MdOutlineSearch, 
    MdOutlineNotificationsNone, 
    MdOutlineIosShare, 
    MdOutlineClose, 
    MdOutlineShoppingCart, 
    MdOutlineSentimentVeryDissatisfied,
    MdOutlineAutoAwesome
} from "react-icons/md";

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredItems = wishlistItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-12 relative z-10 animate-fadeIn">
            
            {/* Header */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic">CURATED <span className="text-primary italic">ARCHIVE</span></h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-1">Personal Collection • Priority Drops Enabled</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative flex-1 sm:w-64 group">
                        <MdOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-xl" />
                        <input 
                            type="text" 
                            placeholder="SEARCH ARCHIVE..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-[1.25rem] outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-black text-[10px] uppercase tracking-widest italic"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95">
                            <MdOutlineNotificationsNone size={24} />
                        </button>
                        <button className="flex-1 sm:flex-none h-14 bg-primary text-white px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#c96c2a] transition-all shadow-xl shadow-primary/20 active:scale-95 italic">
                            Share Vault
                            <MdOutlineIosShare size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Wishlist Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredItems.map((item) => (
                        <article key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-2 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                            
                            {/* Remove Trigger */}
                            <button 
                                onClick={() => removeFromWishlist(item.id)}
                                className="absolute top-6 right-6 w-10 h-10 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 hover:bg-rose-500 hover:text-white shadow-lg"
                            >
                                <MdOutlineClose size={20} />
                            </button>

                            {/* Image Visual */}
                            <div className="bg-slate-50 rounded-[2rem] p-8 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-6 transition-all duration-700" />
                                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-secondary">In Stock</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 pt-8 flex flex-col gap-6">
                                <div className="flex justify-between items-start gap-4">
                                     <h3 className="text-sm font-black uppercase tracking-tighter text-secondary leading-tight italic line-clamp-2">{item.name}</h3>
                                     <span className="text-lg font-black text-primary italic italic">${item.price}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Core Collection • EU Range Enabled</p>
                                </div>
                                <button 
                                    onClick={() => addToCart(item)}
                                    className="w-full h-14 bg-secondary text-white rounded-2xl font-black text-[10px] uppercase tracking-[.2em] flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl active:scale-95 italic"
                                >
                                    Deploy to Cart
                                    <MdOutlineShoppingCart size={18} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-6 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 animate-pulse">
                    <MdOutlineSentimentVeryDissatisfied size={64} className="text-gray-300" />
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xl font-black uppercase tracking-tighter text-gray-400 italic">Archive Empty</h4>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">No items currently stored in your secure vault.</p>
                    </div>
                    <Link to="/category" className="mt-4 px-10 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-widest hover:text-primary transition-all shadow-sm italic">
                        Begin Curation
                        <MdOutlineAutoAwesome className="ml-3 text-primary" />
                    </Link>
                </div>
            )}

            {/* Footer */}
            {filteredItems.length > 0 && (
                <footer className="mt-12 flex flex-col items-center gap-6">
                     <button className="px-10 h-14 border-2 border-slate-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all active:scale-95 italic">Load Next Batch</button>
                     <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[.3em] italic">Vault Synchronized • 2026 SoleVora Neural Network</p>
                </footer>
            )}

        </div>
    );
};

export default Wishlist;
