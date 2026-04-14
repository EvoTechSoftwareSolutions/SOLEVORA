import React, { createContext, useState, useContext, useEffect } from 'react';
import Toast from '../components/ui/Toast';
// create cart context
const CartContext = createContext();

// helper to get user id from localStorage
const getUserId = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        const id = JSON.parse(userStr).id;
        return id == null ? null : id;
    } catch {
        return null;
    }
};

export const CartProvider = ({ children }) => {
    // Load local storage if available
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('solevora_cart');
        return localData ? JSON.parse(localData) : [];
    });

    const [toast, setToast] = useState(null);

    useEffect(() => {
        localStorage.setItem('solevora_cart', JSON.stringify(cart));
    }, [cart]);

    const [lockedSubtotal, setLockedSubtotal] = useState(() => {
        const raw = localStorage.getItem('solevora_checkout_lockedSubtotal');
        const n = raw == null ? null : Number(raw);
        return Number.isFinite(n) ? n : null;
    });

    const [checkoutPromo, setCheckoutPromo] = useState(() => {
        try {
            const raw = localStorage.getItem('solevora_checkout_promo');
            return raw ? JSON.parse(raw) : { code: '', applied: false };
        } catch {
            return { code: '', applied: false };
        }
    });

    useEffect(() => {
        if (lockedSubtotal == null) localStorage.removeItem('solevora_checkout_lockedSubtotal');
        else localStorage.setItem('solevora_checkout_lockedSubtotal', String(lockedSubtotal));
    }, [lockedSubtotal]);

    useEffect(() => {
        localStorage.setItem('solevora_checkout_promo', JSON.stringify(checkoutPromo));
    }, [checkoutPromo]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, id: Date.now() });
    };
// add product to cart
    const addToCart = (product, size) => {
        if (!getUserId()) {
            showToast("Please login to add items to your cart.", "error");
            return;
        }
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id && item.size === size);
            if (existingItem) {
                return prevCart.map(item => 
                    (item.id === product.id && item.size === size)
                    ? { ...item, quantity: item.quantity + 1, selected: true }
                    : item
                );
            }
            return [...prevCart, { ...product, size, quantity: 1, selected: true }];
        });
        showToast(`${product.name} (Size: ${size}) added to your cart!`);
    };

    // handle removeFromCart, updateQuantity, clearCart 
    const removeFromCart = (productId, size) => {
        setCart(prevCart => prevCart.filter(item => !(item.id === productId && item.size === size)));
    };
        // update quantity
    const updateQuantity = (productId, size, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart => 
            prevCart.map(item => 
                (item.id === productId && item.size === size)
                ? { ...item, quantity }
                : item
            )
        );
    };
// select/unselect single item
    const toggleItemSelection = (productId, size) => {
        setCart(prevCart => 
            prevCart.map(item => 
                (item.id === productId && item.size === size)
                ? { ...item, selected: item.selected === false ? true : false }
                : item
            )
        );
    };
// select/unselect all items
    const toggleAllSelection = (isSelected) => {
        setCart(prevCart => prevCart.map(item => ({ ...item, selected: isSelected })));
    };

    const lockCheckoutSubtotal = (subtotal) => {
        const next = Number(subtotal);
        if (!Number.isFinite(next)) return;
        setLockedSubtotal(next);
    };

    const clearCheckoutLock = () => {
        setLockedSubtotal(null);
        setCheckoutPromo({ code: '', applied: false });
    };
// checkout form data
    const [checkoutData, setCheckoutData] = useState({
        fullName: '',
        email: '',
        phone: '',
        streetAddress: '',
        city: '',
        postalCode: '',
        shippingMethod: 'Economy (Free)',
        userId: null
    });

    const updateCheckoutData = (newData) => {
        setCheckoutData(prev => ({ ...prev, ...newData }));
    };
// clear cart after order
    const clearCart = () => {
        setCart([]);
        clearCheckoutLock();
        setCheckoutData({
            fullName: '',
            email: '',
            phone: '',
            streetAddress: '',
            city: '',
            postalCode: '',
            shippingMethod: 'Economy (Free)'
        });
    };
// total price (all items)
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    const selectedCart = cart.filter(item => item.selected !== false);
    const selectedCartTotal = selectedCart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cart, addToCart, removeFromCart, updateQuantity, clearCart, 
            toggleItemSelection, toggleAllSelection,
            cartTotal, cartCount, selectedCart, selectedCartTotal,
            lockedSubtotal, lockCheckoutSubtotal, clearCheckoutLock,
            checkoutPromo, setCheckoutPromo,
            checkoutData, updateCheckoutData, showToast
        }}>
            {children}
            {toast && (
                <Toast 
                    key={toast.id}
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
