import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Toast from "../components/ui/Toast";

const CartContext = createContext();

const API = "http://localhost:5001/api/cart";

const getToken = () => localStorage.getItem("auth_token");

const getUserId = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).id : null;
  } catch {
    return null;
  }
};

const getImg = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `http://localhost:5001${url}`;
  return `http://localhost:5001/${url.replace(/\\/g, "/")}`;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // Persistent selection
  const [toast, setToast] = useState(null);
  const [ready, setReady] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  //  FETCH CART 
  const fetchCart = async () => {
    const userId = getUserId();
    const token = getToken();

    if (!token || !userId) {
      setCart([]);
      return;
    }

    try {
      const res = await axios.get(`${API}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = (res.data.data || []).map((item) => {
        // get image from product.productimage array 
        const rawUrl =
          item.product?.productimage?.[0]?.url ||
          item.product?.image_url ||
          "";

        const stocks = item.product?.productstock || [];
        const sizeStock = stocks.find(s => parseFloat(s.size) === parseFloat(item.size) && s.quantity > 0);
        const itemPrice = (sizeStock && Number(sizeStock.sellingPrice) > 0) 
          ? Number(sizeStock.sellingPrice) 
          : (sizeStock && Number(sizeStock.costPrice) > 0)
            ? Number(sizeStock.costPrice)
            : Number(item.product?.price || 0);

        return {
          id: item.id,
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          name: item.product?.name || "Product",
          price: itemPrice,
          image_url: rawUrl ? getImg(rawUrl) : "",
        };
      });

      setCart(formatted);
      // Default select all if it's the first fetch or new items added
      setSelectedIds(prev => {
        const existingIds = formatted.map(i => i.id);
        if (prev.length === 0) return existingIds;
        return prev.filter(id => existingIds.includes(id));
      });
    } catch (err) {
      console.error("Fetch cart error:", err.response?.data || err.message);
    }
  };

  // Load cart on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchCart().finally(() => setReady(true));
    } else {
      setCart([]);
      setReady(true);
    }
  }, []);

  // Re-fetch cart on login/logout
  useEffect(() => {
    const handleAuthChange = () => {
      fetchCart();
    };
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  // ADD TO CART 
  const addToCart = async (product, size) => {
    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
      showToast("Please login first", "error");
      return;
    }

    try {
      await axios.post(
        API,
        { userId, productId: product.id, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`${product.name} added to cart!`);
      fetchCart();
    } catch (err) {
      console.error("Add cart error:", err.response?.data || err.message);
      showToast("Failed to add to cart", "error");
    }
  };

  // REMOVE 
const removeFromCart = async (cartId) => {
  const token = getToken();
  if (!token) return;

  setCart((prev) => prev.filter((i) => i.id !== cartId));

  try {
    await axios.delete(`${API}/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    showToast("Item removed");
  } catch (err) {
    console.error("Remove error:", err.message);
    fetchCart(); 
    showToast("Failed to remove item", "error");
  }
};

  //  UPDATE QTY
  const updateQuantity = async (cartId, quantity) => {
    if (quantity < 1) return;
    const token = getToken();
    setCart((prev) =>
      prev.map((i) => (i.id === cartId ? { ...i, quantity } : i))
    );
    try {
      await axios.put(
        `${API}/${cartId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err.message);
      fetchCart(); // revert on error
    }
  };

  //  CLEAR SELECTED ITEMS AFTER ORDER
  const clearCart = async () => {
    const token = getToken();
    if (!token) return;

    try {
      // Remove each selected item from backend
      await Promise.all(selectedIds.map(id => 
        axios.delete(`${API}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));

      // Update local state
      setCart(prev => prev.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Clear selected cart items error:", err);
      fetchCart();
    }
  };

  // TOTALS 
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);
  const cartTotal = cart.reduce((a, b) => a + b.quantity * b.price, 0);
  
  const selectedCart = cart.filter(item => selectedIds.includes(item.id));
  const selectedTotal = selectedCart.reduce((a, b) => a + b.quantity * b.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        selectedIds,
        setSelectedIds,
        selectedCart,
        selectedTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        cartCount,
        cartTotal,
        showToast,
        ready,
      }}
    >
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