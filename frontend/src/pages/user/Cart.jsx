import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState(cartItems.map(item => item.id));

  const toggleSelect = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedItems.length === cartItems.length) setSelectedItems([]);
    else setSelectedItems(cartItems.map(item => item.id));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/shipping');
  };

  const recommendations = [
    { id: 101, name: "Neon Flux Z", brand: "SOLE VORA", price: 189, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=400" },
    { id: 102, name: "Urban Edge Low", brand: "SOLE VORA", price: 145, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400" },
    { id: 103, name: "Cloud Walker 2", brand: "SOLE VORA", price: 120, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" },
    { id: 104, name: "Trail Blazer X", brand: "SOLE VORA", price: 165, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=400" },
  ];

  return (
    <div className="bg-white min-h-screen font-manrope">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        {/* Header */}
        <header className="py-10 border-b border-gray-100 mb-8">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-black flex items-center gap-3">
                <div className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-xl">
                   <span className="material-symbols-outlined text-xl">shopping_bag</span>
                </div>
                MY CART
                <span className="text-primary text-sm font-bold">({cartItems.length} ITEMS)</span>
             </h2>
             <button onClick={selectAll} className="text-sm font-bold hover:text-primary transition-colors">
                {selectedItems.length === cartItems.length ? 'DESELECT ALL' : 'SELECT ALL'}
             </button>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-16 items-start mb-20">
          
          {/* Cart Items List */}
          <div className="flex flex-col gap-6 w-full">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-6 animate-fadeIn">
                 <div className="text-gray-200 text-8xl">🛍️</div>
                 <p className="text-lg text-gray-500 font-bold italic">Your cart is feeling a bit empty...</p>
                 <Link to="/home" className="px-10 py-3 bg-black text-white rounded-xl font-black text-sm hover:bg-primary transition-all shadow-lg">CONTINUE SHOPPING</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[calc(100vh-300px)] lg:max-h-none scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {cartItems.map((item) => (
                  <article key={item.id} className="relative bg-card-beige rounded-2xl p-4 flex items-center gap-4 group transition-all hover:shadow-md">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-primary/5">
                       <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-grow min-w-0">
                       <h3 className="text-sm font-black truncate uppercase tracking-tight">{item.name}</h3>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Size: {item.size} • Qty: {item.quantity}</p>
                       <div className="flex items-center justify-between mt-3 gap-2">
                          <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 border border-gray-100/50 shadow-sm">
                             <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-primary font-black hover:bg-primary/10 rounded-md transition-colors">-</button>
                             <span className="text-xs font-black min-w-[20px] text-center">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-primary font-black hover:bg-primary/10 rounded-md transition-colors">+</button>
                          </div>
                          <span className="text-sm font-black whitespace-nowrap">${item.price * item.quantity}</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                       <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </article>
                ))}
              </div>
            )}

            {/* Sub-Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 text-xs font-black uppercase tracking-widest">
               <Link to="/home" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Shop
               </Link>
               <button onClick={() => navigate('/category')} className="text-primary hover:underline">
                  Add more items
               </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:sticky lg:top-24 bg-gray-50 rounded-[2rem] p-8 flex flex-col gap-6 shadow-sm ring-1 ring-black/5">
             <h3 className="text-lg font-black uppercase tracking-widest mb-2">Order Summary</h3>
             <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tight">
                   <span>Subtotal</span>
                   <span>${cartTotal}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tight">
                   <span>Tax (Estimated)</span>
                   <span>$0.00</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tight">
                   <span>Shipping</span>
                   <span className="text-green-600 font-black">FREE</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline">
                   <span className="text-sm font-black uppercase tracking-widest">Total</span>
                   <span className="text-2xl font-black">${cartTotal}</span>
                </div>
             </div>

             <button 
               onClick={handleCheckout}
               disabled={cartItems.length === 0}
               className="w-full h-14 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-[#e85a1e] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none mt-4 flex items-center justify-center gap-2"
             >
                <span className="material-symbols-outlined text-lg">payments</span>
                CHECKOUT NOW
             </button>

             <div className="flex justify-center gap-3 opacity-30 mt-4 grayscale group-hover:grayscale-0 transition-all">
                <div className="w-8 h-5 bg-black rounded-sm" />
                <div className="w-8 h-5 bg-black rounded-sm" />
                <div className="w-8 h-5 bg-black rounded-sm" />
                <div className="w-8 h-5 bg-black rounded-sm" />
             </div>
          </aside>

        </div>

        {/* Recommendations */}
        <section className="bg-card-beige rounded-[3rem] py-16 px-10 mb-20 overflow-hidden relative">
           <div className="text-center mb-12">
              <h2 className="text-2xl font-black uppercase tracking-widest">Recommended for You</h2>
              <p className="text-sm text-gray-400 font-bold italic mt-1 uppercase tracking-tight">Style matches your vibe</p>
           </div>

           <Swiper
             modules={[Navigation, Pagination, Scrollbar, A11y]}
             spaceBetween={30}
             slidesPerView={1}
             navigation={{ prevEl: '.prev-btn', nextEl: '.next-btn' }}
             pagination={{ clickable: true }}
             breakpoints={{
               640: { slidesPerView: 2 },
               1024: { slidesPerView: 4 }
             }}
             className="pb-16"
           >
             {recommendations.map(item => (
               <SwiperSlide key={item.id}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col group">
                     <div className="aspect-[1.5] bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                     </div>
                     <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                           <span className="text-[10px] font-black text-primary tracking-widest uppercase">{item.brand}</span>
                           <h4 className="text-sm font-black mt-1 leading-none truncate uppercase tracking-tight">{item.name}</h4>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                           <span className="text-sm font-black">${item.price}</span>
                           <button className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg hover:bg-primary transition-colors">
                              <span className="material-symbols-outlined text-sm">add</span>
                           </button>
                        </div>
                     </div>
                  </div>
               </SwiperSlide>
             ))}
           </Swiper>

           <div className="flex justify-center items-center gap-6 mt-6">
              <button className="prev-btn w-12 h-12 rounded-full border border-black/10 flex items-center justify-center bg-white text-secondary hover:bg-primary hover:text-white hover:border-transparent transition-all shadow-sm">
                 <span className="material-symbols-outlined">west</span>
              </button>
              <button className="next-btn w-12 h-12 rounded-full border border-black/10 flex items-center justify-center bg-white text-secondary hover:bg-primary hover:text-white hover:border-transparent transition-all shadow-sm">
                 <span className="material-symbols-outlined">east</span>
              </button>
           </div>
        </section>

      </div>
    </div>
  );
};

export default Cart;
