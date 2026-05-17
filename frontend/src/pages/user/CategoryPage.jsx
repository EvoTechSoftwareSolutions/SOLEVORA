import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingCart,
  HiOutlineAdjustments,
  HiX,
  HiChevronDown,
} from "react-icons/hi";

import heroImage     from "../../assets/category/hero-shoe.png";
import catSneakers   from "../../assets/category/cat-sneakers.png";
import catRunning    from "../../assets/category/cat-running.png";
import catFormal     from "../../assets/category/cat-formal.png";
import catBoots      from "../../assets/category/cat-boots.png";
import catSandals    from "../../assets/category/cat-sandals.png";
import catHeels      from "../../assets/category/cat-heels.png";
import catLoafers    from "../../assets/category/cat-loafers.png";
import catAthletic   from "../../assets/category/cat-athletic.png";
import product1      from "../../assets/category/product-1.png";
import product2      from "../../assets/category/product-2.png";
import product3      from "../../assets/category/product-3.png";
import product4      from "../../assets/category/product-4.png";
import product5      from "../../assets/category/product-5.png";
import product6      from "../../assets/category/product-6.png";
import product7      from "../../assets/category/product-7.png";
import product8      from "../../assets/category/product-8.png";
import product9      from "../../assets/category/product-9.png";
import heritageImage from "../../assets/category/heritage-shoe.png";

import SuccessPopup   from "../../components/common/SuccessPoppup";
import SizeChartModal from "../../components/user/SizeChartModal";
import Pagination     from "../../components/common/Pagination";

const BASE_URL = "http://localhost:5001";

const getImg = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url.replace(/\\/g, "/")}`;
};

const FALLBACK =
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ` +
  `width='80' height='80' viewBox='0 0 80 80'%3E` +
  `%3Crect width='80' height='80' fill='%23f3f4f6'/%3E` +
  `%3Cpath d='M20 55l14-18 10 12 8-10 14 16H20z' fill='%23d1d5db'/%3E` +
  `%3Ccircle cx='52' cy='28' r='7' fill='%23d1d5db'/%3E%3C/svg%3E`;

const handleImgError = (e) => { if (e.target.src !== FALLBACK) e.target.src = FALLBACK; };

const FALLBACK_IMAGES = [
  product1, product2, product3, product4, product5,
  product6, product7, product8, product9,
];

const BG_COLORS = [
  "bg-[#f5aa31]", "bg-[#cce3fc]", "bg-[#f3952a]", "bg-[#43523d]",
  "bg-[#ebe8df]", "bg-[#aeea49]", "bg-[#dfdfdf]", "bg-[#efe8e0]",
  "bg-[#dcd0c2]", "bg-[#ffb0b0]",
];

const FALLBACK_SIZES = [
  ["6","7","8"], ["7.5","8.5","9.5","10"],
  ["9","10","11","12"], ["6","8","9","10.5"],
];

const CATEGORIES = [
  { id: 1, title: "Sneakers", subtitle: "Classic modern kicks",  image: catSneakers },
  { id: 2, title: "Running",  subtitle: "Built for performance", image: catRunning  },
  { id: 3, title: "Formal",   subtitle: "Refined modern wear",   image: catFormal   },
  { id: 4, title: "Boots",    subtitle: "Rugged & stylish",      image: catBoots    },
  { id: 5, title: "Sandals",  subtitle: "Summer essentials",     image: catSandals  },
  { id: 6, title: "Heels",    subtitle: "Step up in style",      image: catHeels    },
  { id: 7, title: "Loafers",  subtitle: "Effortless comfort",    image: catLoafers  },
  { id: 8, title: "Athletic", subtitle: "Train harder",          image: catAthletic },
];

const GENDERS = ["All", "Men", "Women", "Kids"];

const PRICE_RANGES = [
  "All",
  "Under Rs.3000",
  "Rs.3000 - Rs.5000",
  "Rs.5000 - Rs.10000",
  "Rs.10000 - Rs.20000",
  "Rs.20000+",
];

  //  SUB-COMPONENTS

