import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import Toast from '../components/ui/Toast';

const WishlistContext = createContext();

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

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [userId, setUserId] = useState(() => getUserId());
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, id: Date.now() });
    };

    const fetchWishlist = useCallback(async () => {
        const id = getUserId();
        if (id) {
            localStorage.removeItem('solevora_wishlist');
            try {
                const res = await axios.get(`http://localhost:5000/api/wishlist/${id}`);
                setWishlist(res.data);
            } catch (err) {
                console.error('Failed to fetch wishlist');
            }
        } else {
            const localData = localStorage.getItem('solevora_wishlist');
            if (localData) setWishlist(JSON.parse(localData));
            else setWishlist([]);
        }
    }, []);

    // Sync logged-in user id without depending on userId (avoids effect + interval loops)
    useEffect(() => {
        const syncUserId = () => {
            setUserId((prev) => {
                const next = getUserId();
                return Object.is(prev, next) ? prev : next;
            });
        };

        syncUserId();
        const interval = setInterval(syncUserId, 2000);
        window.addEventListener('storage', syncUserId);
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', syncUserId);
        };
    }, []);

    useEffect(() => {
        fetchWishlist();
    }, [userId, fetchWishlist]);

    const addToWishlist = async (product) => {
        const uid = getUserId();
        if (uid) {
            try {
                await axios.post('http://localhost:5000/api/wishlist', {
                    userId: uid,
                    productId: product.id
                });
                fetchWishlist();
            } catch (err) {
                console.error('Failed to add to wishlist');
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
        const uid = getUserId();
        if (uid) {
            try {
                await axios.delete(`http://localhost:5000/api/wishlist/${uid}/${productId}`);
                fetchWishlist();
            } catch (err) {
                console.error('Failed to remove from wishlist');
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
