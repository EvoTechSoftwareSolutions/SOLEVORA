import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineShoppingCart,
  HiOutlineHeart,
  
  HiOutlineArrowLeft,
  HiOutlinePlusCircle,
  HiOutlineTrash,
} from "react-icons/hi";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// cart item images
import cartItem1 from "../assets/cart/cart-item-1.png";
import cartItem2 from "../assets/cart/cart-item-2.png";

// suggested product images
import product1 from "../assets/cart/product-1.png";
import product2 from "../assets/cart/product-2.png";
import product3 from "../assets/cart/product-3.png";
import product4 from "../assets/cart/product-4.png";

function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Air Vora Elite",
      color: "Blaze Orange",
      size: "42",
      price: 120,
      quantity: 1,
      image: cartItem1,
      selected: true,
    },
    {
      id: 2,
      name: "Cloud Walker Pro",
      color: "Blaze Orange",
      size: "42",
      price: 120,
      quantity: 1,
      image: cartItem2,
      selected: true,
    },
  ]);

  const suggestedProducts = [
    {
      id: 1,
      brand: "Nike",
      name: "Air Max 90",
      price: 130,
      image: product1,
      category: "Basketball",
    },
    {
      id: 2,
      brand: "Adidas",
      name: "UltraBoost 23",
      price: 190,
      image: product2,
      category: "Lifestyle",
    },
    {
      id: 3,
      brand: "New Balance",
      name: "550 Vintage",
      price: 190,
      image: product3,
      category: "Performance",
    },
    {
      id: 4,
      brand: "New Balance",
      name: "550 Vintage",
      price: 190,
      image: product4,
      category: "Performance",
    },
  ];

  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  const selectedItems = cartItems.filter((item) => item.selected);

  const subtotal = useMemo(() => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [selectedItems]);

  const estimatedShipping = subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + estimatedShipping + tax;

  const toggleSelectAll = () => {
    const newValue = !allSelected;
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, selected: newValue }))
    );
  };

  const toggleSelectOne = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    alert("Checkout clicked. Backend/payment can be added later.");
  };

  const handleAddSuggested = (product) => {
    alert(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="w-full px-4 py-10 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <HiOutlineShoppingCart className="text-3xl text-[#1f1f1f]" />
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1f1f1f]">
            Shopping Cart
          </h1>
          <span className="text-[#f28b2f] font-medium text-lg">
            ({cartItems.length} items)
          </span>
        </div>

        {/* Select All */}
        <button
          type="button"
          onClick={toggleSelectAll}
          className="flex items-center gap-3 mb-8 text-[#1f1f1f] hover:text-[#f28b2f] transition duration-300"
        >
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
              allSelected
                ? "bg-[#f28b2f] border-[#f28b2f]"
                : "bg-white border-[#f28b2f]"
            }`}
          >
            {allSelected && <span className="text-xs text-white">✓</span>}
          </div>
          <span className="text-xl font-medium">Select All</span>
        </button>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Left Cart Items */}
          <div>
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#f1dfba] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-5 shadow-sm hover:shadow-md transition duration-300"
                >
                  {/* checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleSelectOne(item.id)}
                    className="self-start shrink-0 md:self-center"
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        item.selected
                          ? "bg-[#f28b2f] border-[#f28b2f]"
                          : "bg-white border-[#f28b2f]"
                      }`}
                    >
                      {item.selected && (
                        <span className="text-xs text-white">✓</span>
                      )}
                    </div>
                  </button>

                  {/* image */}
                  <div className="w-[120px] h-[95px] rounded-lg overflow-hidden bg-white shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full transition duration-300 hover:scale-105"
                    />
                  </div>

                  {/* details */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1f1f1f]">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Color :{" "}
                      <span className="text-[#7a8ca2] font-medium">
                        {item.color}
                      </span>
                    </p>
                    <p className="text-gray-500">
                      Size :{" "}
                      <span className="text-[#7a8ca2] font-medium">
                        {item.size}
                      </span>
                    </p>
                  </div>

                  {/* quantity */}
                  <div className="flex items-center border border-[#bfae89] rounded-xl overflow-hidden w-fit">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-12 h-12 flex items-center justify-center text-[#f28b2f] text-xl hover:bg-white/50 transition"
                    >
                      -
                    </button>
                    <div className="w-12 h-12 flex items-center justify-center text-[#1f1f1f] font-medium">
                      {item.quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      className="w-12 h-12 flex items-center justify-center text-[#f28b2f] text-xl hover:bg-white/50 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* price */}
                  <div className="text-3xl font-bold text-[#1f1f1f] min-w-[110px] text-left md:text-center">
                    ${item.price.toFixed(2)}
                  </div>

                  {/* remove */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-[#1f1f1f] hover:text-red-500 transition duration-300 self-start md:self-center"
                  >
                    <HiOutlineTrash className="text-2xl" />
                  </button>
                </div>
              ))}
            </div>

            {/* bottom actions */}
            <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/category"
                className="flex items-center gap-2 text-[#7c8698] text-2xl font-medium hover:text-[#f28b2f] transition duration-300"
              >
                <HiOutlineArrowLeft />
                Back
              </Link>

              <Link
                to="/category"
                className="flex items-center gap-2 text-[#f28b2f] text-2xl font-semibold hover:text-[#de7c26] transition duration-300"
              >
                <HiOutlinePlusCircle />
                Add Items
              </Link>
            </div>
          </div>

          {/* Right Summary */}
          <div className="bg-[#f3eee7] rounded-2xl shadow-lg p-8 sticky top-24">
            <h2 className="text-3xl font-bold text-[#1f1f1f] mb-8">
              Order Summary
            </h2>

            <div className="space-y-5 text-lg text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#1f1f1f] font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-[#1f1f1f] font-medium">
                  ${estimatedShipping.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between pb-5 border-b border-gray-200">
                <span>Tax</span>
                <span className="text-[#1f1f1f] font-medium">
                  ${tax.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <span className="text-3xl font-bold text-[#1f1f1f]">Total</span>
              <span className="text-4xl font-bold text-[#1f1f1f]">
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full h-[60px] mt-8 rounded-xl bg-[#f28b2f] hover:bg-[#de7c26] text-white text-2xl font-semibold transition duration-300 shadow-md hover:shadow-lg"
            >
              Checkout
            </button>

            <div className="flex justify-center gap-6 mt-8">
              <span className="inline-block w-4 h-4 bg-gray-400"></span>
              <span className="w-4 h-4 bg-[#7d9a94] inline-block"></span>
              <span className="w-4 h-4 bg-[#8dc4d7] inline-block"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Section */}
      <section className="bg-[#ead8b7] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-14">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1f1f1f]">
            Yoy May also Like
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Discover styles that match your vibe
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 xl:grid-cols-4">
          {suggestedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#f4f4f4] rounded-[32px] overflow-hidden shadow-[0_18px_35px_rgba(0,0,0,0.10)] hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(0,0,0,0.14)] transition duration-300"
            >
              {/* image */}
              <div className="relative">
                <button className="absolute top-4 right-4 w-14 h-14 rounded-full bg-white text-[#6a6a6a] flex items-center justify-center shadow-md hover:text-[#ff6b3d] transition z-10">
                  <HiOutlineHeart className="text-[26px]" />
                </button>

                <div className="w-full h-[280px] bg-[#f4f4f4]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* content */}
              <div className="px-6 pt-6 pb-7 bg-[#f4f4f4]">
                <p className="text-sm text-gray-400">{product.brand}</p>

                <h3 className="mt-3 text-[30px] leading-tight font-bold text-[#1f1f1f]">
                  {product.name}
                </h3>

                <p className="mt-4 text-[28px] font-bold text-[#ff6b3d]">
                  ${product.price}
                </p>

                <div className="flex items-center gap-4 mt-8">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 h-[64px] border-2 border-[#1f1f1f] rounded-[24px] text-[18px] sm:text-[20px] font-semibold text-[#1f1f1f] hover:bg-[#1f1f1f] hover:text-white transition duration-300 flex items-center justify-center"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleAddSuggested(product)}
                    className="w-[68px] h-[64px] rounded-[20px] bg-[#16181d] text-white flex items-center justify-center hover:bg-[#2b2e35] transition duration-300"
                  >
                    <HiOutlineShoppingCart className="text-[30px]" />
                  </button>
                </div>

                 
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ShoppingCartPage;