import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiStar,
  HiCheckCircle,
} from "react-icons/hi";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import mainShoe from "../assets/view-details/main-shoe.png";
import thumb1 from "../assets/view-details/thumb-1.png";
import thumb2 from "../assets/view-details/thumb-2.png";
import thumb3 from "../assets/view-details/thumb-3.png";
import thumb4 from "../assets/view-details/thumb-4.png";
import detailInfoImage from "../assets/view-details/detail-info-image.png";

function ViewDetailsPage() {
  const { id } = useParams();

  const product = useMemo(() => {
    return {
      id: id || "1",
      category: "PREMIUM PERFORMANCE",
      name: "Solevora Elite Sneaker",
      rating: 5,
      reviews: 128,
      price: 189.0,
      oldPrice: 240.0,
      description:
        "Engineered for elite athletes and style enthusiasts alike. The Solevora Elite features a breathable mesh upper and our signature carbon-fiber energy return system.",
      sizes: ["7.0", "8.0", "9.0", "10.0", "11.0", "12.0"],
      images: [mainShoe, thumb1, thumb2, thumb3, thumb4],
      bullets: [
        "Breathable AeroWeave™ mesh upper for thermal regulation.",
        "Dynamic Cushioning System for 30% more energy return.",
        "Grippy All-Terrain outsole for superior traction on any surface.",
      ],
      specifications: [
        "Upper Material: Breathable AeroWeave™ mesh",
        "Midsole: Dynamic responsive cushioning foam",
        "Outsole: High-traction all-terrain grip",
        "Fit: Performance athletic fit",
        "Weight: Lightweight daily training model",
      ],
    };
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState("9.0");
  const [activeTab, setActiveTab] = useState("description");
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const handleAddToCart = () => {
    setCartMessage(`Added ${product.name} - Size ${selectedSize} to cart`);

    setTimeout(() => {
      setCartMessage("");
    }, 2000);
  };

  const handleWishlist = () => {
    setWishlistAdded(!wishlistAdded);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="w-full px-4 py-8 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="flex flex-wrap gap-2 mb-8 text-sm text-gray-400">
          <span className="transition cursor-pointer hover:text-[#f28b2f]">
            Home
          </span>
          <span>/</span>
          <span className="transition cursor-pointer hover:text-[#f28b2f]">
            Footwear
          </span>
          <span>/</span>
          <span className="text-[#f28b2f] font-medium">{product.name}</span>
        </div>

        <div className="grid items-start grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="bg-transparent rounded-2xl flex items-center justify-center min-h-[300px] sm:min-h-[380px] md:min-h-[450px]">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full max-w-[520px] object-contain transition duration-500 hover:scale-105"
              />
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-[68px] h-[68px] sm:w-[78px] sm:h-[78px] rounded-lg overflow-hidden border-2 transition duration-300 ${
                    selectedImage === img
                      ? "border-[#f28b2f] scale-105"
                      : "border-gray-200 hover:border-[#f28b2f]"
                  }`}
                >
                  <img
                    src={img}
                    alt={`thumbnail-${index}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-[560px]">
            <p className="text-[#f28b2f] text-sm font-semibold tracking-wide uppercase">
              {product.category}
            </p>

            <h1 className="text-4xl sm:text-5xl font-bold text-[#1f2937] leading-tight mt-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center text-[#ff8a1f]">
                {[...Array(product.rating)].map((_, index) => (
                  <HiStar key={index} className="text-lg" />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 mt-5">
              <span className="text-4xl font-bold text-[#1f2937]">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-2xl text-gray-400 line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
            </div>

            <p className="mt-5 text-base leading-8 text-gray-500 sm:text-lg">
              {product.description}
            </p>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#1f2937] font-semibold uppercase tracking-wide text-sm">
                  Select Size (US)
                </h3>
                <button
                  type="button"
                  className="text-[#f28b2f] text-sm hover:underline"
                >
                  Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-[64px] h-[46px] rounded-xl border text-sm font-medium transition duration-300 ${
                      selectedSize === size
                        ? "border-[#f28b2f] text-[#f28b2f] bg-[#fff7f1]"
                        : "border-gray-200 text-gray-600 bg-white hover:border-[#f28b2f]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-8 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-[56px] rounded-2xl bg-[#f28b2f] hover:bg-[#de7c26] text-white font-semibold text-lg transition duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <HiOutlineShoppingCart className="text-xl" />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className={`sm:w-[180px] h-[56px] rounded-2xl border font-semibold text-lg transition duration-300 flex items-center justify-center gap-2 ${
                  wishlistAdded
                    ? "border-[#f28b2f] text-[#f28b2f] bg-[#fff7f1]"
                    : "border-gray-300 bg-white text-gray-600 hover:border-[#f28b2f] hover:text-[#f28b2f]"
                }`}
              >
                <HiOutlineHeart className="text-xl" />
                {wishlistAdded ? "Added" : "Wishlist"}
              </button>
            </div>

            {cartMessage && (
              <p className="mt-4 text-sm font-medium text-green-600">
                {cartMessage}
              </p>
            )}

            <div className="flex flex-col gap-6 mt-6 text-sm text-gray-500 sm:flex-row">
              <div className="flex items-center gap-2">
                <HiOutlineTruck className="text-[#f28b2f] text-xl" />
                <span>Free Shipping</span>
              </div>

              <div className="flex items-center gap-2">
                <HiOutlineShieldCheck className="text-[#f28b2f] text-xl" />
                <span>Authenticity Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 border-b border-gray-200 mt-14">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`pb-4 text-sm sm:text-base font-medium transition ${
              activeTab === "description"
                ? "text-[#f28b2f] border-b-2 border-[#f28b2f]"
                : "text-gray-400 hover:text-[#f28b2f]"
            }`}
          >
            Description
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("specifications")}
            className={`pb-4 text-sm sm:text-base font-medium transition ${
              activeTab === "specifications"
                ? "text-[#f28b2f] border-b-2 border-[#f28b2f]"
                : "text-gray-400 hover:text-[#f28b2f]"
            }`}
          >
            Specifications
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 text-sm sm:text-base font-medium transition ${
              activeTab === "reviews"
                ? "text-[#f28b2f] border-b-2 border-[#f28b2f]"
                : "text-gray-400 hover:text-[#f28b2f]"
            }`}
          >
            Reviews ({product.reviews})
          </button>
        </div>

        {activeTab === "description" && (
          <div className="mt-0 bg-[#f0e6d4] rounded-none lg:rounded-sm px-6 sm:px-10 lg:px-16 py-10">
            <div className="grid items-center grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1f2937] mb-5">
                  Unmatched Comfort and Speed
                </h2>

                <p className="text-base leading-8 text-gray-600 sm:text-lg">
                  The Solevora Elite Sneaker represents the pinnacle of
                  footwear engineering. Designed for high-intensity training
                  and daily wear, it combines a responsive foam midsole with a
                  structural TPU frame for ultimate stability.
                </p>

                <div className="mt-8 space-y-4">
                  {product.bullets.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <HiCheckCircle className="text-[#f28b2f] text-xl mt-1" />
                      <p className="leading-7 text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <img
                  src={detailInfoImage}
                  alt="details"
                  className="w-full max-w-[430px] rounded-xl shadow-lg object-cover hover:scale-[1.01] transition duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="mt-6 bg-[#f0e6d4] px-6 sm:px-10 lg:px-16 py-10 rounded-sm">
            <h2 className="text-3xl font-bold text-[#1f2937] mb-6">
              Specifications
            </h2>
            <ul className="space-y-4 leading-8 text-gray-700">
              {product.specifications.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mt-6 bg-[#f0e6d4] px-6 sm:px-10 lg:px-16 py-10 rounded-sm">
            <h2 className="text-3xl font-bold text-[#1f2937] mb-6">
              Customer Reviews
            </h2>

            <div className="space-y-6 text-gray-700">
              <div className="p-5 bg-white shadow-sm rounded-xl">
                <p className="font-semibold">Amazingly comfortable</p>
                <p className="mt-1 text-sm text-gray-500">★★★★★</p>
                <p className="mt-3 leading-7">
                  Very light and stylish. Great for both workouts and daily wear.
                </p>
              </div>

              <div className="p-5 bg-white shadow-sm rounded-xl">
                <p className="font-semibold">Looks premium</p>
                <p className="mt-1 text-sm text-gray-500">★★★★★</p>
                <p className="mt-3 leading-7">
                  The color and finish look amazing in real life. Worth the price.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ViewDetailsPage;