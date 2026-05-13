import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./ProductsManagement.css";
import ProductModal from "./ProductModal";
import { showConfirm, showError, showSuccess } from "../utils/notifications";
import { API_URL, getImageUrl as resolveUrl } from "../config/api";

const FALLBACK_IMG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%23f3f4f6'/%3E%3Cpath d='M15 35l8-10 6 7 4-5 8 8H15z' fill='%23d1d5db'/%3E%3Ccircle cx='32' cy='20' r='4' fill='%23d1d5db'/%3E%3C/svg%3E`;

const handleImgError = (e) => {
  if (e.target.src !== FALLBACK_IMG) e.target.src = FALLBACK_IMG;
};

const getTotalStock = (prod) =>
  (prod.stocks || []).reduce((acc, s) => acc + (parseInt(s.quantity) || 0), 0);

const getFirstImage = (prod) => resolveUrl(prod.images?.[0]?.url) || FALLBACK_IMG;

const getStatus = (prod) =>
  prod.isActive === 1 || prod.isActive === true
    ? { label: "Active", badgeClass: "status-active" }
    : { label: "Not Active", badgeClass: "status-out" };

const getSizeStockInfo = (stocks = []) => {
  return stocks.map((s) => {
    const qty = parseInt(s.quantity) || 0;
    // 100 units = 100%, anything above 100 is still capped at 100%
    const pct = Math.min(100, Math.round((qty / 100) * 100));
    const isLow = qty > 0 && qty < 10;
    const barColor = qty === 0 ? "#ef4444" : isLow ? "#f59e0b" : "#f66d3b";
    return { ...s, qty, pct, isLow, barColor };
  });
};

