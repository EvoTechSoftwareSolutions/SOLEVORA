import React, { useState } from 'react';
import axios from 'axios';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrderDetail(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/track?orderId=${orderId}&phone=${phone}`);
            if (response.data) {
                setOrderDetail(response.data);
            } else {
                setError('Order not found. Please check your credentials.');
            }
        } catch (err) {
            console.error('Error tracking order:', err);
            setError('Could not find order. Please check your Order ID and Phone Number.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { label: 'Pending', status: 'pending' },
        { label: 'Processing', status: 'processing' },
        { label: 'Shipped', status: 'shipped' },
        { label: 'Delivered', status: 'delivered' }
    ];

    const getStepIndex = (status) => {
        const orderStatus = status.toLowerCase();
        if (orderStatus === 'cancelled') return -1;
        return steps.findIndex(s => s.status === orderStatus);
    };

    return (
        <div className="bg-[#fdfdfd] min-h-[80vh] py-16 px-6 md:px-12 font-manrope">
            <div className="max-w-[800px] mx-auto w-full flex flex-col gap-10">
                
                {/* Header */}
                <header className="text-center flex flex-col gap-4">
                    <h1 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter uppercase italic leading-none">TRACK YOUR <span className="text-primary">ORDER</span></h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic">Real-time status of your SoleVora delivery</p>
                </header>

                {/* Tracking Form */}
                <form onSubmit={handleTrack} className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-black/5 flex flex-col gap-8 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Order Identifier</label>
                            <input 
                                type="text" placeholder="SV-XXXXX" required
                                value={orderId} onChange={(e) => setOrderId(e.target.value)}
                                className="h-14 px-6 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Phone Number</label>
                            <input 
                                type="tel" placeholder="+1 000 000 0000" required
                                value={phone} onChange={(e) => setPhone(e.target.value)}
                                className="h-14 px-6 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="h-16 bg-secondary text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl shadow-secondary/20 active:scale-95 disabled:opacity-50 group uppercase tracking-widest"
                    >
                        {loading ? <span className="animate-pulse">Locating...</span> : (
                            <>
                                <span>Track Shipment</span>
                                <span className="material-symbols-outlined text-xl group-hover:translate-x-2 transition-transform">location_searching</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-5 rounded-2xl flex items-center gap-3 text-sm font-bold border border-rose-100">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}
                </form>

                {/* Tracking Results */}
                {orderDetail && (
                    <div className="bg-white rounded-[3rem] shadow-2xl border border-black/5 p-10 md:p-14 animate-fadeIn">
                        <header className="flex justify-between items-start border-b border-gray-100 pb-10 mb-10">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Order <span className="text-primary italic">#{orderDetail.order_id}</span></h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Placed on {new Date(orderDetail.order_date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                orderDetail.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                                orderDetail.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-primary/10 text-primary'
                            }`}>
                                {orderDetail.status}
                            </span>
                        </header>

                        {/* Stepper */}
                        {orderDetail.status !== 'cancelled' && (
                            <div className="relative flex justify-between items-center mb-16 px-4">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                                {steps.map((step, idx) => {
                                    const currentIndex = getStepIndex(orderDetail.status);
                                    const isCompleted = idx <= currentIndex;
                                    const isActive = idx === currentIndex;

                                    return (
                                        <div key={idx} className="relative z-10 flex flex-col items-center gap-4 flex-1">
                                            <div className={`w-10 h-10 rounded-full bg-white border-4 flex items-center justify-center transition-all duration-500 ${
                                                isCompleted ? 'border-primary bg-primary text-white shadow-lg' : 'border-gray-100 text-gray-300'
                                            } ${isActive ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                                                {isCompleted ? <span className="material-symbols-outlined text-sm font-black">check</span> : <div className="w-2 h-2 rounded-full bg-current" />}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-secondary' : 'text-gray-300'}`}>{step.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex flex-col gap-10">
                            <h3 className="text-lg font-black uppercase tracking-widest border-l-4 border-primary pl-4">Shipment Contents</h3>
                            <div className="flex flex-col gap-4">
                                {orderDetail.items && orderDetail.items.map((item, idx) => (
                                    <article key={idx} className="bg-gray-50/50 rounded-3xl p-6 flex items-center gap-6 border border-gray-100/50 group hover:bg-white hover:border-primary/20 transition-all">
                                        <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shrink-0 shadow-sm">
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <h4 className="text-sm font-black uppercase truncate tracking-tight">{item.name}</h4>
                                            <p className="text-[10px] font-bold text-gray-400">SIZE EU {item.size} • QTY {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-black">${item.price}</span>
                                    </article>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 bg-secondary rounded-[2.5rem] p-10 gap-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="flex flex-col gap-4 relative z-10">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[.3em]">Shipping Destination</h4>
                                    <p className="text-sm font-medium leading-relaxed italic opacity-90">{orderDetail.customer_name}<br />{orderDetail.address}<br />{orderDetail.city}, {orderDetail.zip_code}</p>
                                </div>
                                <div className="flex flex-col gap-4 relative z-10 md:items-end md:text-right">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[.3em]">Total Transaction</h4>
                                    <p className="text-4xl font-black tracking-tighter text-primary animate-pulse">${orderDetail.total_amount}</p>
                                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Transaction Finalized</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
