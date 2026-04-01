import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const PaymentDetails = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal } = useCart();
    const [selectedMethod, setSelectedMethod] = useState("Credit Card");
    const [formData, setFormData] = useState({
        cardName: "", cardNumber: "", expiry: "", cvv: ""
    });

    const paymentMethods = [
        { id: "Card", name: "Credit Card", icon: "credit_card", sub: "Visa / Master" },
        { id: "Paypal", name: "PayPal", icon: "account_balance_wallet", sub: "e-Wallet" },
        { id: "Crypto", name: "Crypto", icon: "currency_bitcoin", sub: "Web3" },
        { id: "Cash", name: "Cash on Delivery", icon: "payments", sub: "Local" }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically process the payment
        navigate('/order-confirmation');
    };

    return (
        <div className="bg-[#f5f0ea] min-h-screen py-8 md:py-16 font-manrope text-secondary select-none">
            <div className="max-w-[1080px] mx-auto px-4 md:px-6">
                
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 mb-6 text-[11px] md:text-sm">
                   <Link to="/shipping-method" className="text-secondary font-bold hover:text-primary transition-colors">Shipping</Link>
                   <span className="text-gray-400">/</span>
                   <span className="font-black text-primary">Payment Details</span>
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
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm shadow-xl shadow-primary/30">2</div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Ship</span>
                       </div>
                       <div className="flex-grow h-1 bg-primary mx-4 -mt-6 rounded-full" />
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm shadow-xl shadow-primary/30 ring-4 ring-white">3</div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pay</span>
                       </div>
                   </div>
                   <p className="text-center text-[11px] text-gray-400 font-bold uppercase tracking-widest">Step 3: Secure your purchase</p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Payment Content */}
                    <main className="lg:col-span-8 flex flex-col gap-8 animate-fadeIn">
                       <div>
                          <h2 className="text-2xl font-black uppercase tracking-tight">Payment Method</h2>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">All transactions are secure and encrypted.</p>
                       </div>

                       {/* Method Grid */}
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {paymentMethods.map(method => (
                             <div 
                               key={method.id}
                               onClick={() => setSelectedMethod(method.name)}
                               className={`bg-white border-2 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${selectedMethod === method.name ? 'border-primary bg-primary/5 shadow-lg' : 'border-gray-100 hover:border-primary/30 over:scale-105'}`}
                             >
                                <span className={`material-symbols-outlined text-2xl ${selectedMethod === method.name ? 'text-primary' : 'text-gray-400'}`}>{method.icon}</span>
                                <div className="text-center">
                                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{method.sub}</span>
                                   <span className="text-xs font-black uppercase tracking-tight">{method.name}</span>
                                </div>
                             </div>
                          ))}
                       </div>

                       {/* Form Section */}
                       <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 flex flex-col gap-6">
                          <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cardholder Name</label>
                             <input 
                                type="text" placeholder="JOHN DOE" required
                                className="h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all text-sm font-medium uppercase placeholder:normal-case"
                             />
                          </div>

                          <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Card Number</label>
                             <div className="relative flex items-center">
                                <input 
                                   type="text" placeholder="0000 0000 0000 0000" required
                                   className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all text-sm font-medium"
                                />
                                <span className="absolute right-4 material-symbols-outlined text-gray-300">credit_card</span>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                             <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Expiry Date</label>
                                <input 
                                   type="text" placeholder="MM / YY" required
                                   className="h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all text-sm font-medium"
                                />
                             </div>
                             <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">CVV / CVC</label>
                                <div className="relative flex items-center">
                                   <input 
                                      type="password" placeholder="***" required maxLength="3"
                                      className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all text-sm font-medium"
                                   />
                                   <span className="absolute right-4 material-symbols-outlined text-gray-300">lock</span>
                                </div>
                             </div>
                          </div>

                          <div className="flex items-center gap-3 ml-1">
                             <input type="checkbox" id="saveCard" className="w-4 h-4 accent-primary rounded cursor-pointer" />
                             <label htmlFor="saveCard" className="text-xs font-bold text-gray-400 select-none cursor-pointer">Save card details for future purchases</label>
                          </div>
                       </div>

                       <div className="pt-4 flex flex-col sm:flex-row items-center gap-8">
                          <Link to="/shipping-method" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors">
                             <span className="material-symbols-outlined text-[18px]">west</span>
                             Back to Shipping
                          </Link>
                          <button 
                             onClick={handleSubmit}
                             className="px-12 h-14 bg-black text-white rounded-full font-black text-sm flex items-center gap-3 hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95 group"
                          >
                             COMPLETE PURCHASE
                             <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">verified</span>
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
                                <span className="text-green-600 font-black tracking-widest italic">FREE</span>
                             </div>
                             <div className="pt-4 border-t-2 border-orange-300/30 flex justify-between items-baseline">
                                <span className="text-sm font-black">Final Total</span>
                                <span className="text-2xl font-black text-primary">${cartTotal}</span>
                             </div>
                          </div>

                          <div className="flex justify-center gap-3 opacity-30 mt-4 grayscale group-hover:grayscale-0 transition-all">
                             <div className="w-10 h-6 bg-black rounded-sm" />
                             <div className="w-10 h-6 bg-black rounded-sm" />
                             <div className="w-10 h-6 bg-black rounded-sm" />
                             <div className="w-10 h-6 bg-black rounded-sm" />
                          </div>

                          <p className="text-[9px] text-gray-400 text-center font-bold uppercase leading-relaxed tracking-tight px-4 opacity-50">
                             By clicking Complete Purchase, you authorize SoleVora to charge your card.
                          </p>
                       </div>
                    </aside>

                </div>

            </div>
        </div>
    );
};

export default PaymentDetails;
