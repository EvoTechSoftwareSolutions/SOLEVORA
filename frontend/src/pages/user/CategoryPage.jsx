import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import {
  useNavigate,
  Link,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingCart,
  HiOutlineAdjustments,
} from "react-icons/hi";

import heroImage from "../../assets/category/hero-shoe.png";
import catSneakers from "../../assets/category/cat-sneakers.png";
import catRunning from "../../assets/category/cat-running.png";
import catFormal from "../../assets/category/cat-formal.png";
import catBoots from "../../assets/category/cat-boots.png";
import catSandals from "../../assets/category/cat-sandals.png";
import catHeels from "../../assets/category/cat-heels.png";
import catLoafers from "../../assets/category/cat-loafers.png";
import catAthletic from "../../assets/category/cat-athletic.png";
import product1 from "../../assets/category/product-1.png";
import product2 from "../../assets/category/product-2.png";
import product3 from "../../assets/category/product-3.png";
import product4 from "../../assets/category/product-4.png";
import product5 from "../../assets/category/product-5.png";
import product6 from "../../assets/category/product-6.png";
import product7 from "../../assets/category/product-7.png";
import product8 from "../../assets/category/product-8.png";
import product9 from "../../assets/category/product-9.png";
import heritageImage from "../../assets/category/heritage-shoe.png";

import SuccessPopup from "../../components/common/SuccessPoppup";
import SizeChartModal from "../../components/user/SizeChartModal";
import Pagination from "../../components/common/Pagination";

// shared image helper
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

const handleImgError = (e) => {
  if (e.target.src !== FALLBACK) e.target.src = FALLBACK;
};

