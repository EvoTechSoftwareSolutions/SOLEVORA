import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Card from "../../components/ui/Card";
import {
  ShoppingCartIcon,
  FaSearch,
  HiOutlineAdjustmentsHorizontal,
  FaPlus,
} from "../../components/common/icons";

// Assets
import shoe from "../../assets/image/orangeshoe.png";
import crosslegsImg from "../../assets/image/crosslegs.jpg";
import redshoe from "../../assets/image/redshoe.png";
import greenshoe from "../../assets/image/greenshoe.png";
import premium from "../../assets/image/premium.svg";
import happyface from "../../assets/image/happyface.svg";
import footstep from "../../assets/image/footstep.svg";
import trust from "../../assets/image/trust.svg";
import office from "../../assets/image/office.png";
import girls from "../../assets/image/girls.png";
import sneakers from "../../assets/image/sneakers.png";
import boots from "../../assets/image/boots.png";
import brands from "../../assets/image/brands.png";
import convers from "../../assets/image/convers.png";
import kids from "../../assets/image/kids.png";
import sandals from "../../assets/image/sandals.png";
import sports from "../../assets/image/sports.png";
import zara from "../../assets/image/LogoSvg/zara-logo.svg";
import lacoste from "../../assets/image/LogoSvg/lacoste.svg";
import jordan from "../../assets/image/LogoSvg/jordan.svg";
import gucci from "../../assets/image/LogoSvg/gucci.svg";
import adidas from "../../assets/image/LogoSvg/adidas.svg";
import underarmour from "../../assets/image/LogoSvg/underarmour.svg";
import nike from "../../assets/image/LogoSvg/nike.svg";
import justdoit from "../../assets/image/LogoSvg/justdoit.svg";

const categories = [
  { name: "Office", color: "#ED7777", image: office, imgClass: "w-32 h-32" },
  { name: "Boots", color: "#C9A3A3", image: boots, imgClass: "w-32 h-32" },
  { name: "Brands", color: "#71ABE2", image: brands, imgClass: "w-40 h-40 -rotate-[15deg] -translate-x-1/2 -translate-y-1/2" },
  { name: "Convers", color: "#DF0B0B", image: convers, imgClass: "w-32 h-32" },
  { name: "Sandals", color: "#FAE25A", image: sandals, imgClass: "w-40 h-40 -rotate-[15deg] -translate-x-1/2 -translate-y-1/2" },
  { name: "Casual", color: "#ED7777", image: shoe, imgClass: "w-40 h-40 -rotate-[15deg] -translate-x-1/2 -translate-y-1/2" },
  { name: "Kids", color: "#fff", image: kids, imgClass: "w-40 h-40 -rotate-[15deg] -translate-x-1/2 -translate-y-1/2" },
  { name: "Sports", color: "#FD9C50", image: sports, imgClass: "w-40 h-40 -rotate-[15deg] -translate-x-1/2 -translate-y-1/2" },
  { name: "Ladies", color: "#D771D0", image: girls, imgClass: "w-32 h-32" },
  { name: "Sneakers", color: "#75DF8C", image: sneakers, imgClass: "w-40 h-40 -rotate-[15deg] -translate-x-1/2 -translate-y-1/2" },
];

