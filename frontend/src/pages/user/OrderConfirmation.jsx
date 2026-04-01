import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const OrderConfirmation = () => {
  const { cartItems, cartTotal } = useCart();
  const orderNumber = "SV-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="bg-[#fdfdfd] min-h-screen py-16 md:py-24 px-6 md:px-12 font-manrope selection:bg-primary/20">
      <div className="max-w-[780px] mx-auto flex flex-col gap-12">
        
        {/* Success Header */}
        <header className="text-center flex flex-col items-center gap-6 animate-fadeIn">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
             <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30">
                <span className="material-symbols-outlined text-3xl font-black">check</span>
             </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-black text-secondary uppercase tracking-tighter italic">ORDER <span className="text-primary">CONFIRMED</span></h1>
            <p className="text-sm md:text-base text-gray-400 font-bold uppercase tracking-widest leading-relaxed italic max-w-sm mx-auto">Your SoleVora shipment is being prepared. Tracking ID: <span className="text-secondary font-black opacity-100">{orderNumber}</span></p>
          </div>
        </header>

        {/* Summary Card */}
        <main className="bg-white rounded-[3rem] shadow-2xl border border-black/5 overflow-hidden animate-fadeInDelay">
           
           {/* Card Header */}
           <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-sm font-black uppercase tracking-widest text-secondary italic border-l-4 border-primary pl-4">Shipment Manifest</h3>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{cartItems.length} ITEMS DETECTED</span>
           </div>

           {/* Items List */}
           <div className="px-10 py-6 max-h-[400px] overflow-y-auto scrollbar-none italic">
              {cartItems.map((item, idx) => (
                <div key={idx} className="py-6 border-b border-gray-50 last:border-none flex items-center gap-6 group hover:translate-x-2 transition-transform">
                   <div className="w-20 h-16 bg-gray-50 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </div>
                   <div className="flex-1 flex flex-col gap-1">
                      <h4 className="text-sm font-black uppercase truncate tracking-tight text-secondary">{item.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SIZE {item.size} • QTY {item.quantity}</p>
                   </div>
                   <span className="text-sm font-black text-secondary">${item.price * item.quantity}</span>
                </div>
              ))}
           </div>

           {/* Detailed Breakdown */}
           <div className="grid grid-cols-1 md:grid-cols-12 bg-white border-t border-gray-100 p-10 gap-10">
              <div className="md:col-span-7 flex flex-col gap-6">
                 <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-[.3em]">Estimated Arrival</span>
                    <div className="flex items-center gap-3 text-secondary">
                       <span className="material-symbols-outlined text-xl">local_shipping</span>
                       <span className="text-sm font-black uppercase tracking-tight italic">3-5 BUSINESS DAYS</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-[.3em]">Shipping Destination</span>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Refer to your primary address in profile for courier hand-off details.</p>
                 </div>
              </div>
              
              <div className="md:col-span-5 flex flex-col gap-4">
                 <div className="space-y-2 uppercase tracking-tighter">
                    <div className="flex justify-between text-[11px] font-bold text-gray-400">
                       <span>Subtotal</span>
                       <span className="text-secondary font-black">${cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-gray-400">
                       <span>Tax (GST)</span>
                       <span className="text-secondary font-black italic">INCLUDED</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-gray-400">
                       <span>Shipping</span>
                       <span className="text-green-600 font-black italic tracking-widest">FREE</span>
                    </div>
                 </div>
                 <div className="pt-4 border-t-2 border-gray-100 flex justify-between items-baseline italic">
                    <span className="text-sm font-black text-secondary uppercase">Order Total</span>
                    <span className="text-3xl font-black text-primary">${cartTotal}</span>
                 </div>
              </div>
           </div>

           {/* Card Footer Support */}
           <div className="px-10 py-5 bg-secondary flex items-center gap-4 group">
              <span className="material-symbols-outlined text-white/30 text-lg group-hover:text-primary transition-colors">contact_support</span>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-[.15em] flex-1">Need assistance? Contact our concierge at <span className="text-white hover:text-primary cursor-pointer transition-colors">support@solevora.com</span></p>
           </div>
        </main>

        {/* Bottom Actions */}
        <footer className="flex flex-col sm:flex-row justify-center gap-6 animate-fadeInDelay">
           <Link to="/track-order" className="px-12 h-14 bg-primary text-white rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:-translate-y-1 transition-all shadow-xl shadow-primary/30 uppercase tracking-widest">
              Track Shipment
              <span className="material-symbols-outlined text-lg">map</span>
           </Link>
           <Link to="/home" className="px-12 h-14 bg-white text-secondary border border-gray-100 rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm uppercase tracking-widest italic">
              Continue Shopping
              <span className="material-symbols-outlined text-lg">shopping_bag</span>
           </Link>
        </footer>

      </div>
    </div>
  );
};

export default OrderConfirmation;
