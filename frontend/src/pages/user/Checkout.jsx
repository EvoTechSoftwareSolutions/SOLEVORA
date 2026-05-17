import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { API_URL } from "../../config/api";
import "../../styles/user/checkout.css";

/*  Constants  */
const FALLBACK =
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ` +
  `width='80' height='80' viewBox='0 0 80 80'%3E` +
  `%3Crect width='80' height='80' fill='%23f3f4f6'/%3E` +
  `%3Cpath d='M20 55l14-18 10 12 8-10 14 16H20z' fill='%23d1d5db'/%3E` +
  `%3Ccircle cx='52' cy='28' r='7' fill='%23d1d5db'/%3E%3C/svg%3E`;

const handleImgError = (e) => {
  if (e.target.src !== FALLBACK) e.target.src = FALLBACK;
};

const SL_DISTRICTS = [
  "Ampara","Anuradhapura","Badulla","Batticaloa","Colombo","Galle",
  "Gampaha","Hambantota","Jaffna","Kalutara","Kandy","Kegalle",
  "Kilinochchi","Kurunegala","Mannar","Matale","Matara","Monaragala",
  "Mullaitivu","Nuwara Eliya","Polonnaruwa","Puttalam","Ratnapura",
  "Trincomalee","Vavuniya",
];

const PAYMENT_METHODS = [
  { id: "ONLINE",  icon: "credit_card",          label: "Card / PayHere" },
  { id: "paypal",  icon: "account_balance_wallet",label: "PayPal" },
  { id: "applepay",icon: "phone_iphone",          label: "Apple Pay" },
  { id: "COD",     icon: "payments",              label: "Cash on Delivery" },
];

/*  PaymentModal 
   type: "success" | "error" | "pending" | "cancelled"
   orderId, amount, delivery — shown in the summary box (success only)
   message — plain-language explanation shown to the user
   onConfirm — primary button handler
   onRetry   — secondary "Try again" handler (error/cancelled only)
   onClose   — X button / backdrop click
*/
const PaymentModal = ({
  isOpen,
  type = "error",
  orderId,
  amount,
  delivery,
  message,
  onConfirm,
  onRetry,
  onClose,
}) => {
  if (!isOpen) return null;

  const config = {
    success: {
      ringBg:    "#EAF3DE",
      iconColor: "#3B6D11",
      iconName:  "check_circle",
      pillBg:    "#EAF3DE",
      pillColor: "#27500A",
      pillIcon:  "check",
      pillText:  "Order confirmed",
      title:     "Payment successful!",
      hint:      "A confirmation email has been sent to your inbox.",
      primaryLabel: "View my order",
      primaryIcon:  "inventory_2",
      primaryStyle: { background: "#3B6D11", color: "#fff", border: "none" },
    },
    error: {
      ringBg:    "#FCEBEB",
      iconColor: "#A32D2D",
      iconName:  "cancel",
      pillBg:    "#FCEBEB",
      pillColor: "#791F1F",
      pillIcon:  "warning",
      pillText:  "Payment declined",
      title:     "Payment was not successful",
      hint:      "No charge was made. Please check your card details or try a different method.",
      primaryLabel: "Try again",
      primaryIcon:  "refresh",
      primaryStyle: { background: "#A32D2D", color: "#fff", border: "none" },
    },
    pending: {
      ringBg:    "#FAEEDA",
      iconColor: "#EF4444",
      iconName:  "close",
      pillBg:    "#B91C1C  ",
      pillColor: "#FEE2E2",
      pillIcon:  "close",
      pillText:  "Verifying payment",
      title:     "Payment Declined",
      primaryLabel: "Continue Shopping",
      primaryIcon: "shopping_cart",
      primaryStyle: { background: "#B91C1C", color: "#fff", border: "none" },
    },
    cancelled: {
      ringBg:    "#FAEEDA",
      iconColor: "#854F0B",
      iconName:  "remove_shopping_cart",
      pillBg:    "#FAEEDA",
      pillColor: "#633806",
      pillIcon:  "close",
      pillText:  "Cancelled",
      title:     "Payment window closed",
      hint:      "No charge was made and no order was created. You can try again whenever you're ready.",
      primaryLabel: "Try again",
      primaryIcon:  "refresh",
      primaryStyle: { background: "#854F0B", color: "#fff", border: "none" },
    },
  };

  const c = config[type] || config.error;

  return (
    <div style={styles.backdrop} role="dialog" aria-modal="true" aria-label={c.title} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Close button */}
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
        </button>

        {/* Icon ring */}
        <div style={{ ...styles.iconRing, background: c.ringBg }}>
          <span className="material-symbols-outlined" style={{ fontSize: 34, color: c.iconColor }}>
            {c.iconName}
          </span>
        </div>

        {/* Status pill */}
        <div style={{ ...styles.pill, background: c.pillBg, color: c.pillColor }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{c.pillIcon}</span>
          {c.pillText}
        </div>

        {/* Title */}
        <h2 style={styles.title}>{c.title}</h2>

        {/* User-readable message (from caller) */}
        {message && <p style={styles.body}>{message}</p>}

        {/* Order summary box — success only */}
        {type === "success" && (orderId || amount || delivery) && (
          <div style={styles.summaryBox}>
            {orderId   && <div style={styles.summaryRow}><span style={styles.summaryLabel}>Order ID</span><span style={styles.summaryValue}>#{orderId}</span></div>}
            {amount    && <div style={styles.summaryRow}><span style={styles.summaryLabel}>Amount paid</span><span style={styles.summaryValue}>Rs. {Number(amount).toLocaleString()}</span></div>}
            {delivery  && <div style={styles.summaryRow}><span style={styles.summaryLabel}>Delivery</span><span style={styles.summaryValue}>{delivery}</span></div>}
          </div>
        )}

        {/* Hint */}
        <p style={styles.hint}>{c.hint}</p>

        {/* Actions */}
        <div style={styles.actions}>
          {/* Show "Go back" ghost button for error / cancelled so user can choose another method */}
          {(type === "error" || type === "cancelled") && onRetry && (
            <button style={styles.ghostBtn} onClick={onClose}>
              Go back
            </button>
          )}
          <button style={{ ...styles.primaryBtn, ...c.primaryStyle }} onClick={onConfirm}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{c.primaryIcon}</span>
            {c.primaryLabel}
          </button>
        </div>

        {/* Reassurance footer */}
        {type === "success" && (
          <div style={styles.secureRow}>
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#3B6D11" }}>verified_user</span>
            <span style={{ fontSize: 12, color: "#3B6D11" }}>Secured by SSL encryption</span>
          </div>
        )}
      </div>
    </div>
  );
};

/*  Inline styles for PaymentModal  */
const styles = {
  backdrop: {
    position:       "fixed",
    inset:          0,
    background:     "rgba(0,0,0,0.48)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    zIndex:         9999,
    padding:        "16px",
  },
  modal: {
    background:    "#fff",
    borderRadius:  "16px",
    padding:       "36px 28px 28px",
    width:         "100%",
    maxWidth:      "400px",
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    position:      "relative",
    boxShadow:     "0 8px 32px rgba(0,0,0,0.18)",
  },
  closeBtn: {
    position:   "absolute",
    top:        "14px",
    right:      "14px",
    background: "transparent",
    border:     "none",
    cursor:     "pointer",
    color:      "#888",
    display:    "flex",
    padding:    "4px",
    borderRadius: "50%",
  },
  iconRing: {
    width:          "72px",
    height:         "72px",
    borderRadius:   "50%",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   "16px",
    flexShrink:     0,
  },
  pill: {
    display:       "inline-flex",
    alignItems:    "center",
    gap:           "5px",
    fontSize:      "12px",
    fontWeight:    "600",
    padding:       "4px 12px",
    borderRadius:  "99px",
    marginBottom:  "12px",
    letterSpacing: "0.02em",
  },
  title: {
    fontSize:     "20px",
    fontWeight:   "600",
    color:        "#111",
    textAlign:    "center",
    marginBottom: "8px",
    lineHeight:   1.3,
  },
  body: {
    fontSize:     "14px",
    color:        "#555",
    textAlign:    "center",
    lineHeight:   1.6,
    marginBottom: "4px",
  },
  summaryBox: {
    background:   "#f8f9fa",
    borderRadius: "10px",
    padding:      "12px 16px",
    width:        "100%",
    margin:       "14px 0 4px",
  },
  summaryRow: {
    display:        "flex",
    justifyContent: "space-between",
    fontSize:       "13px",
    padding:        "4px 0",
  },
  summaryLabel: { color: "#777" },
  summaryValue: { color: "#111", fontWeight: "600" },
  hint: {
    fontSize:     "12px",
    color:        "#999",
    textAlign:    "center",
    lineHeight:   1.5,
    margin:       "14px 0 20px",
  },
  actions: {
    display: "flex",
    gap:     "10px",
    width:   "100%",
  },
  primaryBtn: {
    flex:           1,
    padding:        "11px 0",
    borderRadius:   "10px",
    fontSize:       "14px",
    fontWeight:     "600",
    cursor:         "pointer",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    gap:            "6px",
  },
  ghostBtn: {
    flex:           1,
    padding:        "11px 0",
    borderRadius:   "10px",
    fontSize:       "14px",
    fontWeight:     "500",
    cursor:         "pointer",
    background:     "transparent",
    border:         "1px solid #ddd",
    color:          "#555",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
  },
  secureRow: {
    display:     "flex",
    alignItems:  "center",
    gap:         "5px",
    marginTop:   "16px",
  },
};

/*  Poll helper  */
const pollForOrder = (pendingId, onSuccess, onFailure) => {
  const maxAttempts = 15;
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;
    try {
      const { data } = await axios.get(
        `https://residual-self-flaky.ngrok-free.dev/api/payment/pending/${pendingId}`,
        { headers: { "ngrok-skip-browser-warning": "true" } },
      );
      const status = data.data?.status;

      if (status === "COMPLETED" && data.data?.orderId) {
        clearInterval(interval);
        onSuccess(data.data.orderId);
      } else if (status === "FAILED") {
        clearInterval(interval);
        onFailure("Your payment was declined. No order was created. Please try again.");
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        onFailure(
          "Payment confirmation is taking longer than expected. " +
          "Check your email or order history — if charged, your order will appear shortly.",
        );
      }
    } catch {
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        onFailure("Could not verify payment status. Please check your order history.");
      }
    }
  }, 2000);
};

