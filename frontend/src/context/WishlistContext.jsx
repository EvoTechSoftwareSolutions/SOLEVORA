import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    const getUserId = () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr).id : null;
    };

    const fetchWishlist = async () => {
        const userId = getUserId();
        if (userId) {
            try {
                const res = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
                setWishlist(res.data);
            } catch (err) {
                console.error("Failed to fetch wishlist");
            }
        } else {
            const localData = localStorage.getItem('solevora_wishlist');
            if (localData) setWishlist(JSON.parse(localData));
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const addToWishlist = async (product) => {
        const userId = getUserId();
        if (userId) {
            try {
                await axios.post('http://localhost:5000/api/wishlist', {
                    userId,
                    productId: product.id
                });
                fetchWishlist();
            } catch (err) {
                console.error("Failed to add to wishlist");
            }
        } else {
            setWishlist((prev) => {
                if (prev.find(item => item.id === product.id)) return prev;
                const newWishlist = [...prev, product];
                localStorage.setItem('solevora_wishlist', JSON.stringify(newWishlist));
                return newWishlist;
            });
        }
    };

    const removeFromWishlist = async (productId) => {
        const userId = getUserId();
        if (userId) {
            try {
                await axios.delete(`http://localhost:5000/api/wishlist/${userId}/${productId}`);
                fetchWishlist();
            } catch (err) {
                console.error("Failed to remove from wishlist");
            }
        } else {
            setWishlist(prev => {
                const newWishlist = prev.filter(item => item.id !== productId);
                localStorage.setItem('solevora_wishlist', JSON.stringify(newWishlist));
                return newWishlist;
            });
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id == productId);
    };

    const clearWishlist = () => {
        setWishlist([]);
        localStorage.removeItem('solevora_wishlist');
    };

    return (
        <WishlistContext.Provider value={{ 
            wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist 
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
