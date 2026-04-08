import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingCart,
  HiOutlineAdjustments,
} from "react-icons/hi";

// Hero
import heroImage from "../../assets/category/hero-shoe.png";

// Category images
import catSneakers from "../../assets/category/cat-sneakers.png";
import catRunning from "../../assets/category/cat-running.png";
import catFormal from "../../assets/category/cat-formal.png";
import catBoots from "../../assets/category/cat-boots.png";
import catSandals from "../../assets/category/cat-sandals.png";
import catHeels from "../../assets/category/cat-heels.png";
import catLoafers from "../../assets/category/cat-loafers.png";
import catAthletic from "../../assets/category/cat-athletic.png";

// Product images
import product1 from "../../assets/category/product-1.png";
import product2 from "../../assets/category/product-2.png";
import product3 from "../../assets/category/product-3.png";
import product4 from "../../assets/category/product-4.png";
import product5 from "../../assets/category/product-5.png";
import product6 from "../../assets/category/product-6.png";
import product7 from "../../assets/category/product-7.png";
import product8 from "../../assets/category/product-8.png";
import product9 from "../../assets/category/product-9.png";

// Bottom banner
import heritageImage from "../../assets/category/heritage-shoe.png";

function CategoryPage() {
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (product) => {
    // Use a default size — user can pick proper size on the detail page
    const defaultSize = product.sizes?.[0] || "One Size";
    addToCart({ ...product, image_url: product.image }, defaultSize);
  };

  const categories = [
    {
      id: 1,
      title: "Sneakers",
      subtitle: "Classic modern kicks",
      image: catSneakers,
      count: "56 Items",
    },
    {
      id: 2,
      title: "Running",
      subtitle: "Built for performance",
      image: catRunning,
      count: "16 Items",
    },
    {
      id: 3,
      title: "Formal",
      subtitle: "Refined modern wear",
      image: catFormal,
      count: "21 Items",
    },
    {
      id: 4,
      title: "Boots",
      subtitle: "Rugged & stylish",
      image: catBoots,
      count: "8 Items",
    },
    {
      id: 5,
      title: "Sandals",
      subtitle: "Summer essentials",
      image: catSandals,
      count: "12 Items",
    },
    {
      id: 6,
      title: "Heels",
      subtitle: "Step up in style",
      image: catHeels,
      count: "9 Items",
    },
    {
      id: 7,
      title: "Loafers",
      subtitle: "Effortless comfort",
      image: catLoafers,
      count: "15 Items",
    },
    {
      id: 8,
      title: "Athletic",
      subtitle: "Train harder",
      image: catAthletic,
      count: "11 Items",
    },
  ];

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
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
        const formatted = data.map((p, index) => ({
          id: p.id,
          category: p.category?.name || "Uncategorized",
          name: p.name,
          price: parseFloat(p.price) || 0,
          image: p.image_url || fallbackImages[index % fallbackImages.length],
          bg: bgColors[index % bgColors.length],
          gender:
            p.gender ||
            (index % 3 === 0 ? "Men" : index % 3 === 1 ? "Women" : "Kids"),
          sizes: ["6", "7", "7.5", "8", "9", "10"],
          featured: p.isFeatured || false,
          badge: index === 0 ? "New" : "",
          colors: ["#333333", "#e5e7eb", "#ff6b3d"],
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const displayedProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedGender !== "All") {
      filtered = filtered.filter((item) => item.gender === selectedGender);
    }

    if (selectedSize) {
      filtered = filtered.filter((item) => item.sizes.includes(selectedSize));
    }

    if (selectedPrice !== "All") {
      filtered = filtered.filter((item) => {
        if (selectedPrice === "$0-$50")
          return item.price >= 0 && item.price <= 50;
        if (selectedPrice === "$50-$100")
          return item.price > 50 && item.price <= 100;
        if (selectedPrice === "$100-$150")
          return item.price > 100 && item.price <= 150;
        if (selectedPrice === "$150+") return item.price > 150;
        return true;
      });
    }

    if (sortBy === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => b.id - a.id);
    } else {
      filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return filtered;
  }, [products, selectedGender, selectedSize, selectedPrice, sortBy]);

  const sizes = [
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
    "13",
  ];
  const priceRanges = ["All", "$0-$50", "$50-$100", "$100-$150", "$150+"];

  return (
    <div className="bg-[#f6f6f6] min-h-screen">
      {/* Hero Section */}
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
            uncompromising comfort. Step into the new season.
          </p>

          <button className="mt-5 px-6 py-3 rounded-full bg-[#dd8e4a] hover:bg-[#c97e40] transition duration-300 text-sm sm:text-base font-medium shadow-lg">
            Shop the Collection →
          </button>
        </div>
      </section>

      {/* Category Section */}
      <section className="px-4 bg-white sm:px-8 lg:px-16 py-14">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#222]">
            Shop by Category
          </h2>
          <div className="w-12 h-[3px] rounded-full bg-[#df8b4a] mx-auto mt-3 mb-4" />
          <p className="text-[#666] text-sm sm:text-base leading-7">
            Explore our curated collections designed for every occasion, from
            high-performance athletic wear to refined evening elegance.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4 xl:grid-cols-4 sm:gap-5">
          {categories.map((item) => (
            <div
              key={item.id}
              className="transition duration-300 cursor-pointer group"
            >
              <div className="relative overflow-hidden shadow-sm rounded-xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[140px] sm:h-[160px] lg:h-[180px] object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 right-3 bg-white text-[10px] sm:text-xs px-3 py-1 rounded-full text-[#333] shadow-sm">
                  {item.count}
                </span>
              </div>

              <h3 className="mt-3 text-sm sm:text-lg font-semibold text-[#222] group-hover:text-[#e58a45] transition">
                {item.title}
              </h3>
              <p className="text-[#777] text-xs sm:text-sm mt-1">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Section */}
      <section className="bg-[#faecd9]">
        <div className="flex flex-col gap-4 px-4 py-5 sm:px-8 lg:px-16 sm:flex-row sm:items-center sm:justify-between bg-[#fbf2e1]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1f1f1f]">
              All Shoes
            </h2>
            <p className="text-[#888] text-xs">
              {displayedProducts.length} products
            </p>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border border-transparent rounded-lg px-2 py-1 text-xs text-[#555] font-semibold outline-none cursor-pointer"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div className="px-4 sm:px-8 lg:px-16 pb-14 mt-6 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 self-start bg-[#fbddba] rounded-[20px] p-6 h-fit shadow-sm">
            <div className="flex items-center gap-2 mb-5 lg:hidden font-semibold text-[#222]">
              <HiOutlineAdjustments />
              <span>Filters</span>
            </div>

            <div className="mb-8">
              <h4 className="text-[11px] font-bold text-[#222] uppercase tracking-wider mb-3">
                Gender
              </h4>
              <div className="flex flex-wrap gap-2">
                {["All", "Men", "Women", "Kids"].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setSelectedGender(gender)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${
                      selectedGender === gender
                        ? "bg-[#d57731] text-white"
                        : "bg-white text-[#555] hover:bg-[#ffeacc]"
                    }`}
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
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded bg-white py-1.5 text-[10px] font-semibold shadow-sm transition ${
                      selectedSize === size
                        ? "ring-1 ring-[#d57731] text-[#d57731]"
                        : "text-[#555] hover:ring-1 hover:ring-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-[#222] uppercase tracking-wider mb-5">
                Price Range
              </h4>
              <div className="px-1">
                <input
                  type="range"
                  className="w-full accent-[#d57731] h-1 bg-white outline-none appearance-none rounded-full"
                />
                <div className="flex justify-between text-[9px] text-[#777] font-semibold mt-2">
                  <span>$0</span>
                  <span>$50</span>
                  <span>$100</span>
                  <span>$150+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#f2f2f2] rounded-[20px] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition duration-300"
              >
                {/* Top Image Box */}
                <div
                  className={`relative w-full aspect-square ${product.bg} flex items-center justify-center p-6`}
                >
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-[#ff6b3d] text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 shadow-sm uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}

                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition z-10 shadow-sm border border-transparent hover:border-red-100 ${
                      isInWishlist(product.id)
                        ? "text-red-500"
                        : "text-[#888] hover:text-red-500 hover:bg-white"
                    }`}
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
                    className="object-contain w-full h-full drop-shadow-2xl hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Info Bottom Row */}
                <div className="px-5 pt-4 pb-5 flex flex-col">
                  <p className="text-[#ff5c45] text-[10px] font-bold uppercase tracking-wider mb-1">
                    {product.category}
                  </p>

                  <h3 className="text-[17px] font-semibold text-[#222] truncate">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-[20px] font-bold text-[#111]">
                    ${product.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-3 mt-5">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex-1 py-2.5 bg-transparent border border-[#999] text-[#222] text-xs font-semibold rounded-lg hover:bg-white transition duration-300"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="shrink-0 w-10 h-10 rounded-lg bg-[#111] text-white flex items-center justify-center hover:bg-[#333] transition duration-300 shadow-md"
                    >
                      <HiOutlineShoppingCart size={18} />
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
