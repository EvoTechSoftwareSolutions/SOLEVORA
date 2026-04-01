import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ShippingInformation = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal } = useCart();
    const [promoCode, setPromoCode] = useState("");
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "",
        address: "", city: "", zipCode: "", country: "USA"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContinue = (e) => {
        e.preventDefault();
        // Here you would typically save the shipping data to context or state
        navigate('/shipping-method');
    };

    return (
        <div className="bg-[#f5f0ea] min-h-screen py-4 md:py-10 font-manrope text-secondary select-none">
            <div className="max-w-[1080px] mx-auto px-4 md:px-6">
                
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 mb-6 text-[11px] md:text-sm">
                   <Link to="/cart" className="text-secondary font-bold hover:text-primary transition-colors">Cart</Link>
                   <span className="text-gray-400">/</span>
                   <span className="font-black text-primary">Shipping Info</span>
                </nav>

                {/* Checkout Stepper */}
                <div className="max-w-[600px] mx-auto mb-10">
                   <div className="flex items-center justify-between mb-2">
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm shadow-xl shadow-primary/30 ring-4 ring-white">1</div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Info</span>
                       </div>
                       <div className="flex-grow h-1 bg-white mx-4 -mt-6 rounded-full overflow-hidden">
                          <div className="w-0 h-full bg-primary" />
                       </div>
                       <div className="flex flex-col items-center gap-2 opacity-30">
                          <div className="w-10 h-10 rounded-full bg-white text-gray-400 flex items-center justify-center font-black text-sm">2</div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Ship</span>
                       </div>
                       <div className="flex-grow h-1 bg-white mx-4 -mt-6 rounded-full overflow-hidden">
                          <div className="w-0 h-full bg-primary" />
                       </div>
                       <div className="flex flex-col items-center gap-2 opacity-30">
                          <div className="w-10 h-10 rounded-full bg-white text-gray-400 flex items-center justify-center font-black text-sm">3</div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Pay</span>
                       </div>
                   </div>
                   <p className="text-center text-[11px] text-gray-400 font-bold uppercase tracking-widest">Step 1: Where should we send your pair?</p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left: Shipping Form */}
                    <main className="lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-black/5 animate-fadeIn">
                       <header className="flex items-center gap-3 mb-8">
                          <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                          <h2 className="text-xl font-black uppercase tracking-tight">Shipping Details</h2>
                       </header>

                       <form onSubmit={handleContinue} className="flex flex-col gap-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex flex-col gap-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">First Name</label>
                                 <input 
                                    name="firstName" type="text" placeholder="John" required
                                    className="h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all text-sm font-medium"
                                 />
                              </div>
                              <div className="flex flex-col gap-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Last Name</label>
                                 <input 
                                    name="lastName" type="text" placeholder="Doe" required
                                    className="h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all text-sm font-medium"
                                 />
                              </div>
                           </div>

                           <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                              <input 
                                 name="email" type="email" placeholder="john@example.com" required
                                 className="h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all text-sm font-medium"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                              <input 
                                 name="address" type="text" placeholder="123 Luxury Lane" required
                                 className="h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all text-sm font-medium"
                              />
                           </div>

                           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                              <div className="flex flex-col gap-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">City</label>
                                 <input 
                                    name="city" type="text" placeholder="New York" required
                                    className="h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all text-sm font-medium"
                                 />
                              </div>
                              <div className="flex flex-col gap-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Zip Code</label>
                                 <input 
                                    name="zipCode" type="text" placeholder="10001" required
                                    className="h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all text-sm font-medium"
                                 />
                              </div>
                              <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Country</label>
                                 <select className="h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl font-medium outline-none text-sm appearance-none cursor-pointer">
                                    <option>USA</option>
                                    <option>Srilanka</option>
                                    <option>UK</option>
                                    <option>Canada</option>
                                 </select>
                              </div>
                           </div>

                           <div className="pt-6 flex justify-center">
                              <button type="submit" className="px-10 h-14 bg-black text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95 group">
                                 CONTINUE TO SHIPPING
                                 <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">east</span>
                              </button>
                           </div>
                       </form>
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

                          {/* Promo Code */}
                          <div className="flex gap-2">
                             <input 
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="PROMO CODE"
                                className="flex-grow h-12 px-4 bg-white rounded-xl text-xs font-black uppercase tracking-widest outline-none border border-transparent focus:border-primary/30 transition-all placeholder:opacity-30"
                             />
                             <button className="h-12 px-6 bg-secondary text-white rounded-xl text-xs font-black hover:bg-black transition-all">APPLY</button>
                          </div>

                          {/* Price Rows */}
                          <div className="space-y-3 pt-4 border-t border-orange-200/50 uppercase tracking-tighter">
                             <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span>Subtotal</span>
                                <span className="text-secondary font-black">${cartTotal}</span>
                             </div>
                             <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span>Shipping</span>
                                <span className="text-green-600 font-black tracking-widest italic">FREE</span>
                             </div>
                             <div className="pt-4 border-t-2 border-orange-300/30 flex justify-between items-baseline">
                                <span className="text-sm font-black">Final Total</span>
                                <span className="text-2xl font-black text-primary">${cartTotal}</span>
                             </div>
                          </div>

                          <button className="w-full h-14 bg-primary text-white rounded-full font-black text-sm shadow-lg shadow-primary/30 hover:bg-[#c96c2a] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                             <span className="material-symbols-outlined text-lg">lock</span>
                             Place Order
                          </button>

                          <p className="text-[9px] text-gray-400 text-center font-bold uppercase leading-relaxed tracking-tight px-4">
                             By placing your order, you agree to SoleVora's <Link to="/privacy-policy" className="underline hover:text-primary">Terms of Service</Link> and <Link to="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
                          </p>
                       </div>
                    </aside>

                </div>

            </div>
        </div>
    );
};

export default ShippingInformation;
