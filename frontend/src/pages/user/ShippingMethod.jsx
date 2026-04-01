import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ShippingMethod = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal } = useCart();
    const [selectedMethod, setSelectedMethod] = useState("Standard");

    const shippingMethods = [
        { id: "Standard", name: "Standard Delivery", time: "3-5 Business Days", price: "Free" },
        { id: "Express", name: "Express Shipping", time: "1-2 Business Days", price: "$15.00" },
        { id: "SameDay", name: "Same Day Delivery", time: "Today", price: "$25.00" }
    ];

    return (
        <div className="bg-[#f5f0ea] min-h-screen py-8 md:py-16 font-manrope text-secondary select-none">
            <div className="max-w-[1080px] mx-auto px-4 md:px-6">
                
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 mb-6 text-[11px] md:text-sm">
                   <Link to="/shipping" className="text-secondary font-bold hover:text-primary transition-colors">Information</Link>
                   <span className="text-gray-400">/</span>
                   <span className="font-black text-primary">Shipping Method</span>
                </nav>

                {/* Checkout Stepper */}
                <div className="max-w-[600px] mx-auto mb-12">
                   <div className="flex items-center justify-between mb-2">
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm shadow-xl shadow-primary/30">1</div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Info</span>
                       </div>
                       <div className="flex-grow h-1 bg-primary mx-4 -mt-6 rounded-full" />
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm shadow-xl shadow-primary/30 ring-4 ring-white">2</div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Ship</span>
                       </div>
                       <div className="flex-grow h-1 bg-white mx-4 -mt-6 rounded-full" />
                       <div className="flex flex-col items-center gap-2 opacity-30">
                          <div className="w-10 h-10 rounded-full bg-white text-gray-400 flex items-center justify-center font-black text-sm">3</div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Pay</span>
                       </div>
                   </div>
                   <p className="text-center text-[11px] text-gray-400 font-bold uppercase tracking-widest">Step 2: How fast do you want your kicks?</p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Shipping Methods */}
                    <main className="lg:col-span-8 flex flex-col gap-8 animate-fadeIn">
                       <h2 className="text-2xl font-black uppercase tracking-tight">Select Delivery Speed</h2>
                       
                       <div className="flex flex-col gap-4">
                          {shippingMethods.map(method => (
                             <div 
                               key={method.id}
                               onClick={() => setSelectedMethod(method.id)}
                               className={`bg-white border-2 rounded-2xl p-6 flex justify-between items-center cursor-pointer transition-all ${selectedMethod === method.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-gray-100 hover:border-primary/30'}`}
                             >
                                <div className="flex items-center gap-5">
                                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === method.id ? 'bg-primary border-primary' : 'border-gray-200'}`}>
                                      {selectedMethod === method.id && <span className="material-symbols-outlined text-white text-base font-black">check</span>}
                                   </div>
                                   <div className="flex flex-col gap-1">
                                      <h4 className="text-base font-black uppercase tracking-tight leading-none">{method.name}</h4>
                                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{method.time}</p>
                                   </div>
                                </div>
                                <span className={`text-sm font-black ${selectedMethod === method.id ? 'text-primary' : 'text-secondary'}`}>{method.price}</span>
                             </div>
                          ))}
                       </div>

                       <div className="pt-8 flex flex-col sm:flex-row items-center gap-8">
                          <Link to="/shipping" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors">
                             <span className="material-symbols-outlined text-[18px]">west</span>
                             Back to Address
                          </Link>
                          <button 
                             onClick={() => navigate('/payment')}
                             className="px-12 h-14 bg-black text-white rounded-full font-black text-sm flex items-center gap-3 hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95 group"
                          >
                             CONTINUE TO PAYMENT
                             <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">east</span>
                          </button>
                       </div>
                    </main>

                    {/* Right: Order Summary Sidebar */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-8 flex flex-col gap-6 min-w-0">
                       <div className="bg-[#fde8cc] rounded-[2rem] p-8 flex flex-col gap-6 shadow-sm border border-orange-200/50">
                          <h3 className="text-lg font-black uppercase tracking-widest">Summary</h3>
                          
                          {/* Item Scroll Strip */}
                          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                             {cartItems.map((item, idx) => (
                               <div key={idx} className="snap-center bg-white rounded-2xl p-3 min-w-[180px] flex flex-col gap-2 shadow-sm border border-orange-100">
                                  <div className="relative w-16 h-14 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                                     <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                     <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white text-[9px] font-black flex items-center justify-center rounded-full ring-2 ring-white">{item.quantity}</span>
                                  </div>
                                  <div>
                                     <h4 className="text-[10px] font-black uppercase truncate tracking-tight">{item.name}</h4>
                                     <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">EU {item.size}</p>
                                  </div>
                                  <div className="flex justify-between items-center mt-1">
                                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Qty: {item.quantity}</span>
                                     <span className="text-sm font-black font-manrope">${item.price * item.quantity}</span>
                                  </div>
                               </div>
                             ))}
                          </div>

                          {/* Price Rows */}
                          <div className="space-y-3 pt-4 border-t border-orange-200/50 uppercase tracking-tighter">
                             <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span>Subtotal</span>
                                <span className="text-secondary font-black">${cartTotal}</span>
                             </div>
                             <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span>Shipping</span>
                                <span className="text-green-600 font-black tracking-widest italic">{selectedMethod === "Standard" ? "FREE" : shippingMethods.find(m => m.id === selectedMethod)?.price}</span>
                             </div>
                             <div className="pt-4 border-t-2 border-orange-300/30 flex justify-between items-baseline">
                                <span className="text-sm font-black">Final Total</span>
                                <span className="text-2xl font-black text-primary">${cartTotal + (selectedMethod === "Express" ? 15 : selectedMethod === "SameDay" ? 25 : 0)}</span>
                             </div>
                          </div>

                          <button className="w-full h-14 bg-primary text-white rounded-full font-black text-sm shadow-lg shadow-primary/30 hover:bg-[#c96c2a] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                             <span className="material-symbols-outlined text-lg">lock</span>
                             Place Order
                          </button>

                          <p className="text-[9px] text-gray-400 text-center font-bold uppercase leading-relaxed tracking-tight px-4 opacity-50">
                             Secured by SoleVora Pay. Data is encrypted.
                          </p>
                       </div>
                    </aside>

                </div>

            </div>
        </div>
    );
};

export default ShippingMethod;
