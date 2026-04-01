import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { 
    HiOutlineHeart, 
    HiHeart,
    HiOutlineShoppingCart,
    HiOutlineArrowRight,
    HiOutlineCollection
} from 'react-icons/hi';

const Category = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryName = queryParams.get('type') || 'All';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Determine if we need to fetch all or specific category
                const url = categoryName === 'All' 
                    ? `http://localhost:5000/api/products` 
                    : `http://localhost:5000/api/products?category=${categoryName}`;
                const response = await fetch(url);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center gap-6 pb-20 font-poppins">
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic animate-pulse">Curating your collection...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f7] font-poppins selection:bg-primary/20 pb-24 pt-10">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                
                {/* Header */}
                <header className="mb-14 pt-8 md:pt-12 text-center flex flex-col items-center animate-fadeIn">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6 border border-black/5 rotate-3 hover:rotate-6 transition-transform">
                        <HiOutlineCollection size={28} />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-secondary italic leading-none mb-4">
                        {categoryName === 'All' ? 'Exclusive' : categoryName} <span className="text-primary">Collection</span>
                    </h1>
                    <p className="max-w-xl text-gray-500 font-medium italic">
                        Discover our range of premium {categoryName === 'All' ? 'footwear' : categoryName.toLowerCase()} engineered for absolute comfort and unparalleled performance.
                    </p>
                </header>

                {/* Grid */}
                {products.length === 0 ? (
                    <div className="bg-white p-16 rounded-[3rem] border border-black/5 text-center flex flex-col items-center shadow-sm -mt-2">
                         <HiOutlineCollection className="text-gray-200 mb-6" size={64} />
                         <h3 className="text-2xl font-black uppercase tracking-tight text-secondary">No assets found</h3>
                         <p className="text-gray-400 font-medium italic mt-2">Try expanding your search parameters or check back during our next drop.</p>
                         <Link to="/products" className="mt-8 px-8 py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1">Explore Full Catalog</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col relative animate-fadeIn">
                                
                                {/* Badges */}
                                <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                                    {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                                        <span className="px-3 py-1 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm animate-pulse flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                            Low Stock
                                        </span>
                                    )}
                                </div>

                                {/* Wishlist */}
                                <button 
                                    className={`absolute top-6 right-6 z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${isInWishlist(product.id) ? 'bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100' : 'bg-white/80 backdrop-blur-md text-gray-400 border border-black/5 hover:bg-gray-50 hover:text-rose-500'}`}
                                    onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                                >
                                    {isInWishlist(product.id) ? <HiHeart size={20} /> : <HiOutlineHeart size={20} />}
                                </button>
                                
                                {/* Image */}
                                <div className="w-full aspect-square bg-[#f7f7f7] rounded-3xl mb-6 flex items-center justify-center p-8 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img 
                                        src={product.image_url} 
                                        alt={product.name} 
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                                                {product.category?.name || 'Footwear'}
                                            </span>
                                            <h3 className="text-lg font-black uppercase tracking-tight text-secondary leading-tight line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-6 flex items-center justify-between">
                                        <span className="text-xl font-black text-secondary">
                                            <span className="text-sm text-gray-400 mr-1">$</span>
                                            {product.price}
                                        </span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => addToCart(product, '9.0')}
                                                className="w-12 h-12 bg-[#f7f7f7] rounded-xl flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 group/btn"
                                                title="Quick Add"
                                            >
                                                <HiOutlineShoppingCart size={20} />
                                            </button>
                                            <Link 
                                                to={`/product/${product.id}`}
                                                className="w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center hover:bg-primary transition-all shadow-sm shadow-secondary/20 active:scale-95 group/link"
                                                title="View Details"
                                            >
                                                <HiOutlineArrowRight size={20} className="group-hover/link:-rotate-45 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;
