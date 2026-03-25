import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Toast from '../components/ui/Toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [userId, setUserId] = useState(null);
    const [toast, setToast] = useState(null);

    const getUserId = () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr).id : null;
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type, id: Date.now() });
    };

    // Watch for localStorage changes to user ID
    useEffect(() => {
        const id = getUserId();
        setUserId(id);
        
        const checkUser = () => {
            const currentId = getUserId();
            if (currentId !== id) {
                setUserId(currentId);
            }
        };

        const interval = setInterval(checkUser, 1000); 
        window.addEventListener('storage', checkUser);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', checkUser);
        };
    }, [userId]);

    const fetchWishlist = async () => {
        const id = getUserId();
        if (id) {
            localStorage.removeItem('solevora_wishlist');
            try {
                const res = await axios.get(`http://localhost:5000/api/wishlist/${id}`);
                setWishlist(res.data);
            } catch (err) {
                console.error("Failed to fetch wishlist");
            }
        } else {
            const localData = localStorage.getItem('solevora_wishlist');
            if (localData) setWishlist(JSON.parse(localData));
            else setWishlist([]);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [userId]);

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
        showToast(`${product.name} added to your wishlist!`);
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
        showToast(`Item removed from your wishlist.`);
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
            {toast && (
                <Toast 
                    key={toast.id}
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
