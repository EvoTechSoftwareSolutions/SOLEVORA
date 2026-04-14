// PaymentDetails Component - Handles payment processing and order completion
// Allows users to select payment methods (Credit Card, PayPal, Apple Pay, COD)
// Integrates with PayHere for credit card payments and supports promo codes
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Modal from '../../components/ui/Modal';
import '../../styles/user/PaymentDetails.css';

const PaymentDetails = () => {
    // Navigation hook for redirecting after successful payment
    const navigate = useNavigate();
    
    // Cart context - provides access to cart items, totals, and checkout data
    const {
        selectedCart: cart,
        selectedCartTotal,
        lockedSubtotal,
        lockCheckoutSubtotal,
        checkoutPromo,
        setCheckoutPromo,
        checkoutData,
        clearCart,
        removeFromCart
    } = useCart();

    // State management for payment processing
    const [paymentMethod, setPaymentMethod] = useState('creditcard'); // Selected payment method
    const [promoCode, setPromoCode] = useState(checkoutPromo?.code || ''); // Promo code input
    const [promoApplied, setPromoApplied] = useState(!!checkoutPromo?.applied); // Whether promo is applied
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [modalContent, setModalContent] = useState({ title: '', body: '' }); // Modal message content

    // Utility function to display modal messages
    const showMessage = (title, body) => {
        setModalContent({ title, body });
        setIsModalOpen(true);
    };

    // Utility function to retrieve logged-in user from localStorage
    const getLoggedInUser = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);
        return null;
    };

    const user = getLoggedInUser(); // Current logged-in user or null
    
    // Shipping method configurations - must match ShippingMethod.jsx
    const shippingMethods = [
        { id: 'standard', name: 'Standard Shipping', price: 0 },
        { id: 'express', name: 'Express Shipping', price: 15.00 },
        { id: 'nextday', name: 'Next Day Delivery', price: 25.00 },
    ];

    // Price calculations
    const grossTotal = (lockedSubtotal ?? selectedCartTotal); // Use locked subtotal if available
    const promoDiscount = promoApplied ? (checkoutPromo?.discountAmount || 0) : 0; // Dynamic discount from API
    
    // Get shipping charge based on selected method from checkout data
    const selectedShippingMethod = checkoutData.shippingMethod || 'Standard Shipping';
    const shippingMethodObj = shippingMethods.find(m => m.name === selectedShippingMethod) || shippingMethods[0];
    const shippingCharge = shippingMethodObj.price;

    // Final order total after discounts and shipping
    const total = grossTotal - promoDiscount + shippingCharge;

    const [promoLoading, setPromoLoading] = useState(false);

    // Apply promo code validation and discount via API
    const handleApplyPromo = async () => {
        const trimmed = promoCode.trim();
        if (!trimmed) return;

        setPromoLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/promo/validate', {
                code: trimmed,
                orderAmount: grossTotal
            });

            if (data.valid) {
                setPromoApplied(true);
                // Store full promo info if needed, or just the state
                setCheckoutPromo({ 
                    code: data.promo.code, 
                    applied: true, 
                    discountType: data.promo.discountType,
                    discountValue: data.promo.discountValue,
                    discountAmount: data.discountAmount
                });
            } else {
                showMessage('Invalid Promo', data.message || 'The code you entered is invalid.');
            }
        } catch (error) {
            console.error('Promo validation error:', error);
            showMessage('Error', 'Could not validate promo code. Please try again.');
        } finally {
            setPromoLoading(false);
        }
    };

    // Main order placement handler - routes to appropriate payment method
    const handlePlaceOrder = async () => {
        // Lock subtotal to prevent changes during payment process
        lockCheckoutSubtotal(grossTotal);
        
        if (paymentMethod === 'cod') {
            await handleCOD();
        } else if (paymentMethod === 'creditcard') {
            await handlePayHere();
        } else {
            showMessage('Coming Soon', `Payment via ${paymentMethod} is currently under development. Please use Credit Card or Cash on Delivery.`);
        }
    };

    // Handle Cash on Delivery (COD) orders
    const handleCOD = async () => {
        try {
            // Prepare order payload for COD orders
            const orderPayload = {
                total_amount: total,
                status: 'pending',
                shipping_address: `${checkoutData.streetAddress || 'N/A'}, ${checkoutData.city || 'N/A'}, ${checkoutData.postalCode || '00000'}`,
                contact_number: checkoutData.phone || 'N/A',
                email: checkoutData.email || user?.email || 'guest@example.com',
                userId: user?.id || null,
                payment_method: 'cod',
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size
                }))
            };

            // Create order in backend
            const response = await axios.post('http://localhost:5000/api/orders', orderPayload);
            const orderData = response.data;
            const currentItems = [...cart];
            
            // Remove checked out items from cart
            currentItems.forEach(item => removeFromCart(item.id, item.size));
            
            // Navigate to order confirmation
            navigate('/order-confirmation', { state: { orderId: orderData.id, items: currentItems, paymentMethod: 'cod' } });
        } catch (error) {
            console.error('Error placing COD order:', error);
            showMessage('Order Failed', 'Could not place your order. Please try again.');
        }
    };

    const handlePayHere = async () => {
        try {
            const orderPayload = {
                total_amount: total,
                status: 'pending',
                shipping_address: `${checkoutData.streetAddress || 'N/A'}, ${checkoutData.city || 'N/A'}, ${checkoutData.postalCode || '00000'}`,
                contact_number: checkoutData.phone || 'N/A',
                email: checkoutData.email || user?.email || 'guest@example.com',
                userId: user?.id || null,
                payment_method: 'online',
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size
                }))
            };

            const response = await axios.post('http://localhost:5000/api/orders', orderPayload);
            const orderData = response.data;

            const hashResponse = await axios.post('http://localhost:5000/api/payment/hash', {
                order_id: orderData.id,
                amount: total,
                currency: 'USD'
            });

            const { hash, merchant_id } = hashResponse.data;

            const payment = {
                sandbox: true,
                merchant_id: merchant_id,
                return_url: `${window.location.origin}/profile/orders`,
                cancel_url: window.location.href,
                // NOTE: localhost cannot be reached by PayHere servers for webhook callbacks.
                // Use a publicly reachable backend URL in production (or via ngrok during local dev).
                notify_url: "http://localhost:5000/api/payment/notify",
                order_id: orderData.id.toString(),
                items: "SoleVora Order #" + orderData.id,
                amount: total.toFixed(2),
                currency: "USD",
                hash: hash,
                first_name: checkoutData.firstName || (user?.name ? user.name.split(' ')[0] : "Guest"),
                last_name: checkoutData.lastName || (user?.name ? user.name.split(' ')[1] : "User"),
                email: checkoutData.email || user?.email || 'guest@example.com',
                phone: checkoutData.phone || '0000000000',
                address: checkoutData.streetAddress || 'Address line 1',
                city: checkoutData.city || 'Colombo',
                country: "Sri Lanka",
            };

            window.payhere.onCompleted = function onCompleted(orderId) {
                console.log("Payment completed. OrderID:" + orderId);
                // Fallback update for local development where notify_url is not publicly reachable.
                axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: 'paid' })
                    .catch((updateErr) => {
                        console.error('Failed to update paid status after PayHere completion:', updateErr);
                    })
                    .finally(() => {
                        const currentItems = [...cart];
                        // Clear only the checked out items
                        currentItems.forEach(item => removeFromCart(item.id, item.size));
                        navigate('/order-confirmation', { state: { orderId: orderId, items: currentItems, paymentMethod: 'creditcard' } });
                    });
            };

            window.payhere.onDismissed = function onDismissed() {
                showMessage('Payment Dismissed', 'You dismissed the payment popup. Your order is saved as pending.');
            };

            window.payhere.onError = function onError(error) {
                showMessage('Payment Error', 'There was an error with PayHere: ' + error);
            };

            window.payhere.startPayment(payment);

        } catch (error) {
            console.error('Error placing order:', error);
            showMessage('Order Failed', 'Error initiating payment. Please try again.');
        }
    };

    // Empty cart state - prevents access to payment page with no items
    if (cart.length === 0) {
        return (
            <div className="pd-page">
                <div className="pd-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <p className="mb-8 text-gray-500">Add some items before proceeding to payment.</p>
                    <Link to="/category" className="pd-place-order-btn" style={{ display: 'inline-block', width: 'auto', padding: '12px 30px' }}>
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    // Main component render
    return (
        <div className="pd-page">
            <div className="pd-container">
                {/* Breadcrumb navigation */}
                <nav className="pd-breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="pd-bc-sep">/</span>
                    <Link to="/cart">Cart</Link>
                    <span className="pd-bc-sep">/</span>
                    <Link to="/shipping">Checkout</Link>
                    <span className="pd-bc-sep">/</span>
                    <span className="pd-bc-current">Payment</span>
                </nav>

                {/* Checkout progress stepper */}
                <div className="pd-stepper-wrap">
                    <div className="pd-stepper">
                        <div className="pd-step-item">
                            <div className="pd-circle pd-circle-completed">1</div>
                            <span className="pd-step-lbl pd-lbl-completed">Shipping</span>
                        </div>
                        <div className="pd-connector pd-connector-filled"></div>
                        <div className="pd-step-item">
                            <div className="pd-circle pd-circle-completed">2</div>
                            <span className="pd-step-lbl pd-lbl-completed">Method</span>
                        </div>
                        <div className="pd-connector pd-connector-filled"></div>
                        <div className="pd-step-item">
                            <div className="pd-circle pd-circle-active">3</div>
                            <span className="pd-step-lbl pd-lbl-active">Payment</span>
                        </div>
                    </div>
                </div>

                {/* Main content grid - payment form and order summary */}
                <div className="pd-grid">
                    <div className="pd-content-col">
                        <h1 className="pd-page-title">Payment Details</h1>
                        <p className="pd-page-subtitle">Secure your order with your preferred payment method.</p>

                        <h3 className="pd-section-title">Select Payment Method</h3>
                        
                        {/* Payment method selection grid */}
                        <div className="pd-methods-grid">
                            <div 
                                className={`pd-method-card ${paymentMethod === 'creditcard' ? 'active' : ''}`} 
                                onClick={() => setPaymentMethod('creditcard')}
                            >
                                <span className="material-symbols-outlined pd-method-icon">credit_card</span>
                                <span className="pd-method-name">Credit Card</span>
                            </div>
                            <div 
                                className={`pd-method-card ${paymentMethod === 'paypal' ? 'active' : ''}`} 
                                onClick={() => setPaymentMethod('paypal')}
                            >
                                <span className="material-symbols-outlined pd-method-icon">account_balance_wallet</span>
                                <span className="pd-method-name">PayPal</span>
                            </div>
                            <div 
                                className={`pd-method-card ${paymentMethod === 'applepay' ? 'active' : ''}`} 
                                onClick={() => setPaymentMethod('applepay')}
                            >
                                <span className="pd-method-sub">iOS</span>
                                <span className="pd-method-name">Apple Pay</span>
                            </div>
                            <div 
                                className={`pd-method-card ${paymentMethod === 'cod' ? 'active' : ''}`} 
                                onClick={() => setPaymentMethod('cod')}
                            >
                                <span className="material-symbols-outlined pd-method-icon">payments</span>
                                <span className="pd-method-name">Cash on Delivery</span>
                            </div>
                        </div>

                        {/* Payment method information display */}
                        <div className="pd-form-card" style={{ padding: '30px', textAlign: 'center' }}>
                            {paymentMethod === 'creditcard' ? (
                                // Credit card payment info with PayHere integration
                                <>
                                    <div style={{ marginBottom: '20px' }}>
                                        <img src="https://www.payhere.lk/downloads/images/payhere_square_logo.png" alt="PayHere" style={{ width: '100px', margin: '0 auto' }} />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">You will be redirected to PayHere secure gateway to complete your transaction.</p>
                                    <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-sm">
                                        <span className="material-symbols-outlined">verified_user</span>
                                        SSL Secure Transaction
                                    </div>
                                </>
                            ) : paymentMethod === 'cod' ? (
                                // Cash on delivery payment info
                                <div style={{ padding: '10px 0' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '52px', color: '#f66d3b', display: 'block', marginBottom: '16px' }}>local_shipping</span>
                                    <h3 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '10px', color: '#111' }}>Pay When You Receive</h3>
                                    <p className="text-sm text-gray-500" style={{ maxWidth: '320px', margin: '0 auto 16px', lineHeight: '1.7' }}>
                                        Your order will be delivered to your address. Payment is collected by the delivery agent upon arrival.
                                    </p>
                                    <div style={{ background: '#fff7f3', border: '1px solid #ffd5c0', borderRadius: '12px', padding: '14px 18px', textAlign: 'left', maxWidth: '340px', margin: '0 auto' }}>
                                        <p style={{ fontSize: '13px', color: '#444', marginBottom: '6px' }}><strong>📍 Delivery Address:</strong></p>
                                        <p style={{ fontSize: '13px', color: '#666' }}>{checkoutData.streetAddress || 'N/A'}, {checkoutData.city || 'N/A'}</p>
                                        <p style={{ fontSize: '13px', color: '#444', marginTop: '10px', marginBottom: '6px' }}><strong>💰 Amount Due on Delivery:</strong></p>
                                        <p style={{ fontSize: '20px', fontWeight: '800', color: '#f66d3b' }}>${total.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-sm" style={{ marginTop: '16px' }}>
                                        <span className="material-symbols-outlined">check_circle</span>
                                        No online payment required
                                    </div>
                                </div>
                            ) : (
                                // Placeholder for other payment methods
                                <p className="text-gray-500 py-10">Details for {paymentMethod.replace('card', ' card')} will be shown here.</p>
                            )}
                        </div>

                        {/* Navigation actions */}
                        <div className="pd-nav-actions">
                            <Link to="/shipping" className="pd-back-link">
                                <span className="material-symbols-outlined">arrow_back</span>
                                Back to Shipping Method
                            </Link>
                        </div>
                    </div>

                    {/* Order summary sidebar */}
                    <div className="pd-summary-card">
                        <h3 className="pd-summary-title">Order Summary</h3>
                        
                        {/* Cart items display */}
                        <div className="pd-items-scroll">
                            {cart.map(item => (
                                <div key={`${item.id}-${item.size}`} className="pd-item-card">
                                    <div className="pd-item-img-wrap">
                                        <img src={item.image_url} alt={item.name} className="pd-item-img" />
                                        <span className="pd-qty-badge">{item.quantity}</span>
                                    </div>
                                    <p className="pd-item-name">{item.name}</p>
                                    <p className="pd-item-variant">Size: {item.size}</p>
                                    <div className="pd-item-footer">
                                        <span className="pd-item-qty-lbl">Qty: {item.quantity}</span>
                                        <span className="pd-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Promo code input section */}
                        <div className="pd-promo">
                            <input
                                type="text"
                                placeholder="Promo code"
                                value={promoCode}
                                onChange={e => setPromoCode(e.target.value)}
                                className="pd-promo-input"
                            />
                            <button type="button" onClick={handleApplyPromo} className="pd-promo-btn">
                                Apply
                            </button>
                        </div>

                        {/* Order total breakdown */}
                        <div className="pd-totals">
                            <div className="pd-total-row">
                                <span className="pd-total-key">Gross Total</span>
                                <span className="pd-total-val">${grossTotal.toFixed(2)}</span>
                            </div>
                            <div className="pd-total-row">
                                <span className="pd-total-key">Promo Discount</span>
                                <span className="pd-total-val">-${promoDiscount.toFixed(2)}</span>
                            </div>
                            <div className="pd-total-row">
                                <span className="pd-total-key">Shipping</span>
                                <span className="pd-free">
                                    {shippingCharge === 0 ? 'Free' : `$${shippingCharge.toFixed(2)}`}
                                </span>
                            </div>
                            {/* Final total amount */}
                            <div className="pd-total-final">
                                <span className="pd-final-label">Total</span>
                                <span className="pd-final-amount">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Place order button */}
                        <button className="pd-place-order-btn" onClick={handlePlaceOrder}>
                            <span className="material-symbols-outlined">shopping_bag</span>
                            {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                        </button>

                        {/* Terms and conditions */}
                        <p className="pd-terms">
                            By placing your order, you agree to Solevora's{' '}
                            <Link to="/terms">Terms of Service</Link> and{' '}
                            <Link to="/privacy">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>

                {/* Modal for displaying messages */}
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    title={modalContent.title}
                    actions={
                        <button className="modal-btn modal-btn-confirm" onClick={() => setIsModalOpen(false)}>Got it</button>
                    }
                >
                    <p>{modalContent.body}</p>
                </Modal>
            </div>
        </div>
    );
};

export default PaymentDetails; // Export PaymentDetails component
