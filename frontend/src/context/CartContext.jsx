import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Load local storage if available
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('solevora_cart');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('solevora_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, size) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id && item.size === size);
            if (existingItem) {
                return prevCart.map(item => 
                    (item.id === product.id && item.size === size)
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                );
            }
            return [...prevCart, { ...product, size, quantity: 1 }];
        });
    };

    const removeFromCart = (productId, size) => {
        setCart(prevCart => prevCart.filter(item => !(item.id === productId && item.size === size)));
    };

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

    const [checkoutData, setCheckoutData] = useState({
        fullName: '',
        email: '',
        phone: '',
        streetAddress: '',
        city: '',
        postalCode: '',
        shippingMethod: 'Economy (Free)'
    });

    const updateCheckoutData = (newData) => {
        setCheckoutData(prev => ({ ...prev, ...newData }));
    };

    const clearCart = () => {
        setCart([]);
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

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cart, addToCart, removeFromCart, updateQuantity, clearCart, 
            cartTotal, cartCount, checkoutData, updateCheckoutData
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
