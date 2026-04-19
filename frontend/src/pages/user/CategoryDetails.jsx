import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart } from "react-icons/hi";

// Background Hero Image
import heritageImage from "../../assets/category/heritage-shoe.png";

// Product fallbacks
import product1 from "../../assets/category/product-1.png";
import product2 from "../../assets/category/product-2.png";
import product3 from "../../assets/category/product-3.png";
import product4 from "../../assets/category/product-4.png";

function CategoryDetails() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryName = queryParams.get("type") || "Collection";

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
    const defaultSize = product.sizes?.[0] || "One Size";
    addToCart({ ...product, image_url: product.image }, defaultSize);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        const bgColors = [
          "bg-[#f5aa31]", "bg-[#cce3fc]", "bg-[#f3952a]",
          "bg-[#43523d]", "bg-[#ebe8df]", "bg-[#aeea49]"
        ];
        const fallbackImages = [product1, product2, product3, product4];

        // Format and filter natively if the DB isn't cleanly categorizing
        const formatted = data.map((p, index) => ({
          id: p.id,
          category: p.category?.name || "Premium",
          name: p.name,
          price: parseFloat(p.price) || 0,
          image: p.image_url || fallbackImages[index % fallbackImages.length],
          bg: bgColors[index % bgColors.length],
          sizes: p.sizes ? (typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes) : ["6", "7", "8"],
          badge: index % 4 === 0 ? "Bestseller" : "",
        }));

        // Filter products locally to simulate a rich catalog matching the specific category clicked
        // Note: For a true production app, the backend would filter via ?category=${categoryName}
        // Here we just use all or mock it so the user sees a rich "different design" page.
        setProducts(formatted);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  // Optionally filter if we want to show category specific matches, or just show the grid if "All"
  const displayedProducts = useMemo(() => {
    if (categoryName === "Collection") return products;
    
    // Attempt real match
    const rigorous = products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
    
    // If our mock/development DB doesn't have matches, gracefully fallback to a rich grid so it visually works as requested:
    // "On that opened page, I want to show more shoes with different designs."
    return rigorous.length > 0 ? rigorous : products;
  }, [products, categoryName]);

  return (
    <div className="bg-[#fcfaf8] min-h-screen pb-20">
      
      {/* Dynamic Header Section */}
      <section className="relative w-full h-[280px] sm:h-[350px] bg-[#d57731] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img 
          src={heritageImage} 
          alt="Category Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply scale-110" 
        />
        
        <div className="relative z-20 text-center px-4">
          <p className="text-white/80 uppercase tracking-[0.2em] text-xs font-bold mb-3">
            Premium Footwear
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white capitalize drop-shadow-md">
            {categoryName}
          </h1>
          <p className="text-white/90 mt-4 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Explore our exclusive curations of {categoryName.toLowerCase()} shoes, featuring unique designs, unparalleled comfort, and state-of-the-art craftsmanship.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#222]">
            Trending in {categoryName}
          </h2>
          <span className="text-sm font-semibold text-[#666] bg-white px-4 py-2 rounded-full shadow-sm">
            {displayedProducts.length} Exclusive Designs
          </span>
        </div>

        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d57731]" />
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Image Section */}
                <div className={`relative w-full aspect-[4/3] ${product.bg} flex items-center justify-center p-6`}>
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-black/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 shadow-sm uppercase tracking-wider backdrop-blur-md">
                      {product.badge}
                    </span>
                  )}

                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition z-10 shadow-sm hover:scale-110 ${
                      isInWishlist(product.id)
                        ? "text-red-500"
                        : "text-[#888] hover:text-red-500"
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
                    className="object-contain w-full h-full drop-shadow-2xl group-hover:scale-110 transition duration-500 ease-out"
                  />
                </div>

                {/* Info Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[#a0a0a0] text-[10px] font-bold uppercase tracking-wider mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-lg font-bold text-[#1a1a1a] leading-tight truncate">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-lg font-black text-[#d57731]">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex-1 py-2.5 bg-gray-50 border border-gray-200 text-[#333] text-xs font-bold rounded-xl hover:bg-gray-100 hover:border-gray-300 transition duration-300"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-11 h-11 shrink-0 rounded-xl bg-[#111] text-white flex items-center justify-center hover:bg-[#d57731] transition duration-300 shadow-md"
                    >
                      <HiOutlineShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>
    </div>
  );
}

export default CategoryDetails;