/** Collapsible accordion section used inside filter sidebar */
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#e8c99a] pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between mb-3"
        type="button"
      >
        <span className="text-[11px] font-bold text-[#222] uppercase tracking-wider">
          {title}
        </span>
        <HiChevronDown
          size={14}
          className={`text-[#888] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

/** Small removable pill in the active-filters strip */
function FilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#111] text-white text-[10px] font-semibold rounded-full shrink-0">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-red-300 transition ml-0.5">
        <HiX size={10} />
      </button>
    </span>
  );
}

/** Animated placeholder card while fetching */
function SkeletonCard() {
  return (
    <div className="bg-[#f2f2f2] rounded-[18px] overflow-hidden shadow-sm animate-pulse">
      <div className="w-full aspect-[3/2] bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-gray-200 rounded w-1/3" />
        <div className="h-3.5 bg-gray-200 rounded w-4/5" />
        <div className="h-2.5 bg-gray-200 rounded w-full" />
        <div className="h-7 bg-gray-200 rounded-lg w-full mt-3" />
      </div>
    </div>
  );
}

/**
 * All filter controls — shared between desktop sidebar & mobile drawer.
 * onApply is called (optionally) to close the mobile drawer after a selection.
 */
function SidebarFilters({
  selectedCategory, handleCategoryClick,
  selectedGender, setSelectedGender,
  selectedSize, setSelectedSize,
  selectedPrice, setSelectedPrice,
  sizes, setShowSizeChart,
  onApply,
}) {
  return (
    <>
      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-wrap gap-1.5">
          {["All", ...CATEGORIES.map((c) => c.title)].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { handleCategoryClick(cat); onApply?.(); }}
              className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-[#d57731] text-white shadow-sm"
                  : "bg-white text-[#555] hover:bg-[#ffeacc]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender">
        <div className="flex flex-wrap gap-1.5">
          {GENDERS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => { setSelectedGender(g); setSelectedSize(""); }}
              className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                selectedGender === g
                  ? "bg-[#d57731] text-white shadow-sm"
                  : "bg-white text-[#555] hover:bg-[#ffeacc]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Shoe Size">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-[#888]">EU sizing</p>
          <button
            type="button"
            onClick={() => setShowSizeChart(true)}
            className="text-[10px] font-bold text-[#d57731] hover:underline"
          >
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
              className={`rounded-md py-1.5 text-[10px] font-semibold transition-all ${
                selectedSize === size
                  ? "bg-[#d57731] text-white"
                  : "bg-white text-[#555] hover:ring-1 hover:ring-[#d57731]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="flex flex-col gap-1">
          {PRICE_RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedPrice(r)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-semibold transition-all ${
                selectedPrice === r
                  ? "bg-[#d57731] text-white"
                  : "bg-white text-[#555] hover:bg-[#ffeacc]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </FilterSection>
    </>
  );
}

function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  /* Filter state */
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("type") || "All");
  const [selectedGender,   setSelectedGender]   = useState("All");
  const [selectedSize,     setSelectedSize]     = useState("");
  const [selectedPrice,    setSelectedPrice]    = useState("All");
  const [sortBy,           setSortBy]           = useState("featured");

  /* UI state */
  const [showPopup,         setShowPopup]         = useState(false);
  const [popupMessage,      setPopupMessage]      = useState("");
  const [showSizeChart,     setShowSizeChart]     = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  /* Data state */
  const [products,             setProducts]             = useState([]);
  const [selectedProductSizes, setSelectedProductSizes] = useState({});
  const [allCategoryCounts,    setAllCategoryCounts]    = useState({});
  const [currentPage,          setCurrentPage]          = useState(1);
  const [totalPages,           setTotalPages]           = useState(1);
  const [loading,              setLoading]              = useState(false);

  const LIMIT = 12;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  /* Sync URL → state */
  useEffect(() => {
    setSelectedCategory(searchParams.get("type") || "All");
  }, [searchParams]);

  /* Hash-scroll */
  useEffect(() => {
    if (location.hash !== "#product-grid-section") return;
    setTimeout(() => {
      document.getElementById("product-grid-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [location.hash]);

  /* Reset page on any filter change */
  useEffect(() => { setCurrentPage(1); },
    [selectedCategory, selectedGender, selectedSize, selectedPrice, sortBy]);

  /* Fetch products — all filters combined in one API call */
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (selectedCategory !== "All") p.append("category", selectedCategory);
      if (selectedGender   !== "All") p.append("gender",   selectedGender);
      if (selectedSize)               p.append("size",     selectedSize);
      p.append("sortBy", sortBy);
      p.append("page",   page);
      p.append("limit",  LIMIT);

      if      (selectedPrice === "Under Rs.3000")          { p.append("maxPrice", "3000"); }
      else if (selectedPrice === "Rs.3000 - Rs.5000")      { p.append("minPrice","3000");  p.append("maxPrice","5000");  }
      else if (selectedPrice === "Rs.5000 - Rs.10000")     { p.append("minPrice","5000");  p.append("maxPrice","10000"); }
      else if (selectedPrice === "Rs.10000 - Rs.20000")    { p.append("minPrice","10000"); p.append("maxPrice","20000"); }
      else if (selectedPrice === "Rs.20000+")              { p.append("minPrice","20000"); }

      const { data } = await axios.get(`${BASE_URL}/api/products?${p.toString()}`);

      const formatted = (data.data || []).map((item, i) => ({
        id:             item.id,
        category:       item.category?.name || "Uncategorized",
        name:           item.name,
        slug:           item.slug,
        descriptionOne: item.descriptionOne,
        price: parseFloat(item.currentFifoPrice ?? item.price) || 0,
        image:          getImg(item.images?.[0]?.url) || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
        bg:             BG_COLORS[i % BG_COLORS.length],
        gender:         item.gender || (i % 3 === 0 ? "Men" : i % 3 === 1 ? "Women" : "Kids"),
        sizes:          item.stocks?.length > 0
                          ? [...new Set(item.stocks.map((s) => String(s.size)))]
                          : FALLBACK_SIZES[i % FALLBACK_SIZES.length],
        badge: i === 0 ? "New" : "",
      }));

      setProducts(formatted);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(page);

      /* Category counts – fetched once */
      if (Object.keys(allCategoryCounts).length === 0) {
        const { data: all } = await axios.get(`${BASE_URL}/api/products`);
        const counts = {};
        all.data.forEach((item) => {
          const n = item.category?.name || "Uncategorized";
          counts[n] = (counts[n] || 0) + 1;
        });
        setAllCategoryCounts(counts);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [selectedCategory, selectedGender, selectedSize, selectedPrice, sortBy, currentPage]); // eslint-disable-line

  /* Auth helper */
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  const handleWishlistToggle = (product) => {
    if (!user) { setPopupMessage("Please login to add items to your wishlist."); setShowPopup(true); return; }
    if (isInWishlist(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const handleAddToCart = (product) => {
    if (!user) { setPopupMessage("Please login to add items to your cart."); setShowPopup(true); return; }
    const size = selectedProductSizes[product.id] || product.sizes?.[0] || "One Size";
    addToCart({ id: product.id, name: product.name, price: product.price }, size);
  };

  /* Toggle category: click same category → deselect back to All */
  const handleCategoryClick = (cat) => {
    const next = selectedCategory === cat && cat !== "All" ? "All" : cat;
    setSelectedCategory(next);
    if (next === "All") searchParams.delete("type");
    else                searchParams.set("type", next);
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedGender("All");
    setSelectedSize("");
    setSelectedPrice("All");
    setSortBy("featured");
    searchParams.delete("type");
    setSearchParams(searchParams);
  };

  const scrollToGrid = () =>
    document.getElementById("product-grid-section")
      ?.scrollIntoView({ behavior: "smooth" });

  /* Derived */
  const sizes = useMemo(() => {
    const all = new Set();
    products.forEach((p) => p.sizes?.forEach((s) => all.add(String(s))));
    const sorted = [...all].sort((a, b) => parseFloat(a) - parseFloat(b));
    return sorted.length > 0
      ? sorted
      : ["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11","12"];
  }, [products]);

  const hasActiveFilters =
    selectedCategory !== "All" || selectedGender !== "All" ||
    selectedSize !== "" || selectedPrice !== "All";

  const activeFilterCount = [
    selectedCategory !== "All",
    selectedGender   !== "All",
    selectedSize     !== "",
    selectedPrice    !== "All",
  ].filter(Boolean).length;

  /* Shared props for the filter sidebar */
  const filterProps = {
    selectedCategory, handleCategoryClick,
    selectedGender, setSelectedGender,
    selectedSize, setSelectedSize,
    selectedPrice, setSelectedPrice,
    sizes, setShowSizeChart,
  };

  return (
    <div className="bg-[#f6f6f6] min-h-screen w-full overflow-x-hidden">

      {showPopup && (
        <SuccessPopup message={popupMessage} onClose={() => setShowPopup(false)} type="notice" />
      )}
      <SizeChartModal isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} />

      {/*
          HERO  —  fluid height with clamp so it never breaks
      */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(200px, 44vw, 560px)" }}
      >
        <img
          src={heroImage}
          alt="Spring Collection"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/38" />

        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 lg:px-16 xl:px-20">
          <span
            className="inline-flex w-fit bg-white/20 text-white px-3 py-1 rounded-full mb-2 sm:mb-4"
            style={{ fontSize: "clamp(9px, 1.4vw, 12px)" }}
          >
            New Season
          </span>
          <h1
            className="font-bold leading-[1.15] text-white"
            style={{ fontSize: "clamp(20px, 5.2vw, 68px)" }}
          >
            Spring Collection
            <br />
            <span className="text-[#f3b126]">2026</span>
          </h1>
          <p
            className="mt-2 sm:mt-4 text-white/85 leading-relaxed"
            style={{
              fontSize: "clamp(10px, 1.7vw, 16px)",
              maxWidth: "min(430px, 80vw)",
            }}
          >
            Discover our latest arrivals designed for effortless style and
            uncompromising comfort.
          </p>
          <button
            onClick={scrollToGrid}
            className="mt-3 sm:mt-5 w-fit rounded-full bg-[#dd8e4a] hover:bg-[#c97e40] transition-colors font-medium text-white shadow-lg"
            style={{
              fontSize: "clamp(10px, 1.5vw, 15px)",
              padding: "clamp(7px,1.2vw,12px) clamp(14px,2.5vw,24px)",
            }}
          >
            Shop the Collection →
          </button>
        </div>
      </section>

      {/* 
          CATEGORY CARDS
          320px  → 2-col
          640px  → 3-col
          768px  → 4-col
          1280px → 4-col wider cards
      */}
      <section className="w-full bg-white px-3 sm:px-8 lg:px-14 xl:px-20 py-8 sm:py-12 lg:py-16">
        {/* heading */}
        <div className="max-w-2xl mx-auto text-center mb-6 sm:mb-10">
          <h2
            className="font-bold text-[#222]"
            style={{ fontSize: "clamp(17px, 2.8vw, 30px)" }}
          >
            Shop by Category
          </h2>
          <div className="w-10 h-[3px] rounded-full bg-[#df8b4a] mx-auto mt-2 mb-3" />
          <p className="text-[#666] text-sm leading-6 hidden sm:block">
            Explore our curated collections designed for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 lg:gap-5">
          {CATEGORIES.map((item) => (
            <div
              key={item.id}
              onClick={() => { handleCategoryClick(item.title); scrollToGrid(); }}
              className={`cursor-pointer group rounded-xl sm:rounded-2xl p-1.5 sm:p-2 transition-all duration-300 ${
                selectedCategory === item.title ? "bg-[#fff4e6]" : "hover:bg-[#fdf5eb]"
              }`}
            >
              <div
                className={`relative overflow-hidden rounded-lg sm:rounded-xl shadow-sm transition-all duration-300 ${
                  selectedCategory === item.title ? "ring-2 ring-[#df8b4a]" : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ height: "clamp(90px, 13vw, 190px)" }}
                />
                <span
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-full shadow-sm transition-colors ${
                    selectedCategory === item.title
                      ? "bg-[#df8b4a] text-white"
                      : "bg-white/90 text-[#333]"
                  }`}
                  style={{ fontSize: "clamp(8px, 1vw, 11px)" }}
                >
                  {allCategoryCounts[item.title] || 0}
                </span>
              </div>
              <h3
                className={`mt-2 font-semibold leading-tight transition-colors ${
                  selectedCategory === item.title
                    ? "text-[#df8b4a]"
                    : "text-[#222] group-hover:text-[#e58a45]"
                }`}
                style={{ fontSize: "clamp(11px, 1.5vw, 17px)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-[#777] mt-0.5 hidden sm:block leading-tight"
                style={{ fontSize: "clamp(9px, 1vw, 13px)" }}
              >
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>

          {/* PRODUCT SECTION */}
      <section
        id="product-grid-section"
        className="w-full bg-[#faecd9]"
        style={{ scrollMarginTop: 80 }}
      >
        {/* ── Top bar: title + sort + mobile filter trigger ── */}
        <div className="flex items-center justify-between gap-2 px-3 sm:px-8 lg:px-14 xl:px-20 py-3 sm:py-4 bg-[#fbf2e1] border-b border-[#f0e2cb]">
          {/* Title */}
          <div className="min-w-0 flex-1">
            <h2
              className="font-bold text-[#1f1f1f] truncate"
              style={{ fontSize: "clamp(13px, 2.2vw, 22px)" }}
            >
              {selectedCategory === "All" ? "All Shoes" : selectedCategory}
              {selectedGender !== "All" && (
                <span className="text-[#d57731] ml-1">— {selectedGender}</span>
              )}
            </h2>
            <p className="text-[#999] mt-0.5" style={{ fontSize: "clamp(9px, 1vw, 11px)" }}>
              {loading ? "Loading…" : `${products.length} items`}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile/tablet filter button — hidden on lg+ where sidebar is always visible */}
            <button
              type="button"
              onClick={() => setShowMobileSidebar(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#111] text-white rounded-full font-bold whitespace-nowrap"
              style={{ fontSize: "clamp(9px, 1.3vw, 12px)" }}
            >
              <HiOutlineAdjustments size={13} />
              <span className="hidden xs:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#d57731] text-white text-[9px] flex items-center justify-center leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#e5d5c0] rounded-full pl-2.5 sm:pl-3 pr-6 sm:pr-7 py-1.5 text-[#555] font-semibold outline-none cursor-pointer appearance-none shadow-sm"
                style={{ fontSize: "clamp(9px, 1.2vw, 12px)" }}
              >
                <option value="featured">Featured</option>
                <option value="low-high">Price ↑</option>
                <option value="high-low">Price ↓</option>
                <option value="newest">Newest</option>
              </select>
              <HiChevronDown
                size={11}
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#888]"
              />
            </div>
          </div>
        </div>

        {/* ── Active filter pills strip ── */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 px-3 sm:px-8 lg:px-14 xl:px-20 py-2 bg-[#fbf2e1] border-b border-[#f0e2cb]">
            <span className="text-[9px] text-[#aaa] font-bold uppercase tracking-wider shrink-0">
              Active:
            </span>
            {selectedCategory !== "All" && (
              <FilterPill label={selectedCategory} onRemove={() => handleCategoryClick("All")} />
            )}
            {selectedGender !== "All" && (
              <FilterPill label={selectedGender} onRemove={() => setSelectedGender("All")} />
            )}
            {selectedSize && (
              <FilterPill label={`Size ${selectedSize}`} onRemove={() => setSelectedSize("")} />
            )}
            {selectedPrice !== "All" && (
              <FilterPill label={selectedPrice} onRemove={() => setSelectedPrice("All")} />
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="text-[10px] font-bold text-red-500 hover:text-red-700 underline ml-1 shrink-0"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Sidebar + grid layout ── */}
        <div className="px-3 sm:px-8 lg:px-14 xl:px-20 pt-5 pb-20 lg:pb-14 flex gap-5 xl:gap-7 items-start">

          {/* Desktop sidebar — only shown lg+ */}
          <aside className="hidden lg:block w-[210px] xl:w-[240px] shrink-0 sticky top-[90px] self-start bg-[#fbddba] rounded-[18px] p-4 xl:p-5 shadow-sm max-h-[calc(100vh-110px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <HiOutlineAdjustments size={15} className="text-[#d57731]" />
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#222]">
                  Filters
                </span>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[10px] font-bold text-[#d57731] hover:bg-[#d57731] hover:text-white bg-white px-2.5 py-1 rounded-full shadow-sm transition-all"
                >
                  Clear All
                </button>
              )}
            </div>
            <SidebarFilters {...filterProps} />
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            {loading ? (
              /*
                Skeleton — columns match live grid so no layout shift:
                < lg  → 2 cols (no sidebar)
                >= lg → 3 cols (sidebar takes ~220px)
              */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-5xl mb-4">👟</span>
                <h3
                  className="font-semibold text-[#333]"
                  style={{ fontSize: "clamp(16px, 2.5vw, 22px)" }}
                >
                  No products found
                </h3>
                <p className="text-[#777] mt-2 text-sm">
                  Try adjusting your filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 px-6 py-2.5 rounded-full bg-[#d57731] text-white font-bold text-sm hover:bg-[#b85e28] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/*
                  RESPONSIVE GRID COLUMNS
                  320–639px   (no sidebar)   → 2 cols
                  640–1023px  (no sidebar)   → 3 cols
                  1024–1279px (sidebar 210px)→ 3 cols  ← enough space
                  1280px+     (sidebar 240px)→ 3 cols  (xl cards are larger)
                  Using grid-cols-2 sm:grid-cols-3 covers all cases cleanly.
                  The sidebar only appears at lg+ and is narrow enough that
                  3 product columns still fit comfortably.
                */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 xl:gap-5">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#f2f2f2] rounded-[16px] sm:rounded-[20px] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                      {/* Image zone */}
                      <div
                        className={`relative w-full flex items-center justify-center overflow-hidden ${product.bg}`}
                        style={{ aspectRatio: "3/2" }}
                      >
                        {product.badge && (
                          <span
                            className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#ff6b3d] text-white font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full z-10 shadow-sm uppercase tracking-wider"
                            style={{ fontSize: "clamp(7px, 1.1vw, 10px)" }}
                          >
                            {product.badge}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleWishlistToggle(product)}
                          className={`absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-sm ${
                            isInWishlist(product.id)
                              ? "bg-gradient-to-br from-[#ff4d6d] to-[#ff758f] text-white scale-105"
                              : "bg-white/80 text-[#888] hover:text-red-500 hover:bg-white"
                          }`}
                          style={{
                            width:  "clamp(26px, 4vw, 36px)",
                            height: "clamp(26px, 4vw, 36px)",
                          }}
                        >
                          {isInWishlist(product.id)
                            ? <HiHeart size={14} />
                            : <HiOutlineHeart size={14} />}
                        </button>
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={handleImgError}
                          className="object-contain w-full h-full p-2 sm:p-3 drop-shadow-xl hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Info zone */}
                      <div className="px-2.5 sm:px-4 pt-2 pb-2.5 sm:pb-3 flex flex-col flex-1">
                        <p
                          className="text-[#ff5c45] font-bold uppercase tracking-wider mb-0.5"
                          style={{ fontSize: "clamp(7px, 1vw, 10px)" }}
                        >
                          {product.category}
                        </p>
                        <h3
                          className="font-semibold text-[#222] truncate leading-tight"
                          style={{ fontSize: "clamp(11px, 1.7vw, 16px)" }}
                        >
                          {product.name}
                        </h3>
                        <p
                          className="text-[#6b7280] mt-0.5 line-clamp-2 leading-relaxed hidden sm:block"
                          style={{ fontSize: "clamp(9px, 1.1vw, 12px)" }}
                        >
                          {product.descriptionOne}
                        </p>

                        {/* Price + size selector */}
                        <div className="mt-1.5 flex items-center justify-between gap-1 flex-wrap">
                          <p
                            className="font-bold text-[#0f172a] shrink-0"
                            style={{ fontSize: "clamp(12px, 1.9vw, 19px)" }}
                          >
                            Rs.{product.price.toLocaleString()}
                          </p>
                          <select
                            value={selectedProductSizes[product.id] || ""}
                            onChange={(e) =>
                              setSelectedProductSizes((prev) => ({
                                ...prev,
                                [product.id]: e.target.value,
                              }))
                            }
                            className="font-bold bg-white border border-[#e5e7eb] rounded-md px-1 py-0.5 outline-none max-w-[58px] sm:max-w-none"
                            style={{ fontSize: "clamp(8px, 1vw, 11px)" }}
                          >
                            <option value="" disabled>Size</option>
                            {product.sizes?.map((sz) => (
                              <option key={sz} value={sz}>{sz}</option>
                            ))}
                          </select>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 mt-2 sm:mt-3">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/product/${product.slug}`, {
                                state: { productImage: product.image },
                              })
                            }
                            className="flex-1 py-1.5 sm:py-2.5 bg-white/90 border border-[#d1d5db] text-[#374151] font-medium rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
                            style={{ fontSize: "clamp(9px, 1.2vw, 13px)" }}
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="shrink-0 rounded-lg bg-[#111827] text-white flex items-center justify-center hover:bg-[#374151] transition-colors"
                            style={{
                              width:  "clamp(28px, 4vw, 38px)",
                              height: "clamp(28px, 4vw, 38px)",
                            }}
                          >
                            <HiOutlineShoppingCart size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => { setCurrentPage(page); scrollToGrid(); }}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/*
          MOBILE FILTER DRAWER  (slide-in from left, lg hidden)
          Body-scroll is NOT locked here to keep it lightweight;
          the overlay click closes it instead.
      */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          {/* Dim overlay */}
          <div
            className="absolute inset-0 bg-black/45"
            onClick={() => setShowMobileSidebar(false)}
          />

          {/* Drawer panel */}
          <div
            className="relative z-10 h-full overflow-y-auto bg-[#fbddba] shadow-2xl flex flex-col"
            style={{ width: "min(82vw, 300px)" }}
          >
            {/* Sticky header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#e8c99a] sticky top-0 bg-[#fbddba] z-10">
              <div className="flex items-center gap-2">
                <HiOutlineAdjustments size={15} className="text-[#d57731]" />
                <span className="font-bold text-sm text-[#222]">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#d57731] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[11px] font-bold text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowMobileSidebar(false)}
                  className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-[#555]"
                >
                  <HiX size={14} />
                </button>
              </div>
            </div>

            {/* Scrollable filter body */}
            <div className="flex-1 px-4 py-4 overflow-y-auto">
              <SidebarFilters
                {...filterProps}
                onApply={() => setShowMobileSidebar(false)}
              />
            </div>

            {/* Sticky footer CTA */}
            <div className="px-4 py-3 border-t border-[#e8c99a] sticky bottom-0 bg-[#fbddba]">
              <button
                type="button"
                onClick={() => setShowMobileSidebar(false)}
                className="w-full py-3 bg-[#111] text-white rounded-full font-bold text-sm hover:bg-[#333] transition-colors"
              >
                Show {loading ? "…" : products.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

          {/* HERITAGE BANNER */}

      <section className="w-full px-3 sm:px-8 lg:px-14 xl:px-20 py-10 sm:py-14 bg-[#f6f6f6]">
        <div className="rounded-[20px] sm:rounded-[28px] overflow-hidden bg-[#e8ddd6] grid grid-cols-1 sm:grid-cols-2 shadow-sm">
          <div className="bg-[#e7cfcf] flex items-center justify-center p-5 sm:p-8">
            <img
              src={heritageImage}
              alt="Heritage Collection"
              className="w-full object-contain hover:scale-105 transition-transform duration-500"
              style={{ maxWidth: "clamp(160px, 32vw, 340px)" }}
            />
          </div>
          <div className="flex flex-col justify-center px-5 sm:px-8 lg:px-12 py-6 sm:py-10">
            <span
              className="text-[#df8b4a] uppercase tracking-widest font-semibold"
              style={{ fontSize: "clamp(9px, 1.1vw, 12px)" }}
            >
              Limited Edition
            </span>
            <h2
              className="font-bold text-[#1f1f1f] mt-2 leading-tight"
              style={{ fontSize: "clamp(20px, 3.8vw, 40px)" }}
            >
              The Heritage<br />Collection
            </h2>
            <p
              className="text-[#666] mt-3 leading-7 max-w-md"
              style={{ fontSize: "clamp(11px, 1.4vw, 15px)" }}
            >
              Discover our most enduring line yet. Handcrafted with full grain leather
              and designed to age beautifully over time.
            </p>
            <button className="mt-5 w-fit px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-[#222] text-[#222] hover:bg-[#222] hover:text-white transition-all duration-300 font-medium text-sm">
              Explore Heritage →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CategoryPage;