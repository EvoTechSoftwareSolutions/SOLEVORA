import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  
  // Review state
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewStatus, setReviewStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${id}`),
          axios.get(`http://localhost:5000/api/products/${id}/reviews`)
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data);
      } catch (err) {
        console.error("Error fetching product data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/products/${id}/reviews`, newReview, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setReviews([response.data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      setReviewStatus({ type: 'success', msg: 'Review submitted successfully!' });
    } catch (err) {
      setReviewStatus({ type: 'error', msg: err.response?.data?.message || 'Error submitting review.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setReviewStatus({ type: '', msg: '' }), 5000);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading Product...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-red-500">Product not found</div>;

  const images = product.image_url ? [product.image_url, ...product.additional_images || []] : [];
  const sizes = [38, 39, 40, 41, 42, 43, 44, 45];

  return (
    <div className="bg-bg-light min-h-screen font-outfit pb-24">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 py-6 text-sm text-gray-500">
          <Link to="/home" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/category" className="hover:text-primary transition-colors">{product.category_name}</Link>
          <span>/</span>
          <span className="font-bold text-primary">{product.name}</span>
        </nav>

        {/* Product Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 items-start">
          
          {/* Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white rounded-2xl overflow-hidden aspect-[1.5] border border-primary/5 shadow-sm">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImg(idx)}
                  className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImg === idx ? 'border-primary' : 'border-primary/10 hover:border-primary/50'}`}
                >
                  <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
            <div>
              <span className="text-primary text-[11px] font-black uppercase tracking-widest block mb-2">{product.brand || 'SoleVora'}</span>
              <h1 className="text-3xl font-black leading-none mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex text-primary">
                   {"★".repeat(Math.round(product.avg_rating || 5)) + "☆".repeat(5 - Math.round(product.avg_rating || 5))}
                </div>
                <span className="text-gray-400 text-xs font-medium">({reviews.length} reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black">${product.price}</span>
              {product.old_price && <span className="text-gray-400 line-through text-lg font-medium">${product.old_price}</span>}
            </div>

            <p className="text-gray-600 text-[13px] leading-relaxed italic">{product.description}</p>

            {/* Size Selector */}
            <div className="flex flex-col gap-3">
               <div className="flex justify-between text-[11px] font-black uppercase tracking-wider text-gray-400">
                  <span>Select Size (EU)</span>
                  <Link to="/size-chart" className="text-primary hover:underline">Size Guide</Link>
               </div>
               <div className="grid grid-cols-4 gap-2">
                 {sizes.map(size => (
                   <button 
                     key={size}
                     onClick={() => setSelectedSize(size)}
                     className={`h-11 rounded-xl font-bold text-sm border transition-all ${selectedSize === size ? 'bg-primary/5 border-primary text-primary font-black scale-105' : 'bg-white border-primary/20 text-secondary hover:border-primary/50'}`}
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => addToCart(product, selectedSize)}
                className="w-full h-[52px] bg-primary text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-[#e85a1e] hover:-translate-y-1 transition-all"
              >
                <span className="material-symbols-outlined text-lg">shopping_cart</span>
                ADD TO CART
              </button>
              <button 
                onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`w-full h-[52px] rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${isInWishlist(product.id) ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300'}`}
              >
                <span className={`material-symbols-outlined text-lg ${isInWishlist(product.id) ? 'fill-current' : ''}`}>favorite</span>
                {isInWishlist(product.id) ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
              </button>
            </div>

            {/* Features Strip */}
            <div className="flex gap-8 pt-8 border-t border-gray-100">
               <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                  <span className="material-symbols-outlined text-primary text-base">local_shipping</span>
                  Free Delivery
               </div>
               <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                  <span className="material-symbols-outlined text-primary text-base">verified_user</span>
                  Original Product
               </div>
            </div>
          </div>
        </div>

        {/* Tabs System */}
        <div className="mt-16">
          <nav className="flex flex-wrap gap-6 md:gap-10 px-4 md:px-10 border-b border-gray-200 justify-center md:justify-start">
            {['description', 'specifications', 'reviews'].map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`py-4 text-xs md:sm font-bold uppercase tracking-widest relative transition-all ${activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 {tab}
                 {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />}
               </button>
            ))}
          </nav>

          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#fdf6e9] py-16 px-6 lg:px-0">
             <div className="max-w-[1100px] mx-auto">
               
               {activeTab === 'description' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center animate-fadeIn">
                   <div className="flex flex-col gap-6">
                      <h2 className="text-2xl font-black">Craftsmanship for Your Performance</h2>
                      <p className="text-sm text-gray-600 leading-relaxed italic">{product.long_description || "Every pair is crafted with attention to detail, giving you reliable performance, long-lasting quality and comfort in every step."}</p>
                      <ul className="space-y-4">
                         {["Premium breathable materials", "High-grip durable outsoles", "Shock-absorption technology", "Anatomical comfort fit"].map((feat, i) => (
                           <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
                              <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                              {feat}
                           </li>
                         ))}
                      </ul>
                   </div>
                   <div className="rounded-2xl overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
                      <img src={product.image_url} alt="Product Lifestyle" className="w-full" />
                   </div>
                 </div>
               )}

               {activeTab === 'specifications' && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fadeIn">
                    {[
                      { l: "Material", v: product.material || "Synthetic / Leather" },
                      { l: "Outsole", v: "Durable Rubber" },
                      { l: "Closer", v: product.closer || "Lace-up" },
                      { l: "Gender", v: product.gender || "Unisex" },
                      { l: "Style", v: product.style || "Sneaker" },
                      { l: "Occasion", v: "Sport / Casual" },
                      { l: "Origin", v: "Premium Quality" },
                      { l: "SKU", v: `SV-${product.id}X` },
                    ].map((spec, i) => (
                      <div key={i} className="border-b border-primary/10 pb-4">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{spec.l}</span>
                        <p className="font-bold text-secondary mt-1">{spec.v}</p>
                      </div>
                    ))}
                 </div>
               )}

               {activeTab === 'reviews' && (
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start animate-fadeIn">
                    <div className="lg:col-span-7 flex flex-col gap-6">
                       <h3 className="text-xl font-black mb-4">Customer Opinions ({reviews.length})</h3>
                       {reviews.length === 0 ? (
                         <div className="p-10 bg-white rounded-2xl text-center text-gray-400 italic font-medium">No reviews yet. Be the first!</div>
                       ) : (
                         reviews.map(r => (
                           <div key={r.id} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 hover:-translate-y-1 transition-all group">
                             <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-col">
                                   <span className="font-black text-sm">{r.user_name}</span>
                                   <div className="flex text-primary text-xs">{"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}</div>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{new Date(r.created_at).toLocaleDateString()}</span>
                             </div>
                             <p className="text-sm text-gray-600 leading-relaxed italic group-hover:text-black transition-colors">"{r.comment}"</p>
                           </div>
                         ))
                       )}
                    </div>

                    <div className="lg:col-span-5 bg-white p-10 rounded-[2rem] border border-primary/10 shadow-xl lg:sticky lg:top-40">
                       <h3 className="text-lg font-black mb-8 uppercase tracking-widest text-center">Write a Review</h3>
                       {reviewStatus.msg && (
                         <div className={`mb-6 p-4 rounded-xl text-xs font-bold text-center border ${reviewStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                           {reviewStatus.msg}
                         </div>
                       )}
                       {isLoggedIn ? (
                         <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col items-center">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Your Rating</label>
                               <div className="flex gap-2">
                                 {[1,2,3,4,5].map(s => (
                                   <button 
                                     key={s} 
                                     type="button" 
                                     onClick={() => setNewReview({...newReview, rating: s})}
                                     className={`text-3xl transition-all hover:scale-125 ${newReview.rating >= s ? 'text-primary' : 'text-gray-200'}`}
                                   >
                                     <span className={`material-symbols-outlined text-4xl ${newReview.rating >= s ? 'fill-1' : ''}`}>star</span>
                                   </button>
                                 ))}
                               </div>
                            </div>
                            <div className="flex flex-col">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Your Comment</label>
                               <textarea 
                                 value={newReview.comment}
                                 onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                 className="w-full p-5 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all text-sm h-32"
                                 placeholder="Tell us about the fit and comfort..."
                                 required
                               />
                            </div>
                            <button 
                              disabled={isSubmitting}
                              className="h-14 bg-black text-white font-black rounded-2xl hover:bg-primary transition-all disabled:opacity-50"
                            >
                              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                            </button>
                         </form>
                       ) : (
                         <div className="text-center py-6">
                            <p className="text-gray-500 text-sm italic mb-6">Please sign in to share your experience with this product.</p>
                            <Link to="/login" className="px-10 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all">SIGN IN</Link>
                         </div>
                       )}
                    </div>
                 </div>
               )}

             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
