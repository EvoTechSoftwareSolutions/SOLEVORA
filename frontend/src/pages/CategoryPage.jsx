import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const CategoryPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const query = new URLSearchParams(location.search);
    const categoryType = query.get("type") || "All";

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const endpoint = categoryType === "All" 
                    ? "http://localhost:5000/api/products" 
                    : `http://localhost:5000/api/products?category=${encodeURIComponent(categoryType)}`;
                const response = await axios.get(endpoint);
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryType]);

    if (loading) {
        return (
            <div className="py-24 text-center">
                <div className="flex justify-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="mt-4 text-sm font-bold text-gray-400 font-manrope">FINDING THE BEST KICKS...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-24 text-center">
                <p className="text-red-500 font-bold">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-secondary text-white rounded-lg">Try Again</button>
            </div>
        );
    }

    return (
        <div className="bg-bg-light min-h-[80vh] py-16 px-6 lg:px-10">
            <div className="max-w-[1200px] mx-auto">
                
                {/* Header */}
                <header className="mb-12">
                   <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase block mb-2">{categoryType === "All" ? "Collection" : "Gallery"}</span>
                   <h1 className="text-4xl font-black uppercase leading-none mb-4">{categoryType} Products</h1>
                   <p className="text-sm text-gray-500 max-w-xl font-medium leading-relaxed italic">Explore our curated selection of premium footwear. From high-performance sportswear to everyday comfort, find the pair that matches your pace.</p>
                </header>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-gray-400 font-bold italic">No products found for this category.</div>
                    ) : (
                        products.map(product => (
                            <article key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group relative">
                                
                                {/* Image Box */}
                                <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-100/50">
                                   <div className="absolute top-4 left-4 z-10">
                                      <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">New</span>
                                   </div>
                                   <button 
                                      onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                                      className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${isInWishlist(product.id) ? 'bg-rose-50 text-rose-600' : 'bg-white text-gray-400 hover:text-primary active:scale-125'}`}
                                   >
                                      <span className={`material-symbols-outlined text-[18px] ${isInWishlist(product.id) ? 'fill-current' : ''}`}>favorite</span>
                                   </button>
                                   <Link to={`/product/${product.id}`} className="block w-full h-full">
                                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                                   </Link>
                                </div>

                                {/* Details */}
                                <div className="p-6 flex flex-col flex-grow">
                                   <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">{product.category_name}</span>
                                   <h3 className="text-sm font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors truncate">{product.name}</h3>
                                   
                                   <div className="mt-auto flex items-center justify-between gap-4">
                                      <span className="text-lg font-black">${product.price}</span>
                                      <div className="flex gap-2">
                                         <Link to={`/product/${product.id}`} className="px-4 py-2 border-2 border-secondary rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-secondary hover:text-white transition-all">VIEW</Link>
                                         <button 
                                            onClick={() => addToCart(product)}
                                            className="w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center hover:bg-primary transition-all shadow-md active:scale-90"
                                         >
                                            <span className="material-symbols-outlined text-lg">shopping_cart</span>
                                         </button>
                                      </div>
                                   </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default CategoryPage;