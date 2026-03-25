import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Modal from '../../components/ui/Modal';
import '../../styles/user/PaymentDetails.css';

const PaymentDetails = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, checkoutData, clearCart } = useCart();

    const [paymentMethod, setPaymentMethod] = useState('creditcard');
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: '' });

    const showMessage = (title, body) => {
        setModalContent({ title, body });
        setIsModalOpen(true);
    };

    const getLoggedInUser = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);
        return null;
    };

    const user = getLoggedInUser();
    const grossTotal = cartTotal;
    const promoDiscount = promoApplied ? grossTotal * 0.1 : 0;
    const shippingCharge = 0;
    const estimatedTax = grossTotal * 0.08;
    const total = grossTotal - promoDiscount + shippingCharge + estimatedTax;

    const handleApplyPromo = () => {
        if (promoCode.trim().toLowerCase() === 'save10') setPromoApplied(true);
        else showMessage('Invalid Promo', 'The code you entered is invalid. Try "SAVE10" for a discount.');
    };

    const handlePlaceOrder = async () => {
        try {
            const orderPayload = {
                total_amount: total,
                status: 'pending',
                shipping_address: `${checkoutData.streetAddress}, ${checkoutData.city}, ${checkoutData.postalCode}`,
                contact_number: checkoutData.phone,
                email: checkoutData.email || user?.email,
                userId: user?.id || null,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size
                }))
            };

            const response = await axios.post('http://localhost:5000/api/orders', orderPayload);
            const orderData = response.data;

            // Get payment hash from backend
            const hashResponse = await axios.post('http://localhost:5000/api/payment/generate-hash', {
                orderId: orderData.id,
                amount: total,
                currency: 'LKR' // PayHere Sandbox usually requires LKR for testing
            });

            const { hash } = hashResponse.data;

            // PayHere Payment Object
            const payment = {
                sandbox: true,
                merchant_id: "1234724", // Sandbox Merchant ID
                return_url: "http://localhost:5173/profile/orders",
                cancel_url: "http://localhost:5173/payment",
                notify_url: "http://localhost:5000/api/payment/notify",
                order_id: orderData.id.toString(),
                items: "SoleVora Order #" + orderData.id,
                amount: total.toFixed(2),
                currency: "LKR",
                hash: hash,
                first_name: checkoutData.firstName || (user?.name ? user.name.split(' ')[0] : "Guest"),
                last_name: checkoutData.lastName || (user?.name ? user.name.split(' ')[1] : "User"),
                email: checkoutData.email || user?.email,
                phone: checkoutData.phone,
                address: checkoutData.streetAddress,
                city: checkoutData.city,
                country: "Sri Lanka",
            };

            // Trigger PayHere popup
            window.payhere.onCompleted = function onCompleted(orderId) {
                console.log("Payment completed. OrderID:" + orderId);
                const currentItems = [...cart];
                clearCart();
                navigate('/order-success', { state: { orderId: orderId, items: currentItems } });
            };

            window.payhere.onDismissed = function onDismissed() {
                console.log("Payment popup dismissed");
                showMessage('Payment Dismissed', 'You dismissed the payment popup. Your order is saved as pending.');
            };

            window.payhere.onError = function onError(error) {
                console.log("Error:" + error);
                showMessage('Payment Error', 'There was an error with PayHere: ' + error);
            };

            window.payhere.startPayment(payment);

        } catch (error) {
            console.error('Error placing order:', error);
            showMessage('Order Failed', 'Error initiating payment. Please try again.');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="pd-page">
                <div className="pd-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2>Your cart is empty</h2>
                    <Link to="/category" className="pd-place-order-btn" style={{ display: 'inline-block', width: 'auto', marginTop: '20px' }}>
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pd-page">
            <div className="pd-container">
                <nav className="pd-breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="pd-bc-sep">/</span>
                    <Link to="/cart">Cart</Link>
                    <span className="pd-bc-sep">/</span>
                    <Link to="/shipping">Checkout</Link>
                    <span className="pd-bc-sep">/</span>
                    <span className="pd-bc-current">Payment</span>
                </nav>

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

                <div className="pd-grid">
                    <div className="pd-content-col">
                        <h1 className="pd-page-title">Finalize Payment</h1>
                        <p className="pd-page-subtitle">You will be redirected to the secure PayHere sandbox to complete your transaction.</p>

                        <div className="pd-methods-grid">
                            <div className="pd-method-card active">
                                <span className="material-symbols-outlined pd-method-icon">payments</span>
                                <span className="pd-method-name">PayHere</span>
                            </div>
                        </div>

                        <div className="pd-form-card" style={{ padding: '30px', textAlign: 'center' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <img src="https://www.payhere.lk/downloads/images/payhere_square_logo.png" alt="PayHere" style={{ width: '120px' }} />
                            </div>
                            <p>Click the button below to pay securely with PayHere.</p>
                        </div>

                        <div className="pd-nav-actions">
                            <Link to="/shipping" className="pd-back-link">
                                <span className="material-symbols-outlined">arrow_back</span>
                                Back to Shipping Method
                            </Link>
                        </div>
                    </div>

                    <div className="pd-summary-card">
                        <h3 className="pd-summary-title">Order Summary</h3>
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

                        <div className="pd-totals">
                            <div className="pd-total-row">
                                <span className="pd-total-key">Subtotal</span>
                                <span className="pd-total-val">${grossTotal.toFixed(2)}</span>
                            </div>
                            <div className="pd-total-row">
                                <span className="pd-total-key">Tax (8%)</span>
                                <span className="pd-total-val">${estimatedTax.toFixed(2)}</span>
                            </div>
                            <div className="pd-total-final">
                                <span className="pd-final-label">Total Amount</span>
                                <span className="pd-final-amount">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="pd-place-order-btn" onClick={handlePlaceOrder}>
                            <span className="material-symbols-outlined">shopping_bag</span>
                            Pay Now with PayHere
                        </button>
                    </div>
                </div>

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

export default PaymentDetails;