const Home = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDbCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchDbCategories = async () => {
    try {
      const resp = await axios.get("http://localhost:5000/api/categories");
      setDbCategories(resp.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const category = activeCategory === "All" ? "" : encodeURIComponent(activeCategory);
      const endpoint = category
        ? `http://localhost:5000/api/products?category=${category}`
        : "http://localhost:5000/api/products";
      const resp = await axios.get(endpoint);
      setProducts(resp.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col w-full gap-16 overflow-x-hidden font-poppins bg-white">
      {/* Banner */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-20 lg:py-32 min-h-[600px] overflow-hidden bg-gradient-to-br from-orange-50 via-white to-accent-yellow/10">
        <div className="absolute inset-0 bg-[url('/src/assets/image/linebg.jpg')] bg-fixed bg-center opacity-[0.03] -rotate-180 z-0 pointer-events-none" />
        
        <div className="relative z-10 flex-1 max-w-2xl text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl xl:text-8xl font-black text-secondary mb-6 leading-[0.9] tracking-tighter italic">
            GET MORE <br /> COMFORTABLE <br /> WITHOUT{" "}
            <span className="bg-gradient-to-r from-accent-yellow to-accent-orange bg-clip-text text-transparent">
              LIMITS
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium italic">
            Transcending traditional footwear. Discover the latest styles and must-have essentials 
            tailored for your comfort and style. Fast shipping, easy returns, and secure checkout.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/category" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-black/10 active:scale-95 group">
              <ShoppingCartIcon size={18} />
              <span>Initiate Shop</span>
            </Link>
            <Link to="/about" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95">
              <span>Our Legacy</span>
            </Link>
          </div>
        </div>

        <div className="relative z-10 w-full lg:w-auto h-[350px] md:h-[450px] mt-16 lg:mt-0 flex justify-center items-center group">
          <div className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] bg-gradient-to-tr from-accent-orange/20 to-accent-yellow/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute w-[300px] h-[350px] md:w-[350px] md:h-[420px] bg-secondary rounded-[3rem] rotate-6 group-hover:rotate-0 transition-transform duration-1000" />
          <img 
            src={shoe} 
            alt="Orange Hero Shoe" 
            className="relative z-10 h-full object-contain -rotate-[25deg] group-hover:-rotate-[15deg] transition-transform duration-1000 drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)]" 
          />
        </div>
      </section>

      {/* Intro */}
      <section className="flex flex-col items-center bg-accent-yellow/30 w-full py-10 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-[#0f172a] mb-2">New Collections</h2>
        <p className="text-sm font-medium text-gray-500 max-w-2xl">
          New drops are here! From casual fits to statement pieces — find what’s trending now and refresh your wardrobe.
        </p>
      </section>

      {/* Hero Cards Section */}
      <section className="flex flex-col items-center w-full px-6 gap-10">
        <div className="w-full max-w-6xl p-6 rounded-2xl bg-white shadow-lg flex flex-col md:flex-row items-center gap-6 justify-between">
          <nav className="flex-1 overflow-x-auto">
            <ul className="flex flex-nowrap md:flex-wrap gap-3 list-none p-0 whitespace-nowrap">
              <li 
                onClick={() => setActiveCategory("All")}
                className={`px-5 py-2 rounded-full cursor-pointer text-sm transition-all border ${activeCategory === "All" ? "bg-accent-orange text-white" : "text-gray-500 border-gray-100 hover:bg-accent-orange hover:text-white"}`}
              >
                All
              </li>
              {dbCategories.map(cat => (
                <li 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-5 py-2 rounded-full cursor-pointer text-sm transition-all border ${activeCategory === cat.name ? "bg-accent-orange text-white" : "text-gray-500 border-gray-100 hover:bg-accent-orange hover:text-white"}`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <HiOutlineAdjustmentsHorizontal className="w-6 h-6 text-gray-500 cursor-pointer hover:text-accent-orange transition-colors" />
            <div className="relative flex-1 md:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-accent-yellow transition-all" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl py-8">
          {loading ? (
            <div className="col-span-full py-16 text-center text-gray-400">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-400">No products found in this category.</div>
          ) : products.slice(0, 3).map((item) => (
            <Card
              key={item.id}
              image={item.image_url}
              title={item.name}
              description={item.description}
              price={item.price}
              link={`/product/${item.id}`}
            />
          ))}
        </div>
      </section>

      {/* Trending Categories */}
      <section className="flex flex-col items-center bg-bg-light py-20 px-0 gap-16">
        <div className="flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-12 lg:px-20 gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">TRENDING <span className="text-primary italic">VECTORS</span></h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-2">Curated categories for high-performance style</p>
          </div>
          <Link to="/category" className="btn-primary">
            Explore All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 max-w-[1440px] mx-auto px-6 md:px-12">
          {categories.map((cat, index) => (
            <Link 
              to={`/category?type=${cat.name}`}
              key={index}
              style={{ backgroundColor: cat.color }}
              className="relative w-32 h-32 xs:w-36 xs:h-36 md:w-44 md:h-44 rounded-[2rem] overflow-hidden flex items-center justify-center shadow-sm hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group border border-white/20"
            >
              <img src={cat.image} alt={cat.name} className={`${cat.imgClass.includes('rotate') ? 'absolute' : 'relative'} ${cat.imgClass} object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-0`} />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-4 z-10 px-4 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Brands Carousel */}
      <section className="w-full bg-white text-center py-10 px-8 lg:px-20">
        <h2 className="text-5xl font-bold mb-8">Top Brands</h2>
        <Swiper
          modules={[Autoplay]}
          speed={4000}
          slidesPerView={6}
          loop={true}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          breakpoints={{
            260: { slidesPerView: 1 },
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 6 },
          }}
          className="brand-swiper"
        >
          {[zara, adidas, gucci, lacoste, underarmour, nike, justdoit, jordan].map((logo, i) => (
            <SwiperSlide key={i} className="flex items-center justify-center filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
              <img src={logo} alt={`Brand logo ${i}`} className="w-24 h-24 object-contain" />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Why Shop Us */}
      <section className="flex flex-col lg:flex-row items-center py-20 px-10 bg-accent-yellow/30 w-full gap-12">
        <div className="flex-1 text-left gap-6 flex flex-col items-start min-w-[300px]">
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight">Why Shop With Us</h2>
          <p className="text-sm leading-relaxed text-gray-900 opacity-90">
            Our collection focuses on premium materials, modern design, and everyday comfort. 
            We make it easy for you to find the perfect pair of shoes that fits your lifestyle.
          </p>
          <Link to="/aboutUs" className="px-6 py-2.5 bg-accent-orange text-white rounded-lg hover:bg-transparent hover:text-black border border-transparent hover:border-black transition-all">
            Learn More
          </Link>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: trust, title: "Trusted Comfort", desc: "Our shoes are designed to deliver lasting comfort and dependable quality, so every step you take feels supported." },
            { icon: happyface, title: "Reliable Performance", desc: "Built for everyday wear, our footwear combines comfort, durability, and style to support you everywhere." },
            { icon: premium, title: "Premium Material", desc: "We bring you carefully selected footwear made with premium materials and modern design to ensure both style and durability." },
            { icon: footstep, title: "Quality Steps", desc: "Every pair is crafted with attention to detail, giving you reliable performance, long-lasting quality and comfort." },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-start p-6 border-2 border-black rounded-3xl text-left gap-2 bg-white/40 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-accent-orange flex items-center justify-center p-2 mb-2">
                <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-tight">{item.title}</h3>
              <p className="text-[11px] leading-relaxed text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Hero Banner */}
      <section className="flex flex-col items-center justify-center w-full h-[528px] bg-[url('/src/assets/image/banner2.jpg')] bg-cover bg-center gap-6 relative group overflow-hidden">
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-700" />
        <h2 className="relative z-10 text-6xl font-black text-white text-center leading-[0.8]">Own the Street</h2>
        <p className="relative z-10 text-lg text-gray-300 font-medium">Explore Men’s Footwear Trends</p>
        <Link to="/category" className="relative z-10 px-8 py-3 bg-white text-black font-bold rounded-3xl hover:bg-black hover:text-white border-2 border-transparent hover:border-white transition-all">
          Shop Now
        </Link>
      </section>

      {/* FAQ */}
      <section className="w-full py-20 px-6 bg-[#ffe2b4] flex flex-col items-center gap-3">
        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="flex items-center gap-3 w-full max-w-md bg-white p-3 rounded-2xl shadow-sm ring-1 ring-gray-100 mb-8 focus-within:ring-2 focus-within:ring-accent-orange transition-all">
          <FaSearch className="text-gray-400" />
          <input type="text" placeholder="Search..." className="bg-transparent outline-none w-full text-sm" />
        </div>

        <div className="w-full max-w-xl space-y-4">
          {[
            { q: "Do you offer free shipping?", a: "Yes, we provide free shipping on selected orders. Delivery times may vary depending on your location." },
            { q: "How long does delivery take?", a: "Delivery usually takes 3–7 business days depending on your location." },
            { q: "Can I return or exchange products?", a: "Yes, we offer easy returns and exchanges within 7 days of delivery." },
            { q: "Are your products original?", a: "All our products are 100% authentic and sourced from trusted suppliers." },
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group" onClick={() => toggleFAQ(i)}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-800">{faq.q}</h4>
                <FaPlus className={`w-4 h-4 transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`} />
              </div>
              <p className={`mt-3 text-xs text-gray-500 leading-relaxed overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}`}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ads & Special Deals */}
      <section className="w-full py-20 px-8 lg:px-20 bg-white flex flex-col items-center gap-12">
        {/* Yellow Banner */}
        <div className="relative w-full max-w-6xl p-10 md:p-16 bg-[#F5E400] rounded-[2rem] flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-xl">
          <div className="absolute top-[-150px] right-[-150px] w-[400px] h-[400px] bg-black rounded-full" />
          <div className="relative z-10 flex-1 flex flex-col gap-2 max-w-md pt-4">
            <span className="text-xs font-bold uppercase tracking-widest">Today only</span>
            <h3 className="text-5xl md:text-7xl font-black uppercase leading-[0.8] mb-4">Buy One Get One Free</h3>
            <p className="text-sm text-gray-700 font-medium mb-6">Mix and match from our entire collection. No minimum spend required.</p>
            <Link to="/category" className="px-8 py-3 bg-black text-[#F5E400] rounded-sm font-bold hover:bg-gray-800 transition-all w-fit">
              Grab The Deal
            </Link>
          </div>
          <div className="relative z-10 mt-12 md:mt-0 flex-1 flex justify-center items-center">
            <img src={greenshoe} alt="Green Shoe Offer" className="w-[80%] hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-0 right-0 md:relative md:top-auto md:right-auto px-6 py-4 bg-orange-500 rounded-full flex flex-col items-center text-white scale-90 md:scale-110">
              <span className="text-xs">BUY 1</span>
              <span className="text-2xl font-black tracking-tighter">GET ONE</span>
              <span className="text-lg font-bold">FREE</span>
            </div>
          </div>
        </div>

        {/* Blue Banner */}
        <div className="relative w-full max-w-6xl p-10 md:p-16 bg-[#1a2332] rounded-[2rem] flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-2xl text-white">
          <div className="flex-1 flex flex-col gap-2 max-w-md">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00FFB3]">• Just Dropped</span>
            <h3 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] mb-4">
              <span className="text-white">New</span> <br />
              <span className="text-[#8000FF]">Arrivals</span>
            </h3>
            <p className="text-sm text-gray-400 mb-8 max-w-xs">Fresh kicks every week. Be first to cop the latest drops before they sell out.</p>
            <Link to="/category" className="px-8 py-3 border border-[#00FFB3] text-[#00FFB3] font-bold hover:bg-[#00FFB3] hover:text-[#1a2332] transition-all w-fit rounded-sm uppercase tracking-wider">
              Explore New Drops
            </Link>
          </div>
          <div className="flex-1 mt-12 md:mt-0 flex justify-center items-center gap-8 relative">
             <img src={redshoe} alt="Red Shoe Arrival" className="w-full hover:rotate-6 transition-transform duration-700" />
             <div className="absolute right-0 flex flex-col gap-2 text-[10px] uppercase font-bold text-gray-400 rotate-90 translate-x-12 opacity-50">
                <span>Exclusive Collab</span>
                <span>Limited Edition</span>
                <span>Free Shipping</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