const ProductsManagement = () => {
  const [subTab, setSubTab] = useState("All Products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedStock, setExpandedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterSort, setFilterSort] = useState("newest");

  const categories = [...new Set(products.map((p) => p.category?.name).filter(Boolean))];

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/products/all`);
      setProducts(res.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const handleToggleActive = async (prod) => {
    const isCurrentlyActive = prod.isActive === 1 || prod.isActive === true;
    const action = isCurrentlyActive ? "deactivate" : "activate";

    const confirmed = await showConfirm(
      `${isCurrentlyActive ? "Deactivate" : "Activate"} Product`,
      `Are you sure you want to ${action} "${prod.name}"?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/products/${prod.id}/toggle-active`, {
        data: { isActive: isCurrentlyActive ? 0 : 1 },
      });
      showSuccess("Updated!", `Product has been ${action}d.`);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || `Failed to ${action} product.`;
      showError("Error", msg);
    }
  };

  const handleEdit = (product) => { setSelectedProduct(product); setIsModalOpen(true); };
  const handleAddClick = () => { setSelectedProduct(null); setIsModalOpen(true); };
  const toggleStockExpand = (id) => setExpandedStock((prev) => (prev === id ? null : id));

  const filteredProducts = products
    .filter((prod) => {
      if (subTab !== "All Products" && getStatus(prod).label !== subTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !prod.name?.toLowerCase().includes(q) &&
          !prod.category?.name?.toLowerCase().includes(q) &&
          !prod.description?.toLowerCase().includes(q)
        ) return false;
      }
      if (filterCategory && prod.category?.name !== filterCategory) return false;
      const price = parseFloat(prod.price);
      if (filterMinPrice && price < parseFloat(filterMinPrice)) return false;
      if (filterMaxPrice && price > parseFloat(filterMaxPrice)) return false;
      return true;
    })
    .sort((a, b) => {
      if (filterSort === "price-asc") return parseFloat(a.price) - parseFloat(b.price);
      if (filterSort === "price-desc") return parseFloat(b.price) - parseFloat(a.price);
      if (filterSort === "name-asc") return a.name.localeCompare(b.name);
      if (filterSort === "stock-asc") return getTotalStock(a) - getTotalStock(b);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Category", "Price", "Total Stock", "Status"];
    const rows = filteredProducts.map((p) => [
      p.id, `"${p.name}"`, p.category?.name || "Uncategorized",
      parseFloat(p.price).toFixed(2), getTotalStock(p), getStatus(p).label,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilterCategory(""); setFilterMinPrice(""); setFilterMaxPrice("");
    setFilterSort("newest"); setSearchQuery("");
  };

  return (
    <div className="dashboard-content">

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#111" }}>Product Inventory</h1>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
            Manage and track your premium footwear collection
          </p>
        </div>
        <button
          onClick={handleAddClick}
          style={{
            backgroundColor: "#f66d3b", color: "#fff", border: "none", borderRadius: "8px",
            padding: "10px 20px", fontSize: "14px", fontWeight: "600",
            display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(246,109,59,0.2)",
          }}
        >
          <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Search */}
      <div className="pm-search-row">
        <div className="pm-search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pm-search-icon">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by product name, category, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pm-search-input"
          />
          {searchQuery && (
            <button className="pm-search-clear" onClick={() => setSearchQuery("")}>✕</button>
          )}
        </div>
        <span className="pm-result-count">{filteredProducts.length} of {products.length} products</span>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        <div className="tabs-left">
          {["All Products", "Active", "Not Active"].map((tab) => (
            <button key={tab} className={`tab-link ${subTab === tab ? "active" : ""}`} onClick={() => setSubTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
        <div className="tabs-right">
          <button
            className={`btn-secondary ${showFilterPanel ? "btn-secondary-active" : ""}`}
            onClick={() => setShowFilterPanel((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filter
            {(filterCategory || filterMinPrice || filterMaxPrice || filterSort !== "newest") && (
              <span className="pm-filter-active-dot" />
            )}
          </button>
          <button className="btn-secondary" onClick={handleExportCSV}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="pm-filter-panel">
          <div className="pm-filter-group">
            <label>Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="pm-filter-group">
            <label>Min Price (Rs.)</label>
            <input type="number" placeholder="0" value={filterMinPrice} onChange={(e) => setFilterMinPrice(e.target.value)} />
          </div>
          <div className="pm-filter-group">
            <label>Max Price (Rs.)</label>
            <input type="number" placeholder="Any" value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(e.target.value)} />
          </div>
          <div className="pm-filter-group">
            <label>Sort By</label>
            <select value={filterSort} onChange={(e) => setFilterSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="stock-asc">Stock: Low → High</option>
            </select>
          </div>
          <button className="pm-filter-clear" onClick={clearFilters}>Clear All</button>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>PRODUCT</th><th>CATEGORY</th><th>IMAGES</th>
              <th>SIZES & STOCK</th><th>PRICE</th><th>STATUS</th><th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "50px" }}>Loading inventory...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "50px" }}>No products found.</td></tr>
            ) : (
              filteredProducts.map((prod) => {
                const { label: status, badgeClass } = getStatus(prod);
                const isActive = prod.isActive === 1 || prod.isActive === true;
                const sizeInfos = getSizeStockInfo(prod.stocks || []);
                const totalStock = getTotalStock(prod);

                return (
                  <React.Fragment key={prod.id}>
                    <tr>
                      <td>
                        <div className="td-product">
                          <div className="product-images">
                            <img src={getFirstImage(prod)} alt={prod.name} className="product-img" onError={handleImgError} />
                          </div>
                          <div>
                            <div className="td-product-name">{prod.name}</div>
                            <div className="td-product-desc">
                              {prod.description?.substring(0, 30)}{prod.description?.length > 30 ? "…" : ""}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td><span className="category-badge">{prod.category?.name || "Uncategorized"}</span></td>

                      <td>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", maxWidth: "120px" }}>
                          {(prod.images || []).length === 0 ? (
                            <span style={{ fontSize: "12px", color: "#999" }}>No images</span>
                          ) : (
                            prod.images.map((img, idx) => (
                              <img
                                key={img.id ?? idx}
                                src={resolveUrl(img.url)}
                                alt={`${prod.name} ${idx + 1}`}
                                onError={handleImgError}
                                style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eee" }}
                              />
                            ))
                          )}
                        </div>
                      </td>

                      <td>
                        {sizeInfos.length === 0 ? (
                          <span style={{ fontSize: "12px", color: "#999" }}>—</span>
                        ) : (
                          <button
                            onClick={() => toggleStockExpand(prod.id)}
                            style={{
                              background: "none", border: "1px solid #ddd", borderRadius: "6px",
                              padding: "4px 10px", fontSize: "12px", cursor: "pointer", color: "#555",
                              display: "flex", alignItems: "center", gap: "4px",
                            }}
                          >
                            {sizeInfos.length} size{sizeInfos.length > 1 ? "s" : ""} · {totalStock} pcs
                            <svg
                              style={{ width: "12px", height: "12px", transform: expandedStock === prod.id ? "rotate(180deg)" : "none", transition: "transform .2s" }}
                              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                        )}
                      </td>

                      <td><div className="td-price">Rs. {parseFloat(prod.price).toLocaleString()}/-</div></td>

                      <td>
                        <div className={`status-badge ${badgeClass}`}>
                          <span className="status-dot" />{status}
                        </div>
                      </td>

                      <td>
                        <div className="td-actions">
                          <button className="action-icon" onClick={() => handleEdit(prod)} title="Edit Product">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="action-icon"
                            onClick={() => handleToggleActive(prod)}
                            title={isActive ? "Deactivate Product" : "Activate Product"}
                            style={{ color: isActive ? "#ef4444" : "#22c55e" }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18.36 6.64A9 9 0 1 1 5.64 5.64" />
                              <line x1="12" y1="2" x2="12" y2="12" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedStock === prod.id && (
                      <tr>
                        <td colSpan="7" style={{ background: "#fafafa", padding: "12px 16px 16px 80px" }}>
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "8px" }}>
                            {sizeInfos.map((s) => (
                              <div
                                key={s.id}
                                style={{
                                  border: `1px solid ${s.qty === 0 ? "#fca5a5" : s.isLow ? "#fde68a" : "#d1fae5"}`,
                                  borderRadius: "8px", padding: "8px 14px", minWidth: "80px",
                                  background: s.qty === 0 ? "#fff1f2" : s.isLow ? "#fffbeb" : "#f0fdf4",
                                }}
                              >
                                <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "6px" }}>
                                  SL {s.size}
                                </div>
                                <div style={{ height: "4px", background: "#e5e7eb", borderRadius: "2px", marginBottom: "4px" }}>
                                  <div style={{ height: "4px", width: `${s.pct}%`, backgroundColor: s.barColor, borderRadius: "2px", transition: "width 0.3s" }} />
                                </div>
                                <div style={{ fontSize: "11px", color: s.qty === 0 ? "#ef4444" : "#555" }}>
                                  {s.qty === 0 ? "Out of Stock" : `${s.qty} pcs · ${s.pct}%`}
                                  {s.isLow && <span style={{ color: "#f59e0b", marginLeft: "4px" }}>Low</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
        <div className="pagination">
          <div className="page-info">Showing {filteredProducts.length} products</div>
        </div>
      </div>

      {/* Bottom Metrics */}
      <div className="bottom-metrics">
        <div className="metric-card-bottom">
          <div className="metric-header">
            <div className="metric-icon-circle ic-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div className="metric-badge badge-green">SKUs</div>
          </div>
          <div className="metric-title">TOTAL SKU</div>
          <div className="metric-value">{products.length}</div>
        </div>

        <div className="metric-card-bottom">
          <div className="metric-header">
            <div className="metric-icon-circle ic-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="metric-badge badge-orange">Low Stock</div>
          </div>
          <div className="metric-title">LOW STOCK ITEMS</div>
          <div className="metric-value">
            {products.filter((p) => (p.stocks || []).some((s) => { const q = parseInt(s.quantity) || 0; return q > 0 && q < 10; })).length}
          </div>
        </div>

        <div className="metric-card-bottom">
          <div className="metric-header">
            <div className="metric-icon-circle ic-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="metric-badge badge-gray">Inventory</div>
          </div>
          <div className="metric-title">TOTAL STOCK</div>
          <div className="metric-value">{products.reduce((acc, p) => acc + getTotalStock(p), 0)}</div>
        </div>

        <div className="metric-card-bottom">
          <div className="metric-header">
            <div className="metric-icon-circle ic-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div className="metric-badge badge-red">Not Active</div>
          </div>
          <div className="metric-title">NOT ACTIVE</div>
          <div className="metric-value">
            {products.filter((p) => p.isActive === 0 || p.isActive === false).length}
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductSaved={fetchProducts}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsManagement;