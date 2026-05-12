import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import Modal from "../../components/ui/Modal";
import { API_URL } from "../../config/api";
import "../../styles/user/checkout.css";

/*Constants  */
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
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

const PAYMENT_METHODS = [
  { id: "ONLINE", icon: "credit_card", label: "Card / PayHere" },
  { id: "paypal", icon: "account_balance_wallet", label: "PayPal" },
  { id: "applepay", icon: "phone_iphone", label: "Apple Pay" },
  { id: "COD", icon: "payments", label: "Cash on Delivery" },
];

/* ─Component */
const Checkout = () => {
  const navigate = useNavigate();
  const { selectedCart, selectedTotal, clearCart } = useCart();

  const [buyNowItem, setBuyNowItem] = useState(null);
  const cart = buyNowItem ? [buyNowItem] : selectedCart;

  const cartTotal = buyNowItem
    ? buyNowItem.price * buyNowItem.quantity
    : selectedTotal;
  const [shippingMethods, setShippingMethods] = useState([]);

  /*  Step state (0=Shipping Info, 1=Method, 2=Payment) ── */
  const [step, setStep] = useState(0);

  /* ── Toast ── */
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
  };

  /*  Modal  */
  const [modal, setModal] = useState({ open: false, title: "", body: "" });
  const showModal = (title, body) => setModal({ open: true, title, body });

  /* Shipping form  */
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        fullName: u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        streetAddress: u.streetAddress || u.location || "",
        city: u.city || "",
        postalCode: u.postalCode || "",
        country: "Sri Lanka",
        userId: u.id || null,
      };
    } catch {
      return {
        fullName: "",
        email: "",
        phone: "",
        streetAddress: "",
        city: "",
        postalCode: "",
        country: "Sri Lanka",
        userId: null,
      };
    }
  });

  useEffect(() => {
    const data = localStorage.getItem("buyNowItem");
    if (data) {
      setBuyNowItem(JSON.parse(data));
    }
  }, []);
  useEffect(() => {
    if (!form.city) return;

    const fetchShipping = async () => {
      try {
        const res = await axios.get(`${API_URL}/shipping/${form.city}`);

        const mapped = res.data.data.map((item) => ({
          id: item.method,
          name:
            item.method === "standard"
              ? "Standard Shipping"
              : item.method === "express"
                ? "Express Shipping"
                : "Next Day Delivery",
          time:
            item.method === "standard"
              ? "3–5 business days"
              : item.method === "express"
                ? "1–2 business days"
                : "Delivery by tomorrow",
          price: item.price,
          icon:
            item.method === "standard"
              ? "📦"
              : item.method === "express"
                ? "🚀"
                : "⚡",
        }));

        setShippingMethods(mapped);

        // auto select first method
        if (mapped.length > 0) {
          setShippingId(mapped[0].id);
        }
      } catch (err) {
        console.log("Shipping fetch error", err);
      }
    };

    fetchShipping();
  }, [form.city]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [profileLoaded, setProfileLoaded] = useState(false);

  /* ── Shipping method ── */
  const [shippingId, setShippingId] = useState("standard");

  /* ── Payment method ── */
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  /* ── Promo ── */
  const [promoCode, setPromoCode] = useState(
    sessionStorage.getItem("checkoutPromoCode") || "",
  );
  const [promoApplied, setPromoApplied] = useState(
    Number(sessionStorage.getItem("checkoutPromoDiscount")) > 0,
  );
  const [promoData, setPromoData] = useState(
    Number(sessionStorage.getItem("checkoutPromoDiscount")) > 0
      ? {
          code: sessionStorage.getItem("checkoutPromoCode"),
          discountAmount: Number(
            sessionStorage.getItem("checkoutPromoDiscount"),
          ),
        }
      : null,
  );
  const [promoLoading, setPromoLoading] = useState(false);

  /* ── Derived totals ── */
  const shippingObj = shippingMethods.find((m) => m.id === shippingId);

  const shippingCharge = Number(shippingObj?.price ?? 0);
  const promoDiscount = Number(
    promoApplied ? (promoData?.discountAmount ?? 0) : 0,
  );
  const baseTotal = Number(cartTotal || 0);
  const codFee = paymentMethod === "COD" ? 200 : 0;
  const total = Math.max(
    0,
    baseTotal - promoDiscount + shippingCharge + codFee,
  );

  /* ── Load user profile & saved addresses ── */
  useEffect(() => {
    if (!form.userId) return;
    (async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        if (token) {
          const { data } = await axios.get(`/user/${form.userId}`, { headers });
          setForm((prev) => ({
            ...prev,
            fullName: prev.fullName || data.name || "",
            email: prev.email || data.email || "",
            phone: prev.phone || data.phone || "",
            streetAddress:
              prev.streetAddress || data.streetAddress || data.location || "",
            city: prev.city || data.city || "",
            postalCode: prev.postalCode || data.postalCode || "",
            country: prev.country || data.country || "Sri Lanka",
          }));
        }
        const res = await axios.get(`/addresses/${form.userId}`, { headers });
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
      fullName: addr.name || p.fullName,
      phone: addr.phone || p.phone,
      streetAddress: addr.street || p.streetAddress,
      city: addr.city || p.city,
      postalCode: addr.postalCode || p.postalCode,
      country: addr.country || p.country,
    }));

  const refreshProfile = async () => {
    if (!form.userId) return;
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        showToast("Please login first.");
        return;
      }
      const { data } = await axios.get(`/user/${form.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm((p) => ({
        ...p,
        fullName: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        streetAddress: data.streetAddress || data.location || "",
        city: data.city || "",
        postalCode: data.postalCode || "",
        country: data.country || "Sri Lanka",
      }));
      setProfileLoaded(true);
      showToast("Updated from profile");
      setTimeout(() => setProfileLoaded(false), 3000);
    } catch {
      showToast("Failed to refresh profile.");
    }
  };

  /* ── Promo handlers ── */
  const applyPromo = async () => {
    const trimmed = promoCode.trim();
    if (!trimmed) {
      showToast("Enter a promo code first.");
      return;
    }
    setPromoLoading(true);
    try {
      const { data } = await axios.post("/promo/validate", {
        code: trimmed,
        orderAmount: cartTotal,
      });
      setPromoApplied(true);
      setPromoData({ code: data.code, discountAmount: data.discountAmount });
      sessionStorage.setItem("checkoutPromoCode", data.code);
      sessionStorage.setItem(
        "checkoutPromoDiscount",
        String(data.discountAmount),
      );
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
    sessionStorage.setItem("checkoutPromoCode", "");
    sessionStorage.setItem("checkoutPromoDiscount", "0");
  };

  /* ── Step validation ── */
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (!/^[A-Za-z0-9\s_-]+$/.test(value)) {
          error =
            "Only letters, numbers, spaces, hyphens, and underscores allowed";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Invalid email address";
        }
        break;

      case "phone":
        if (value && !/^[0-9+\-\s()]+$/.test(value)) {
          error = "Invalid phone number";
        }
        break;

      case "streetAddress":
        if (!value.trim()) {
          error = "Address is required";
        }
        break;

      case "city":
        if (!value.trim()) {
          error = "Please select district";
        }
        break;
      case "postalCode":
        if (!value.trim()) {
          error = "Postal code is required";
        } else if (!/^\d{5}$/.test(value)) {
          error = "Postal code must be exactly 5 digits";
        }
        break;

      case "country":
        if (!value.trim()) {
          error = "Country is required";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const validateStep0 = () => {
    if (!form.fullName || !form.email || !form.streetAddress) {
      showToast("Please fill in all required fields.");
      return false;
    }
    const sym = /[!@#$%^&*()_+={}\[\]:;"'<>?|\\]/;
    if (sym.test(form.fullName)) {
      showToast("Name should not contain special symbols.");
      return false;
    }
    for (const [k, v] of Object.entries({
      "Street Address": form.streetAddress,
      City: form.city,
      "Postal Code": form.postalCode,
      Country: form.country,
    })) {
      if (v && sym.test(v)) {
        showToast(`${k} should not contain special symbols.`);
        return false;
      }
    }
    if (form.phone && !/^[0-9+\-\s()]*$/.test(form.phone)) {
      showToast("Invalid phone format.");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (step === 0) {
      const validations = [
        validateField("fullName", form.fullName),
        validateField("email", form.email),
        validateField("phone", form.phone),
        validateField("streetAddress", form.streetAddress),
        validateField("city", form.city),
      ];

      if (validations.includes(false)) {
        showToast("Please fix form errors");
        return;
      }
    }

    setStep((s) => Math.min(s + 1, 2));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Place order ── */
  const buildPayload = (method) => ({
    userId: form.userId ? Number(form.userId) : undefined,
    customerName: form.fullName || "Guest User",
    email: form.email || "guest@example.com",
    contactNumber: form.phone || "0000000000",
    shippingAddress: `${form.streetAddress}, ${form.city}, ${form.postalCode}, ${form.country}`,
    paymentMethod: method,
    items: cart.map((i) => ({
      productId: Number(i.productId || i.id),
      quantity: Number(i.quantity),
      price: Number(i.price),
      size: i.size,
    })),
    shippingCharge,
    codFee,
    promoDiscount,
    promoCode: promoApplied ? promoData?.code || "" : "",
    totalAmount: total,
  });

  const clearSession = () => {
    [
      "checkoutFormData",
      "checkoutGrossTotal",
      "checkoutShippingMethod",
      "checkoutShippingCharge",
      "checkoutPromoDiscount",
      "checkoutPromoCode",
    ].forEach((k) => sessionStorage.removeItem(k));
  };

  const handleCOD = async () => {
    try {
      const res = await axios.post(`${API_URL}/orders`, buildPayload("COD"));
      const orderId = res.data.data?.orderId || res.data.id;
      const items = [...cart];
      localStorage.removeItem("buyNowItem");
      clearCart();
      clearSession();
      navigate("/order-confirmation", {
        state: {
          orderId,
          items,
          paymentMethod: "cod",
          promoCode: promoData?.code || "",
          promoDiscount: promoData?.discountAmount || 0,
          customerName: form.fullName,
          email: form.email,
        },
      });
    } catch (err) {
      const msg =
        err.response?.data?.errors
          ?.map((e) => `${e.field}: ${e.message}`)
          .join(", ") ||
        err.response?.data?.message ||
        "Something went wrong.";
      showModal("Order Failed", msg);
    }
  };

  const handlePayHere = async () => {
    try {
      const res = await axios.post(`${API_URL}/orders`, buildPayload("ONLINE"));
      const orderId = res.data.data?.orderId || res.data.id;
      localStorage.removeItem("buyNowItem");
      const hashRes = await axios.post(`${API_URL}/payment/hash`, {
        order_id: orderId,
        amount: total,
        currency: "LKR",
      });
      const { hash, merchant_id } = hashRes.data.data || hashRes.data;
      const nameParts = (form.fullName || "Guest").split(" ");
      window.payhere.onCompleted = (oid) => {
        axios
          .put(`${API_URL}/payment/orders/${oid}/status`, {
            status: "PROCESSING",
            paymentStatus: "PAID",
          })
          .finally(() => {
            const items = [...cart];
            clearCart();
            clearSession();
            navigate("/order-confirmation", {
              state: {
                orderId: oid,
                items,
                paymentMethod: "online",
                promoCode: promoData?.code || "",
                promoDiscount: promoData?.discountAmount || 0,
                customerName: form.fullName,
                email: form.email,
              },
            });
          });
      };
      window.payhere.onDismissed = () =>
        showModal("Payment Dismissed", "Your order is saved as pending.");
      window.payhere.onError = (e) =>
        showModal("Payment Error", "PayHere error: " + e);
      window.payhere.startPayment({
        sandbox: true,
        merchant_id: String(merchant_id),
        return_url: `${window.location.origin}/profile/orders`,
        cancel_url: window.location.href,
        notify_url: `${API_URL}/payment/notify`,
        order_id: String(orderId),
        items: `SoleVora Order #${orderId}`,
        amount: total.toFixed(2),
        currency: "LKR",
        hash,
        first_name: nameParts[0] || "Guest",
        last_name: nameParts.slice(1).join(" ") || "User",
        email: form.email,
        phone: form.phone || "0000000000",
        address: form.streetAddress || "Main Street",
        city: form.city || "Colombo",
        country: "Sri Lanka",
      });
    } catch (err) {
      const msg =
        err.response?.data?.errors
          ?.map((e) => `${e.field}: ${e.message}`)
          .join(", ") ||
        err.response?.data?.message ||
        "Error initiating payment.";
      showModal("Order Failed", msg);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "COD") handleCOD();
    else if (paymentMethod === "ONLINE") handlePayHere();
    else showModal("Not Supported", "Please select a valid payment method.");
  };

  /* ── Empty cart guard ── */
  if (cart.length === 0)
    return (
      <div className="co-page">
        <div className="co-empty">
          <div className="co-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some items before checking out.</p>
          <Link to="/category" className="co-btn-primary">
            Shop Now
          </Link>
        </div>
      </div>
    );

  const stepLabels = ["Shipping Info", "Delivery", "Payment"];

  return (
    <div className="co-page">
      <div className="co-container">
        {/* Breadcrumb */}
        <nav className="co-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/cart">Cart</Link>
          <span>/</span>
          <span>{stepLabels[step]}</span>
        </nav>

        {/* Stepper */}
        <div className="co-stepper">
          {stepLabels.map((label, i) => (
            <React.Fragment key={i}>
              <div
                className={`co-step ${i < step ? "completed" : i === step ? "active" : "idle"}`}
              >
                <div className="co-step-circle">
                  {i < step ? (
                    <span className="co-step-check">✓</span>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className="co-step-label">{label}</span>
              </div>
              {i < 2 && (
                <div className={`co-step-line ${i < step ? "filled" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="co-step-desc">
          Step {step + 1} of 3 — {stepLabels[step]}
        </p>

        {/* Main layout */}
        <div className="co-grid">
          {/* ═══ LEFT PANEL ═══ */}
          <div className="co-panel">
            {/* ── STEP 0: Shipping Information ── */}
            {step === 0 && (
              <div className="co-card co-fade-in">
                <div className="co-card-head">
                  <span className="co-card-icon">🚚</span>
                  <h2 className="co-card-title">Shipping Information</h2>
                  {form.userId && (
                    <button
                      type="button"
                      className="co-refresh-btn"
                      onClick={refreshProfile}
                      title="Refresh from profile"
                    >
                      <span className="material-symbols-outlined">sync</span>
                      From Profile
                    </button>
                  )}
                </div>

                {profileLoaded && (
                  <div className="co-notice co-notice-success">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                    Updated from your profile
                  </div>
                )}

                {savedAddresses.length > 0 && (
                  <div className="co-saved-addresses">
                    <p className="co-field-label">Saved Addresses</p>
                    <div className="co-address-pills">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          className={`co-address-pill ${form.streetAddress === addr.street ? "active" : ""}`}
                          onClick={() => applyAddress(addr)}
                        >
                          <span className="material-symbols-outlined">
                            {addr.icon || "home"}
                          </span>
                          {addr.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="co-form">
                  <div className="co-field">
                    <label className="co-field-label">Full Name *</label>

                    <input
                      className={`co-input ${errors.fullName ? "co-input-error" : ""}`}
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      value={form.fullName}
                      onChange={handleChange}
                    />

                    {errors.fullName && (
                      <p className="co-error-text">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="co-row-2">
                    <div className="co-field">
                      <label className="co-field-label">Email Address *</label>
                      <input
                        className={`co-input ${errors.email ? "co-input-error" : ""}`}
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <p className="co-error-text">{errors.email}</p>
                      )}
                    </div>
                    <div className="co-field">
                      <label className="co-field-label">Phone Number</label>
                      <input
                        className={`co-input ${errors.phone ? "co-input-error" : ""}`}
                        type="tel"
                        name="phone"
                        placeholder="+94 77 000 0000"
                        value={form.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <p className="co-error-text">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="co-field">
                    <label className="co-field-label">Street Address *</label>
                    <input
                      className={`co-input ${errors.streetAddress ? "co-input-error" : ""}`}
                      type="text"
                      name="streetAddress"
                      placeholder="123 Luxury Lane"
                      value={form.streetAddress}
                      onChange={handleChange}
                    />
                    {errors.streetAddress && (
                      <p className="co-error-text">{errors.streetAddress}</p>
                    )}
                  </div>

                  <div className="co-row-2">
                    <div className="co-field">
                      <label className="co-field-label">District / City</label>
                      <select
                        className={`co-input co-select ${errors.city ? "co-input-error" : ""}`}
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                      >
                        <option value="">Select district</option>
                        {SL_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <p className="co-error-text">{errors.city}</p>
                      )}
                    </div>
                    <div className="co-field">
                      <label className="co-field-label">Postal Code</label>
                      <input
                        className={`co-input ${errors.postalCode ? "co-input-error" : ""}`}
                        type="text"
                        name="postalCode"
                        placeholder="10001"
                        value={form.postalCode}
                        onChange={handleChange}
                      />
                      {errors.postalCode && (
                        <p className="co-error-text">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div className="co-field">
                    <label className="co-field-label">Country</label>
                    <input
                      className={`co-input ${errors.country ? "co-input-error" : ""}`}
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                    />
                    {errors.country && (
                      <p className="co-error-text">{errors.country}</p>
                    )}
                  </div>
                </div>

                <div className="co-nav-row">
                  <div />
                  <button className="co-btn-primary" onClick={goNext}>
                    Continue to Delivery
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 1: Shipping Method ── */}
            {step === 1 && (
              <div className="co-card co-fade-in">
                <div className="co-card-head">
                  <span className="co-card-icon">📬</span>
                  <h2 className="co-card-title">Choose Delivery Method</h2>
                </div>

                <div className="co-methods-list">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`co-method-card ${shippingId === method.id ? "active" : ""}`}
                      onClick={() => setShippingId(method.id)}
                    >
                      <div className="co-method-left">
                        <div
                          className={`co-radio ${shippingId === method.id ? "checked" : ""}`}
                        >
                          {shippingId === method.id && (
                            <span className="material-symbols-outlined">
                              check
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="co-method-icon-wrap">
                            {method.icon}
                          </div>
                          <h3 className="co-method-name">{method.name}</h3>
                          <p className="co-method-time">{method.time}</p>
                        </div>
                      </div>
                      <div className="co-method-price">
                        {method.price === 0 ? (
                          <span className="co-free-tag">FREE</span>
                        ) : (
                          `Rs. ${method.price.toLocaleString()}`
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="co-nav-row">
                  <button className="co-btn-ghost" onClick={goBack}>
                    <span className="material-symbols-outlined">
                      arrow_back
                    </span>
                    Back
                  </button>
                  <button className="co-btn-primary" onClick={goNext}>
                    Continue to Payment
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Payment ── */}
            {step === 2 && (
              <div className="co-card co-fade-in">
                <div className="co-card-head">
                  <span className="co-card-icon">💳</span>
                  <h2 className="co-card-title">Payment Details</h2>
                </div>
                <p className="co-subtitle">
                  Secure your order with your preferred method.
                </p>

                <h3 className="co-section-title">Select Payment Method</h3>
                <div className="co-payment-grid">
                  {PAYMENT_METHODS.map((m) => (
                    <div
                      key={m.id}
                      className={`co-pay-card ${paymentMethod === m.id ? "active" : ""}`}
                      onClick={() => setPaymentMethod(m.id)}
                    >
                      <span className="material-symbols-outlined co-pay-icon">
                        {m.icon}
                      </span>
                      <span className="co-pay-label">{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* Payment info panel */}
                <div className="co-pay-info-panel">
                  {paymentMethod === "ONLINE" && (
                    <div className="co-payhere-info">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw6hK6OstCnuTU7y52e7qC7h_ek_8r3uTORA&s"
                        alt="PayHere"
                        className="co-payhere-logo"
                      />
                      <p>
                        You'll be redirected to PayHere's secure gateway to
                        complete the transaction.
                      </p>
                      <div className="co-secure-badge">
                        <span className="material-symbols-outlined">
                          verified_user
                        </span>
                        SSL Secure Transaction
                      </div>
                    </div>
                  )}
                  {paymentMethod === "COD" && (
                    <div className="co-cod-info">
                      <span className="co-cod-icon">🚛</span>
                      <h3>Pay When You Receive</h3>
                      <p>
                        Payment is collected by the delivery agent upon arrival.
                      </p>
                      <p>
                        A <strong>Rs. 200 </strong>Cash on Delivery handling fee will be added.
                      </p>
                      <div className="co-cod-detail">
                        <div className="co-cod-row">
                          <span>📍 Delivery Address</span>
                          <span>
                            {form.streetAddress || "N/A"}, {form.city || "N/A"}
                          </span>
                        </div>
                        <div className="co-cod-row co-cod-total-row">
                          <span>💰 Amount Due on Delivery</span>
                          <span className="co-cod-amount">
                            Rs. {total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {(paymentMethod === "paypal" ||
                    paymentMethod === "applepay") && (
                    <div className="co-unavailable">
                      <span className="material-symbols-outlined">
                        construction
                      </span>
                      <p>
                        {paymentMethod === "paypal" ? "PayPal" : "Apple Pay"}{" "}
                        integration coming soon.
                      </p>
                    </div>
                  )}
                </div>

                <div className="co-nav-row">
                  <button className="co-btn-ghost" onClick={goBack}>
                    <span className="material-symbols-outlined">
                      arrow_back
                    </span>
                    Back
                  </button>
                  <button
                    className="co-btn-primary co-btn-place"
                    onClick={handlePlaceOrder}
                  >
                    <span className="material-symbols-outlined">
                      shopping_bag
                    </span>
                    {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
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
                    <img
                      src={item.image_url || FALLBACK}
                      alt={item.name}
                      className="co-item-img"
                      onError={handleImgError}
                    />
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
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                disabled={promoApplied}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  if (promoApplied) removePromo();
                }}
                className="co-promo-input"
              />
              {promoApplied ? (
                <button
                  type="button"
                  className="co-promo-btn co-promo-remove"
                  onClick={removePromo}
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  className="co-promo-btn"
                  onClick={applyPromo}
                  disabled={promoLoading}
                >
                  {promoLoading ? "…" : "Apply"}
                </button>
              )}
            </div>
            {promoApplied && (
              <div className="co-promo-badge">
                ✅ <strong>{promoData?.code}</strong> — Rs.{" "}
                {promoDiscount.toLocaleString()} off
              </div>
            )}

            {/* Totals */}
            <div className="co-totals">
              <div className="co-total-row">
                <span>Subtotal</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
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
                  {shippingCharge === 0
                    ? "Free"
                    : `Rs. ${shippingCharge.toLocaleString()}`}
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
                  <span>Method</span>
                  <span>{shippingObj?.name}</span>
                </div>
              )}
              <div className="co-total-final">
                <span>Total</span>
                <span className="co-total-amount">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="co-terms">
              By placing your order you agree to Solevora's{" "}
              <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </aside>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="co-toast">{toast}</div>}

      {/* Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.title}
        actions={
          <button
            className="modal-btn modal-btn-confirm"
            onClick={() => setModal((m) => ({ ...m, open: false }))}
          >
            Got it
          </button>
        }
      >
        <p>{modal.body}</p>
      </Modal>
    </div>
  );
};

export default Checkout;