/*  Component  */
const Checkout = () => {
  const navigate   = useNavigate();
  const { selectedCart, selectedTotal, clearCart } = useCart();

  const [buyNowItem, setBuyNowItem]   = useState(null);
  const cart      = buyNowItem ? [buyNowItem] : selectedCart;
  const cartTotal = buyNowItem ? buyNowItem.price * buyNowItem.quantity : selectedTotal;

  const [shippingMethods, setShippingMethods] = useState([]);
  const [step, setStep] = useState(0);

  /* Toast */
  const [toast, setToast]   = useState("");
  const toastTimer          = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  /* PaymentModal state */
  const [pmState, setPmState] = useState({
    isOpen:   false,
    type:     "error",       // "success" | "error" | "pending" | "cancelled"
    message:  "",
    orderId:  null,
    amount:   null,
    delivery: null,
  });

  const closePm  = () => setPmState((s) => ({ ...s, isOpen: false }));
  const openPm   = (type, message, extras = {}) =>
    setPmState({ isOpen: true, type, message, orderId: null, amount: null, delivery: null, ...extras });

  /* Prevents double-click */
  const [paying, setPaying] = useState(false);

  /* Shipping form */
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        fullName:      u.name          || "",
        email:         u.email         || "",
        phone:         u.phone         || "",
        streetAddress: u.streetAddress || u.location || "",
        city:          u.city          || "",
        postalCode:    u.postalCode    || "",
        country:       "Sri Lanka",
        userId:        u.id            || null,
      };
    } catch {
      return { fullName:"", email:"", phone:"", streetAddress:"", city:"", postalCode:"", country:"Sri Lanka", userId:null };
    }
  });

  /* Buy-now item */
  useEffect(() => {
    const data = localStorage.getItem("buyNowItem");
    if (data) setBuyNowItem(JSON.parse(data));
  }, []);

  /* Shipping rates */
  useEffect(() => {
    if (!form.city) return;
    const orderMap = { standard:1, express:2, nextday:3 };
    axios.get(`${API_URL}/shipping/${form.city}`)
      .then(({ data }) => {
        const mapped = data.data
          .map((item) => ({
            id:    item.method,
            name:  item.method === "standard" ? "Standard Shipping"
                 : item.method === "express"  ? "Express Shipping"
                 :                              "Next Day Delivery",
            time:  item.method === "standard" ? "3–5 business days"
                 : item.method === "express"  ? "1–2 business days"
                 :                              "Delivery by tomorrow",
            price: item.price,
            icon:  item.method === "standard" ? "📦"
                 : item.method === "express"  ? "🚀"
                 :                              "⚡",
          }))
          .sort((a, b) => (orderMap[a.id] || 99) - (orderMap[b.id] || 99));
        setShippingMethods(mapped);
        if (mapped.length > 0) setShippingId(mapped[0].id);
      })
      .catch(() => {});
  }, [form.city]);

  const [savedAddresses,  setSavedAddresses]  = useState([]);
  const [profileLoaded,   setProfileLoaded]   = useState(false);
  const [shippingId,      setShippingId]      = useState("standard");
  const [paymentMethod,   setPaymentMethod]   = useState("ONLINE");
  const [promoCode,       setPromoCode]       = useState(sessionStorage.getItem("checkoutPromoCode") || "");
  const [promoApplied,    setPromoApplied]    = useState(Number(sessionStorage.getItem("checkoutPromoDiscount")) > 0);
  const [promoData,       setPromoData]       = useState(
    Number(sessionStorage.getItem("checkoutPromoDiscount")) > 0
      ? { code: sessionStorage.getItem("checkoutPromoCode"), discountAmount: Number(sessionStorage.getItem("checkoutPromoDiscount")) }
      : null,
  );
  const [promoLoading, setPromoLoading] = useState(false);

  /* Derived totals */
  const shippingObj    = shippingMethods.find((m) => m.id === shippingId);
  const shippingCharge = Number(shippingObj?.price ?? 0);
  const promoDiscount  = Number(promoApplied ? (promoData?.discountAmount ?? 0) : 0);
  const baseTotal      = Number(cartTotal || 0);
  const codFee         = paymentMethod === "COD" ? 200 : 0;
  const total          = Number(Math.max(0, baseTotal - promoDiscount + shippingCharge + codFee).toFixed(2));

  /* Load user profile */
  useEffect(() => {
    if (!form.userId) return;
    (async () => {
      try {
        const token   = localStorage.getItem("auth_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        if (token) {
          const { data } = await axios.get(`/user/${form.userId}`, { headers });
          setForm((prev) => ({
            ...prev,
            fullName:      prev.fullName      || data.name          || "",
            email:         prev.email         || data.email         || "",
            phone:         prev.phone         || data.phone         || "",
            streetAddress: prev.streetAddress || data.streetAddress || data.location || "",
            city:          prev.city          || data.city          || "",
            postalCode:    prev.postalCode    || data.postalCode    || "",
            country:       prev.country       || data.country       || "Sri Lanka",
          }));
        }
        const res       = await axios.get(`/addresses/${form.userId}`, { headers });
        const addresses = res.data.data || [];
        setSavedAddresses(addresses);
        const def = addresses.find((a) => a.isDefault);
        if (def && !form.streetAddress) applyAddress(def);
      } catch {}
    })();
  }, [form.userId]);

  const applyAddress = (addr) =>
    setForm((p) => ({
      ...p,
      fullName:      addr.name       || p.fullName,
      phone:         addr.phone      || p.phone,
      streetAddress: addr.street     || p.streetAddress,
      city:          addr.city       || p.city,
      postalCode:    addr.postalCode || p.postalCode,
      country:       addr.country    || p.country,
    }));

  const refreshProfile = async () => {
    if (!form.userId) return;
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) { showToast("Please login first."); return; }
      const { data } = await axios.get(`/user/${form.userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setForm((p) => ({
        ...p,
        fullName:      data.name          || "",
        email:         data.email         || "",
        phone:         data.phone         || "",
        streetAddress: data.streetAddress || data.location || "",
        city:          data.city          || "",
        postalCode:    data.postalCode    || "",
        country:       data.country       || "Sri Lanka",
      }));
      setProfileLoaded(true);
      showToast("Updated from profile");
      setTimeout(() => setProfileLoaded(false), 3000);
    } catch {
      showToast("Failed to refresh profile.");
    }
  };

  /* Promo handlers */
  const applyPromo = async () => {
    const trimmed = promoCode.trim();
    if (!trimmed) { showToast("Enter a promo code first."); return; }
    setPromoLoading(true);
    try {
      const { data } = await axios.post("/promo/validate", { code: trimmed, orderAmount: cartTotal });
      setPromoApplied(true);
      setPromoData({ code: data.code, discountAmount: data.discountAmount });
      sessionStorage.setItem("checkoutPromoCode",     data.code);
      sessionStorage.setItem("checkoutPromoDiscount", String(data.discountAmount));
      showToast(`Promo applied! ${data.message}`);
    } catch (err) {
      setPromoApplied(false);
      setPromoData(null);
      showToast(err.response?.data?.message || "Invalid promo code.");
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setPromoApplied(false);
    setPromoData(null);
    setPromoCode("");
    sessionStorage.setItem("checkoutPromoCode",     "");
    sessionStorage.setItem("checkoutPromoDiscount", "0");
  };

  /* Validation */
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value.trim())                       error = "Full name is required";
        else if (!/^[A-Za-z0-9\s_-]+$/.test(value)) error = "Only letters, numbers, spaces, hyphens, and underscores allowed";
        break;
      case "email":
        if (!value.trim())                       error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value))   error = "Invalid email address";
        break;
      case "phone":
        if (!value.trim())                       error = "Phone number is required";
        else if (!/^[0-9+\-\s()]+$/.test(value))error = "Invalid phone number";
        break;
      case "streetAddress":
        if (!value.trim())                       error = "Address is required";
        break;
      case "city":
        if (!value.trim())                       error = "Please select district";
        break;
      case "postalCode":
        if (!value.trim())                       error = "Postal code is required";
        else if (!/^\d{5}$/.test(value))         error = "Postal code must be exactly 5 digits";
        break;
      case "country":
        if (!value.trim())                       error = "Country is required";
        break;
      default: break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const goNext = () => {
    if (step === 0) {
      const fields = ["fullName","email","phone","streetAddress","city","postalCode","country"];
      let valid = true;
      fields.forEach((f) => { if (!validateField(f, form[f])) valid = false; });
      if (!valid) { showToast("Please fill all required fields correctly"); return; }
    }
    setStep((s) => Math.min(s + 1, 2));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Build payload */
  const buildOrderPayload = (method) => ({
    userId:          form.userId ? Number(form.userId) : undefined,
    customerName:    form.fullName    || "Guest User",
    email:           form.email       || "guest@example.com",
    contactNumber:   form.phone       || "0000000000",
    shippingAddress: `${form.streetAddress}, ${form.city}, ${form.postalCode}, ${form.country}`,
    paymentMethod:   method,
    items: cart.map((i) => ({
      productId: Number(i.productId || i.id),
      quantity:  Number(i.quantity),
      price:     Number(i.price),
      size:      i.size,
    })),
    shippingCharge,
    codFee:         method === "COD" ? codFee : 0,
    shippingMethod: shippingObj?.name || "",
    promoDiscount,
    promoCode:      promoApplied ? promoData?.code || "" : "",
    totalAmount:    total,
  });

  const clearSession = () => {
    ["checkoutFormData","checkoutGrossTotal","checkoutShippingMethod",
     "checkoutShippingCharge","checkoutPromoDiscount","checkoutPromoCode"]
      .forEach((k) => sessionStorage.removeItem(k));
  };

  const buildConfirmState = (orderId, method, snapItems) => ({
    orderId,
    items:         snapItems || [...cart],
    paymentMethod: method,
    promoCode:     promoData?.code             || "",
    promoDiscount: promoData?.discountAmount   || 0,
    customerName:  form.fullName,
    email:         form.email,
    shippingCharge,
    codFee:        method === "cod" ? codFee   : 0,
    shippingMethod:shippingObj?.name           || "",
  });

  /*  COD  */
  const handleCOD = async () => {
    setPaying(true);
    try {
      const res     = await axios.post(`${API_URL}/orders`, buildOrderPayload("COD"));
      const orderId = res.data.data?.orderId || res.data.id;
      localStorage.removeItem("buyNowItem");
      clearCart();
      clearSession();

      openPm("success", "Your order has been placed and will be ready for delivery soon.", {
        orderId,
        amount:   total,
        delivery: shippingObj?.name || "",
      });
    } catch (err) {
      const msg =
        err.response?.data?.errors?.map((e) => `${e.field}: ${e.message}`).join(", ") ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      openPm("error", msg);
    } finally {
      setPaying(false);
    }
  };

  /*  PayHere  */
  const handlePayHere = async () => {
    setPaying(true);
    try {
      const hashRes = await axios.post(
        `https://residual-self-flaky.ngrok-free.dev/api/payment/hash`,
        { ...buildOrderPayload("ONLINE"), amount: total.toFixed(2), currency: "LKR" },
      );

      if (!hashRes.data.success) {
        openPm("error", hashRes.data.message || "Could not initiate payment. Please try again.");
        setPaying(false);
        return;
      }

      const { hash, merchant_id, pending_payment_id } = hashRes.data.data;
      const nameParts  = (form.fullName || "Guest").split(" ");
      const snapItems  = [...cart];

      window.payhere.onCompleted = () => {
        showToast("Payment received. Verifying with server…");

        pollForOrder(
          pending_payment_id,
          (realOrderId) => {
            localStorage.removeItem("buyNowItem");
            clearCart();
            clearSession();
            setPaying(false);

            openPm("success", "Your payment was received and your order is confirmed.", {
              orderId:  realOrderId,
              amount:   total,
              delivery: shippingObj?.name || "",
            });

            /* Navigate after user clicks "View my order" — handled in onConfirm below */
            setPmState((prev) => ({
              ...prev,
              _snapItems: snapItems,
              _method:    "online",
            }));
          },
          (errorMsg) => {
            setPaying(false);
            openPm("pending", errorMsg);
          },
        );
      };

      window.payhere.onDismissed = () => {
        setPaying(false);
        openPm("cancelled", "You closed the payment window. No charge was made and no order was created.");
      };

      window.payhere.onError = (e) => {
        setPaying(false);
        openPm("error", "PayHere encountered an error: " + e);
      };

      window.payhere.startPayment({
        sandbox:     true,
        merchant_id: String(merchant_id),
        return_url:  `${window.location.origin}/profile/orders`,
        cancel_url:  window.location.href,
        notify_url:  `https://residual-self-flaky.ngrok-free.dev/api/payment/notify`,
        order_id:    String(pending_payment_id),
        items:       "SoleVora Order",
        amount:      total.toFixed(2),
        currency:    "LKR",
        hash,
        first_name:  nameParts[0] || "Guest",
        last_name:   nameParts.slice(1).join(" ") || "User",
        email:       form.email,
        phone:       form.phone     || "0000000000",
        address:     form.streetAddress || "Main Street",
        city:        form.city      || "Colombo",
        country:     "Sri Lanka",
      });
    } catch (err) {
      setPaying(false);
      const msg =
        err.response?.data?.errors?.map((e) => `${e.field}: ${e.message}`).join(", ") ||
        err.response?.data?.message ||
        "Error initiating payment.";
      openPm("error", msg);
    }
  };

  const handlePlaceOrder = () => {
    if (paying) return;
    if      (paymentMethod === "COD")    handleCOD();
    else if (paymentMethod === "ONLINE") handlePayHere();
    else openPm("error", "Please select a valid payment method.");
  };

  /* Modal confirm action — navigates on success, retries on error/cancelled */
  const handlePmConfirm = () => {
    if (pmState.type === "success") {
      closePm();
      navigate("/order-confirmation", {
        state: buildConfirmState(
          pmState.orderId,
          pmState._method || "cod",
          pmState._snapItems,
        ),
      });
    } else if (pmState.type === "pending") {
      closePm();
      navigate("/category");
    } else {
      closePm(); 
    }
  };

  /* Empty cart guard */
  if (cart.length === 0)
    return (
      <div className="co-page">
        <div className="co-empty">
          <div className="co-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some items before checking out.</p>
          <Link to="/category" className="co-btn-primary">Shop Now</Link>
        </div>
      </div>
    );

  const stepLabels = ["Shipping Info", "Delivery", "Payment"];

  return (
    <div className="co-page">
      <div className="co-container">

        {/* Breadcrumb */}
        <nav className="co-breadcrumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/cart">Cart</Link><span>/</span>
          <span>{stepLabels[step]}</span>
        </nav>

        {/* Stepper */}
        <div className="co-stepper">
          {stepLabels.map((label, i) => (
            <React.Fragment key={i}>
              <div className={`co-step ${i < step ? "completed" : i === step ? "active" : "idle"}`}>
                <div className="co-step-circle">
                  {i < step ? <span className="co-step-check">✓</span> : <span>{i + 1}</span>}
                </div>
                <span className="co-step-label">{label}</span>
              </div>
              {i < 2 && <div className={`co-step-line ${i < step ? "filled" : ""}`} />}
            </React.Fragment>
          ))}
        </div>
        <p className="co-step-desc">Step {step + 1} of 3 — {stepLabels[step]}</p>

        <div className="co-grid">
          <div className="co-panel">

            {/* STEP 0: Shipping */}
            {step === 0 && (
              <div className="co-card co-fade-in">
                <div className="co-card-head">
                  <span className="co-card-icon">🚚</span>
                  <h2 className="co-card-title">Shipping Information</h2>
                  {form.userId && (
                    <button type="button" className="co-refresh-btn" onClick={refreshProfile}>
                      <span className="material-symbols-outlined">sync</span>
                      From Profile
                    </button>
                  )}
                </div>

                {profileLoaded && (
                  <div className="co-notice co-notice-success">
                    <span className="material-symbols-outlined">check_circle</span>
                    Updated from your profile
                  </div>
                )}

                {savedAddresses.length > 0 && (
                  <div className="co-saved-addresses">
                    <p className="co-field-label">Saved Addresses</p>
                    <div className="co-address-pills">
                      {savedAddresses.map((addr) => (
                        <button key={addr.id} type="button"
                          className={`co-address-pill ${form.streetAddress === addr.street ? "active" : ""}`}
                          onClick={() => applyAddress(addr)}>
                          <span className="material-symbols-outlined">{addr.icon || "home"}</span>
                          {addr.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="co-form">
                  <div className="co-field">
                    <label className="co-field-label">Full Name *</label>
                    <input className={`co-input ${errors.fullName ? "co-input-error" : ""}`}
                      type="text" name="fullName" placeholder="John Doe"
                      value={form.fullName} onChange={handleChange} />
                    {errors.fullName && <p className="co-error-text">{errors.fullName}</p>}
                  </div>

                  <div className="co-row-2">
                    <div className="co-field">
                      <label className="co-field-label">Email Address *</label>
                      <input className={`co-input ${errors.email ? "co-input-error" : ""}`}
                        type="email" name="email" placeholder="john@example.com"
                        value={form.email} onChange={handleChange} />
                      {errors.email && <p className="co-error-text">{errors.email}</p>}
                    </div>
                    <div className="co-field">
                      <label className="co-field-label">Phone Number *</label>
                      <input className={`co-input ${errors.phone ? "co-input-error" : ""}`}
                        type="tel" name="phone" placeholder="+94 77 000 0000"
                        value={form.phone} onChange={handleChange} />
                      {errors.phone && <p className="co-error-text">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="co-field">
                    <label className="co-field-label">Street Address *</label>
                    <input className={`co-input ${errors.streetAddress ? "co-input-error" : ""}`}
                      type="text" name="streetAddress" placeholder="123 Luxury Lane"
                      value={form.streetAddress} onChange={handleChange} />
                    {errors.streetAddress && <p className="co-error-text">{errors.streetAddress}</p>}
                  </div>

                  <div className="co-row-2">
                    <div className="co-field">
                      <label className="co-field-label">District / City *</label>
                      <select className={`co-input co-select ${errors.city ? "co-input-error" : ""}`}
                        name="city" value={form.city} onChange={handleChange}>
                        <option value="">Select district</option>
                        {SL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {errors.city && <p className="co-error-text">{errors.city}</p>}
                    </div>
                    <div className="co-field">
                      <label className="co-field-label">Postal Code *</label>
                      <input className={`co-input ${errors.postalCode ? "co-input-error" : ""}`}
                        type="text" name="postalCode" placeholder="10001"
                        value={form.postalCode} onChange={handleChange} />
                      {errors.postalCode && <p className="co-error-text">{errors.postalCode}</p>}
                    </div>
                  </div>

                  <div className="co-field">
                    <label className="co-field-label">Country *</label>
                    <input className={`co-input ${errors.country ? "co-input-error" : ""}`}
                      type="text" name="country"
                      value={form.country} onChange={handleChange} />
                    {errors.country && <p className="co-error-text">{errors.country}</p>}
                  </div>
                </div>

                <div className="co-nav-row">
                  <div />
                  <button className="co-btn-primary" onClick={goNext}>
                    Continue to Delivery
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: Shipping Method */}
            {step === 1 && (
              <div className="co-card co-fade-in">
                <div className="co-card-head">
                  <span className="co-card-icon">📬</span>
                  <h2 className="co-card-title">Choose Delivery Method</h2>
                </div>

                <div className="co-methods-list">
                  {shippingMethods.map((method) => (
                    <div key={method.id}
                      className={`co-method-card ${shippingId === method.id ? "active" : ""}`}
                      onClick={() => setShippingId(method.id)}>
                      <div className="co-method-left">
                        <div className={`co-radio ${shippingId === method.id ? "checked" : ""}`}>
                          {shippingId === method.id && (
                            <span className="material-symbols-outlined">check</span>
                          )}
                        </div>
                        <div>
                          <div className="co-method-icon-wrap">{method.icon}</div>
                          <h3 className="co-method-name">{method.name}</h3>
                          <p className="co-method-time">{method.time}</p>
                        </div>
                      </div>
                      <div className="co-method-price">
                        {method.price === 0
                          ? <span className="co-free-tag">FREE</span>
                          : `Rs. ${method.price.toLocaleString()}`}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="co-nav-row">
                  <button className="co-btn-ghost" onClick={goBack}>
                    <span className="material-symbols-outlined">arrow_back</span> Back
                  </button>
                  <button className="co-btn-primary" onClick={goNext}>
                    Continue to Payment
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className="co-card co-fade-in">
                <div className="co-card-head">
                  <span className="co-card-icon">💳</span>
                  <h2 className="co-card-title">Payment Details</h2>
                </div>
                <p className="co-subtitle">Secure your order with your preferred method.</p>

                <h3 className="co-section-title">Select Payment Method</h3>
                <div className="co-payment-grid">
                  {PAYMENT_METHODS.map((m) => (
                    <div key={m.id}
                      className={`co-pay-card ${paymentMethod === m.id ? "active" : ""}`}
                      onClick={() => setPaymentMethod(m.id)}>
                      <span className="material-symbols-outlined co-pay-icon">{m.icon}</span>
                      <span className="co-pay-label">{m.label}</span>
                    </div>
                  ))}
                </div>

                <div className="co-pay-info-panel">
                  {paymentMethod === "ONLINE" && (
                    <div className="co-payhere-info">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw6hK6OstCnuTU7y52e7qC7h_ek_8r3uTORA&s"
                        alt="PayHere" className="co-payhere-logo" />
                      <p>You'll be redirected to PayHere's secure gateway to complete the transaction.</p>
                      <div className="co-secure-badge">
                        <span className="material-symbols-outlined">verified_user</span>
                        SSL Secure Transaction
                      </div>
                    </div>
                  )}
                  {paymentMethod === "COD" && (
                    <div className="co-cod-info">
                      <span className="co-cod-icon">🚛</span>
                      <h3>Pay When You Receive</h3>
                      <p>Payment is collected by the delivery agent upon arrival.</p>
                      <p>A <strong>Rs. 200</strong> Cash on Delivery handling fee will be added.</p>
                      <div className="co-cod-detail">
                        <div className="co-cod-row">
                          <span>📍 Delivery Address</span>
                          <span>{form.streetAddress || "N/A"}, {form.city || "N/A"}</span>
                        </div>
                        <div className="co-cod-row co-cod-total-row">
                          <span>💰 Amount Due on Delivery</span>
                          <span className="co-cod-amount">Rs. {total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {(paymentMethod === "paypal" || paymentMethod === "applepay") && (
                    <div className="co-unavailable">
                      <span className="material-symbols-outlined">construction</span>
                      <p>{paymentMethod === "paypal" ? "PayPal" : "Apple Pay"} integration coming soon.</p>
                    </div>
                  )}
                </div>

                <div className="co-nav-row">
                  <button className="co-btn-ghost" onClick={goBack} disabled={paying}>
                    <span className="material-symbols-outlined">arrow_back</span> Back
                  </button>
                  <button className="co-btn-primary co-btn-place" onClick={handlePlaceOrder} disabled={paying}>
                    <span className="material-symbols-outlined">
                      {paying ? "hourglass_empty" : "shopping_bag"}
                    </span>
                    {paying ? "Processing…" : paymentMethod === "COD" ? "Place Order" : "Pay Now"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ═══ RIGHT: Order Summary ═══ */}
          <aside className="co-summary">
            <h3 className="co-summary-title">Order Summary</h3>

            <div className="co-items-scroll">
              {cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="co-item-card">
                  <div className="co-item-img-wrap">
                    <img src={item.image_url || FALLBACK} alt={item.name}
                      className="co-item-img" onError={handleImgError} />
                    <span className="co-item-badge">{item.quantity || 1}</span>
                  </div>
                  <div className="co-item-info">
                    <p className="co-item-name">{item.name}</p>
                    <p className="co-item-size">Size: {item.size}</p>
                  </div>
                  <span className="co-item-price">
                    Rs. {(item.price * (item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo */}
            <div className="co-promo-row">
              <input type="text" placeholder="Promo code"
                value={promoCode} disabled={promoApplied}
                onChange={(e) => { setPromoCode(e.target.value); if (promoApplied) removePromo(); }}
                className="co-promo-input" />
              {promoApplied
                ? <button type="button" className="co-promo-btn co-promo-remove" onClick={removePromo}>Remove</button>
                : <button type="button" className="co-promo-btn" onClick={applyPromo} disabled={promoLoading}>
                    {promoLoading ? "…" : "Apply"}
                  </button>}
            </div>
            {promoApplied && (
              <div className="co-promo-badge">
                ✅ <strong>{promoData?.code}</strong> — Rs. {promoDiscount.toLocaleString()} off
              </div>
            )}

            {/* Totals */}
            <div className="co-totals">
              <div className="co-total-row">
                <span>Subtotal</span><span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              {promoApplied && (
                <div className="co-total-row co-discount-row">
                  <span>Promo ({promoData?.code})</span>
                  <span>−Rs. {promoDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="co-total-row">
                <span>Shipping</span>
                <span className={shippingCharge === 0 ? "co-free" : ""}>
                  {shippingCharge === 0 ? "Free" : `Rs. ${shippingCharge.toLocaleString()}`}
                </span>
              </div>
              {paymentMethod === "COD" && (
                <div className="co-total-row co-cod-fee-row">
                  <span>Cash on Delivery Fee</span>
                  <span>Rs. {codFee.toLocaleString()}</span>
                </div>
              )}
              {step >= 1 && (
                <div className="co-total-row co-method-row">
                  <span>Method</span><span>{shippingObj?.name}</span>
                </div>
              )}
              <div className="co-total-final">
                <span>Total</span>
                <span className="co-total-amount">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <p className="co-terms">
              By placing your order you agree to Solevora's{" "}
              <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
            </p>
          </aside>
        </div>
      </div>

      {toast && <div className="co-toast">{toast}</div>}

      {/* ══ Payment Result Modal ══ */}
      <PaymentModal
        isOpen={pmState.isOpen}
        type={pmState.type}
        message={pmState.message}
        orderId={pmState.orderId}
        amount={pmState.amount}
        delivery={pmState.delivery}
        onConfirm={handlePmConfirm}
        onClose={closePm}
      />
    </div>
  );
};

export default Checkout;