function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("type") || "All",
  );
  const [sortBy, setSortBy] = useState("featured");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductSizes, setSelectedProductSizes] = useState({});
  const [allCategoryCounts, setAllCategoryCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilterPanel, setActiveFilterPanel] = useState(null); // 'gender' | 'size' | 'price' | null
  const limit = 12;

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) setSelectedCategory(type);
  }, [searchParams]);

  useEffect(() => {
    if (location.hash !== "#product-grid-section") return;
    window.setTimeout(() => {
      document
        .getElementById("product-grid-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [location.hash]);

  const handleCategoryClick = (categoryName) => {
    const newCategory =
      selectedCategory === categoryName ? "All" : categoryName;
    setSelectedCategory(newCategory);
    if (newCategory === "All") searchParams.delete("type");
    else searchParams.set("type", newCategory);
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

  const user = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  const handleWishlistToggle = (product) => {
    if (!user) {
      setPopupMessage("Please login to add items to your wishlist.");
      setShowPopup(true);
      return;
    }
    if (isInWishlist(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  // addToCart now only needs product.id and size — CartContext handles the rest
  const handleAddToCart = (product) => {
    if (!user) {
      setPopupMessage("Please login to add items to your cart.");
      setShowPopup(true);
      return;
    }
    const selectedSize =
      selectedProductSizes[product.id] || product.sizes?.[0] || "One Size";
    addToCart(
      { id: product.id, name: product.name, price: product.price },
      selectedSize,
    );
  };

  const categories = [
    {
      id: 1,
      title: "Sneakers",
      subtitle: "Classic modern kicks",
      image: catSneakers,
    },
    {
      id: 2,
      title: "Running",
      subtitle: "Built for performance",
      image: catRunning,
    },
    {
      id: 3,
      title: "Formal",
      subtitle: "Refined modern wear",
      image: catFormal,
    },
    { id: 4, title: "Boots", subtitle: "Rugged & stylish", image: catBoots },
    {
      id: 5,
      title: "Sandals",
      subtitle: "Summer essentials",
      image: catSandals,
    },
    { id: 6, title: "Heels", subtitle: "Step up in style", image: catHeels },
    {
      id: 7,
      title: "Loafers",
      subtitle: "Effortless comfort",
      image: catLoafers,
    },
    { id: 8, title: "Athletic", subtitle: "Train harder", image: catAthletic },
  ];

  const fallbackImages = [
    product1,
    product2,
    product3,
    product4,
    product5,
    product6,
    product7,
    product8,
    product9,
  ];
  const bgColors = [
    "bg-[#f5aa31]",
    "bg-[#cce3fc]",
    "bg-[#f3952a]",
    "bg-[#43523d]",
    "bg-[#ebe8df]",
    "bg-[#aeea49]",
    "bg-[#dfdfdf]",
    "bg-[#efe8e0]",
    "bg-[#dcd0c2]",
    "bg-[#ffb0b0]",
  ];
  const fallbackSizesList = [
    ["6", "7", "8"],
    ["7.5", "8.5", "9.5", "10"],
    ["9", "10", "11", "12"],
    ["6", "8", "9", "10.5"],
  ];

  const fetchProducts = async (page = 1) => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "All")
        params.append("category", selectedCategory);
      if (selectedGender && selectedGender !== "All")
        params.append("gender", selectedGender);
      if (selectedSize) params.append("size", selectedSize);
      if (sortBy) params.append("sortBy", sortBy);
      params.append("page", page);
      params.append("limit", limit);

      if (selectedPrice !== "All") {
        if (selectedPrice === "Under Rs.3000")
          params.append("maxPrice", "3000");
        else if (selectedPrice === "Rs.3000 - Rs.5000") {
          params.append("minPrice", "3000");
          params.append("maxPrice", "5000");
        } else if (selectedPrice === "Rs.5000 - Rs.10000") {
          params.append("minPrice", "5000");
          params.append("maxPrice", "10000");
        } else if (selectedPrice === "Rs.10000 - Rs.20000") {
          params.append("minPrice", "10000");
          params.append("maxPrice", "20000");
        } else if (selectedPrice === "Rs.20000+")
          params.append("minPrice", "20000");
      }

      const { data } = await axios.get(
        `${BASE_URL}/api/products?${params.toString()}`,
      );
      const baseFormatted = data.data.map((p, index) => ({
        id: p.id,
        category: p.category?.name || "Uncategorized",
        name: p.name,
        slug: p.slug,
        descriptionOne: p.descriptionOne,
        price: parseFloat(p.price) || 0,
        image:
          getImg(p.images?.[0]?.url) ||
          fallbackImages[index % fallbackImages.length],
        bg: bgColors[index % bgColors.length],
        gender:
          p.gender ||
          (index % 3 === 0 ? "Men" : index % 3 === 1 ? "Women" : "Kids"),
        sizes:
          p.stocks?.length > 0
            ? [...new Set(p.stocks.map((s) => String(s.size)))]
            : fallbackSizesList[index % fallbackSizesList.length],
        featured: p.isFeatured || false,
        badge: index === 0 ? "New" : "",
      }));
      setProducts(baseFormatted);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(page);

      // Fetch ALL products once (without filters) to get accurate category counts
      if (Object.keys(allCategoryCounts).length === 0) {
        const { data: allData } = await axios.get(`${BASE_URL}/api/products`);
        const counts = {};
        allData.data.forEach((p) => {
          const catName = p.category?.name || "Uncategorized";
          counts[catName] = (counts[catName] || 0) + 1;
        });
        setAllCategoryCounts(counts);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
    // Silent background refresh every 3 seconds - disabled to avoid page jumping
    /*
    const interval = setInterval(() => fetchProducts(currentPage), 3000);
    return () => clearInterval(interval);
    */
  }, [
    selectedCategory,
    selectedGender,
    selectedSize,
    selectedPrice,
    sortBy,
    currentPage,
  ]);

  const displayedProducts = useMemo(() => {
    return products;
  }, [products]);

  const sizes = useMemo(() => {
    const allSizes = new Set();
    products.forEach((p) => p.sizes?.forEach((s) => allSizes.add(String(s))));
    const sorted = Array.from(allSizes).sort(
      (a, b) => parseFloat(a) - parseFloat(b),
    );
    return sorted.length > 0
      ? sorted
      : [
          "6",
          "6.5",
          "7",
          "7.5",
          "8",
          "8.5",
          "9",
          "9.5",
          "10",
          "10.5",
          "11",
          "12",
        ];
  }, [products]);

  const priceRanges = [
    "All",
    "Under Rs.3000",
    "Rs.3000 - Rs.5000",
    "Rs.5000 - Rs.10000",
    "Rs.10000 - Rs.20000",
    "Rs.20000+",
  ];

  const categoryCounts = useMemo(() => {
    return allCategoryCounts;
  }, [allCategoryCounts]);

  return (
    <div className="bg-[#f6f6f6] min-h-screen">
      {showPopup && (
        <SuccessPopup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
          type="notice"
        />
      )}
      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
      />

      {/* Hero */}
      <section className="relative h-[340px] sm:h-[420px] lg:h-[520px] overflow-hidden">
        <img
          src={heroImage}
          alt="Spring Collection"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 lg:left-16 text-white max-w-[520px]">
          <span className="inline-block bg-white/15 text-[10px] sm:text-xs px-3 py-1 rounded-full mb-4">
            New Season
          </span>
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Spring Collection
            <br />
            <span className="text-[#f3b126]">2026</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/90 max-w-[430px] leading-7">
            Discover our latest arrivals designed for effortless style and
            uncompromising comfort.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("product-grid-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-5 px-6 py-3 rounded-full bg-[#dd8e4a] hover:bg-[#c97e40] transition duration-300 text-sm sm:text-base font-medium shadow-lg"
          >
            Shop the Collection →
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 bg-white sm:px-8 lg:px-16 py-14">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#222]">
            Shop by Category
          </h2>
          <div className="w-12 h-[3px] rounded-full bg-[#df8b4a] mx-auto mt-3 mb-4" />
          <p className="text-[#666] text-sm sm:text-base leading-7">
            Explore our curated collections designed for every occasion.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4 xl:grid-cols-4 sm:gap-5">
          {categories.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                handleCategoryClick(item.title);
                document
                  .getElementById("product-grid-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`transition duration-300 cursor-pointer group p-2 rounded-2xl ${selectedCategory === item.title ? "bg-[#fff4e6]" : ""}`}
            >
              <div
                className={`relative overflow-hidden shadow-sm rounded-xl transition-all duration-300 ${selectedCategory === item.title ? "ring-2 ring-[#df8b4a]" : ""}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[140px] sm:h-[160px] lg:h-[180px] object-cover group-hover:scale-105 transition duration-500"
                />
                <span
                  className={`absolute top-3 right-3 text-[10px] sm:text-xs px-3 py-1 rounded-full shadow-sm transition-colors ${selectedCategory === item.title ? "bg-[#df8b4a] text-white" : "bg-white text-[#333]"}`}
                >
                  {categoryCounts[item.title] || 0} Items
                </span>
              </div>
              <h3
                className={`mt-3 text-sm sm:text-lg font-semibold transition ${selectedCategory === item.title ? "text-[#df8b4a]" : "text-[#222] group-hover:text-[#e58a45]"}`}
              >
                {item.title}
              </h3>
              <p className="text-[#777] text-xs sm:text-sm mt-1">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section
        id="product-grid-section"
        className="bg-[#faecd9]"
        style={{ scrollMarginTop: 110 }}
      >
        {/* Title + Sort row */}
        <div className="flex flex-row items-center justify-between gap-2 px-4 py-4 sm:px-8 lg:px-16 bg-[#fbf2e1]">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-[#1f1f1f] whitespace-nowrap">
              {selectedCategory === "All" ? "All Shoes" : `${selectedCategory}`}
            </h2>
            <p className="text-[#888] text-[10px] sm:text-xs">
              {displayedProducts.length} items
            </p>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/50 border border-[#eee] rounded-full px-3 py-1.5 text-[10px] sm:text-xs text-[#555] font-bold outline-none cursor-pointer appearance-none pr-8 shadow-sm"
            >
              <option value="featured">Sort: Featured</option>
              <option value="low-high">Price: Low-High</option>
              <option value="high-low">Price: High-Low</option>
              <option value="newest">Newest</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#888]">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile: Unified filter chip row – Category, Gender, Size, Price */}
        <div
          className="md:hidden flex items-center gap-2 px-4 py-3 bg-[#fbf2e1] border-b border-[#f0e0cc] overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Clear chip */}
          {(selectedCategory !== "All" ||
            selectedGender !== "All" ||
            selectedSize !== "" ||
            selectedPrice !== "All") && (
            <button
              onClick={clearFilters}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-red-50 text-red-500 text-[11px] font-bold border border-red-200 whitespace-nowrap"
            >
              Clear
            </button>
          )}

          {/* Category chip */}
          <button
            onClick={() =>
              setActiveFilterPanel(
                activeFilterPanel === "category" ? null : "category",
              )
            }
            className={`flex-shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-full text-[12px] font-semibold border transition whitespace-nowrap ${
              selectedCategory !== "All"
                ? "bg-[#111] text-white border-[#111]"
                : "bg-white text-[#333] border-[#ccc]"
            }`}
          >
            {selectedCategory !== "All" ? selectedCategory : "Category"}
            <svg
              className="w-3 h-3 ml-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Gender chip */}
          <button
            onClick={() =>
              setActiveFilterPanel(
                activeFilterPanel === "gender" ? null : "gender",
              )
            }
            className={`flex-shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-full text-[12px] font-semibold border transition whitespace-nowrap ${
              selectedGender !== "All"
                ? "bg-[#111] text-white border-[#111]"
                : "bg-white text-[#333] border-[#ccc]"
            }`}
          >
            Gender
            {selectedGender !== "All" && (
              <span className="text-[10px] opacity-75">({selectedGender})</span>
            )}
            <svg
              className="w-3 h-3 ml-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Size chip */}
          <button
            onClick={() =>
              setActiveFilterPanel(activeFilterPanel === "size" ? null : "size")
            }
            className={`flex-shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-full text-[12px] font-semibold border transition whitespace-nowrap ${
              selectedSize !== ""
                ? "bg-[#111] text-white border-[#111]"
                : "bg-white text-[#333] border-[#ccc]"
            }`}
          >
            Size
            {selectedSize && (
              <span className="text-[10px] opacity-75">({selectedSize})</span>
            )}
            <svg
              className="w-3 h-3 ml-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Price chip */}
          <button
            onClick={() =>
              setActiveFilterPanel(
                activeFilterPanel === "price" ? null : "price",
              )
            }
            className={`flex-shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-full text-[12px] font-semibold border transition whitespace-nowrap ${
              selectedPrice !== "All"
                ? "bg-[#111] text-white border-[#111]"
                : "bg-white text-[#333] border-[#ccc]"
            }`}
          >
            Price
            {selectedPrice !== "All" && (
              <span className="text-[10px] opacity-75">({selectedPrice})</span>
            )}
            <svg
              className="w-3 h-3 ml-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Mobile slide-up filter panels + backdrop */}
        {activeFilterPanel && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setActiveFilterPanel(null)}
            />

            {/* Category panel */}
            {activeFilterPanel === "category" && (
              <div className="relative z-10 bg-white rounded-t-2xl shadow-2xl px-5 pt-4 pb-8">
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[15px] text-[#111]">
                    Category
                  </h3>
                  <button
                    onClick={() => setActiveFilterPanel(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {["All", ...categories.map((c) => c.title)].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleCategoryClick(cat);
                        setActiveFilterPanel(null);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                        selectedCategory === cat
                          ? "bg-[#111] text-white border-[#111]"
                          : "bg-white text-[#444] border-[#ddd]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActiveFilterPanel(null)}
                  className="w-full py-3 bg-[#111] text-white rounded-full font-bold text-sm"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Gender panel */}
            {activeFilterPanel === "gender" && (
              <div className="relative z-10 bg-white rounded-t-2xl shadow-2xl px-5 pt-4 pb-8">
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[15px] text-[#111]">Gender</h3>
                  <button
                    onClick={() => setActiveFilterPanel(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {["All", "Men", "Women", "Kids"].map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setSelectedGender(g);
                        setSelectedSize("");
                      }}
                      className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
                        selectedGender === g
                          ? "bg-[#111] text-white border-[#111]"
                          : "bg-white text-[#444] border-[#ddd]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActiveFilterPanel(null)}
                  className="w-full py-3 bg-[#111] text-white rounded-full font-bold text-sm"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Size panel */}
            {activeFilterPanel === "size" && (
              <div className="relative z-10 bg-white rounded-t-2xl shadow-2xl px-5 pt-4 pb-8">
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[15px] text-[#111]">
                    Shoe Size
                  </h3>
                  <button
                    onClick={() => setActiveFilterPanel(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[#888]">Select your size (EU)</p>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="text-xs font-bold text-[#d57731] underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        setSelectedSize(selectedSize === s ? "" : s)
                      }
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition ${
                        selectedSize === s
                          ? "bg-[#111] text-white border-[#111]"
                          : "bg-white text-[#444] border-[#ddd] hover:border-[#999]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActiveFilterPanel(null)}
                  className="w-full py-3 bg-[#111] text-white rounded-full font-bold text-sm"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Price panel */}
            {activeFilterPanel === "price" && (
              <div className="relative z-10 bg-white rounded-t-2xl shadow-2xl px-5 pt-4 pb-8">
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[15px] text-[#111]">
                    Price Range
                  </h3>
                  <button
                    onClick={() => setActiveFilterPanel(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {priceRanges.map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedPrice(r)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
                        selectedPrice === r
                          ? "bg-[#111] text-white border-[#111]"
                          : "bg-white text-[#444] border-[#ddd]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActiveFilterPanel(null)}
                  className="w-full py-3 bg-[#111] text-white rounded-full font-bold text-sm"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        )}

        <div className="px-4 sm:px-8 lg:px-16 pb-28 md:pb-14 mt-6 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar – desktop only */}
          <aside className="hidden md:block md:sticky md:top-24 self-start bg-[#fbddba] rounded-[20px] p-6 h-fit shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 font-semibold text-[#222]">
                <HiOutlineAdjustments className="hidden" />
                <HiOutlineAdjustments className="md:hidden" />
                <span className="md:hidden">Filters</span>
                <span className="hidden md:inline text-[13px] font-bold uppercase tracking-wider">
                  Filters
                </span>
              </div>
              {(selectedCategory !== "All" ||
                selectedGender !== "All" ||
                selectedSize !== "" ||
                selectedPrice !== "All" ||
                sortBy !== "featured") && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-bold text-[#d57731] hover:text-white hover:bg-[#d57731] bg-white px-3 py-1.5 rounded-full shadow-sm transition"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="mb-8">
              <h4 className="text-[11px] font-bold text-[#222] uppercase tracking-wider mb-3">
                Category
              </h4>
              <div className="flex flex-wrap gap-2">
                {["All", ...categories.map((c) => c.title)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${selectedCategory === cat ? "bg-[#d57731] text-white" : "bg-white text-[#555] hover:bg-[#ffeacc]"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <h4 className="text-[11px] font-bold text-[#222] uppercase tracking-wider mb-3">
                Gender
              </h4>
              <div className="flex flex-wrap gap-2">
                {["All", "Men", "Women", "Kids"].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => {
                      setSelectedGender(gender);
                      setSelectedSize("");
                    }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${selectedGender === gender ? "bg-[#d57731] text-white" : "bg-white text-[#555] hover:bg-[#ffeacc]"}`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[11px] font-bold text-[#222] uppercase tracking-wider">
                  Shoe Size
                </h4>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="text-[10px] font-bold text-[#d57731] hover:underline"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(selectedSize === size ? "" : size)
                    }
                    className={`rounded bg-white py-1.5 text-[10px] font-semibold shadow-sm transition ${selectedSize === size ? "ring-1 ring-[#d57731] text-[#d57731]" : "text-[#555] hover:ring-1 hover:ring-gray-300"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-[#222] uppercase tracking-wider mb-3">
                Price Range
              </h4>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedPrice(range)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${selectedPrice === range ? "bg-[#d57731] text-white" : "bg-white text-[#555] hover:bg-[#ffeacc]"}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Cards */}
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#f2f2f2] rounded-[20px] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition duration-300 h-fit"
                >
                  <div
                    className={`relative w-full aspect-[3/2] ${product.bg} flex items-center justify-center p-4`}
                  >
                    {product.badge && (
                      <span className="absolute top-4 left-4 bg-[#ff6b3d] text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 shadow-sm uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      className={` absolute top-4 right-4  w-9 h-9 rounded-full
    flex items-center justify-center
    transition-all duration-300
    z-10 shadow-sm
    backdrop-blur-sm
    border

    ${
      isInWishlist(product.id)
        ? "bg-gradient-to-br from-[#ff4d6d] to-[#ff758f] text-white border-transparent shadow-lg scale-105"
        : "bg-white/80 text-[#888] border-transparent hover:border-red-100 hover:text-red-500 hover:bg-white"
    }
  `}
                    >
                      {isInWishlist(product.id) ? (
                        <HiHeart size={18} />
                      ) : (
                        <HiOutlineHeart size={18} />
                      )}
                    </button>
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={handleImgError}
                      className="object-contain w-full h-full drop-shadow-2xl hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="px-3 sm:px-4 pt-2 pb-3 flex flex-col">
                    <p className="text-[#ff5c45] text-[8px] sm:text-[10px] font-bold uppercase tracking-wider mb-0.5 sm:mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-[13px] sm:text-[15px] lg:text-[17px] font-semibold text-[#222] truncate leading-tight">
                      {product.name}
                    </h3>
                    <span className="text-[12px] mt-1 sm:text-[13px] text-[#6b7280] leading-relaxed">
                      {" "}
                      {product.descriptionOne}
                    </span>

                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold text-[#0f172a]">
                        Rs. {product.price.toLocaleString()}
                      </p>
                      <select
                        value={selectedProductSizes[product.id] || ""}
                        onChange={(e) =>
                          setSelectedProductSizes((prev) => ({
                            ...prev,
                            [product.id]: e.target.value,
                          }))
                        }
                        className="text-[9px] sm:text-[11px] font-bold bg-white border border-[#eee] rounded px-1 py-0.5 outline-none"
                      >
                        <option value="" disabled>
                          Size
                        </option>
                        {product.sizes?.map((sz) => (
                          <option key={sz} value={sz}>
                            {sz}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <button
                        onClick={() =>
                          navigate(`/product/${product.slug}`, {
                            state: { productImage: product.image },
                          })
                        }
                        className="flex-1 py-2 sm:py-2.5 bg-white/90 border border-[#d1d5db] text-[#374151] text-[13px] font-medium rounded-lg hover:bg-gray-500 hover:text-white transition"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#111827] text-white flex items-center justify-center hover:bg-[#1f2937] transition"
                      >
                        <HiOutlineShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {displayedProducts.length === 0 && (
                <div className="text-center col-span-full py-14">
                  <h3 className="text-2xl font-semibold text-[#333]">
                    No products found
                  </h3>
                  <p className="text-[#666] mt-2">
                    Try changing the filter options.
                  </p>
                </div>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                document
                  .getElementById("product-grid-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="px-4 sm:px-8 lg:px-16 py-14 bg-[#f6f6f6]">
        <div className="rounded-[28px] overflow-hidden bg-[#e8ddd6] grid grid-cols-1 md:grid-cols-2 shadow-sm">
          <div className="bg-[#e7cfcf] flex items-center justify-center p-6">
            <img
              src={heritageImage}
              alt="Heritage Collection"
              className="w-full max-w-[340px] object-contain hover:scale-105 transition duration-500"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <span className="text-[#df8b4a] text-xs uppercase tracking-wide">
              Limited Edition
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1f1f1f] mt-3 leading-tight">
              The Heritage
              <br />
              Collection
            </h2>
            <p className="text-[#666] mt-4 leading-8 max-w-md">
              Discover our most enduring line yet. Handcrafted with full grain
              leather and designed to age beautifully over time.
            </p>
            <button className="mt-6 w-fit px-6 py-3 rounded-full border border-[#222] text-[#222] hover:bg-white transition duration-300">
              Explore Heritage →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CategoryPage;
