import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/user/Home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Card from "../../components/ui/Card";
import cardData from "../../data/cardData";
import {
  ShoppingCartIcon,
  FaSearch,
  HiOutlineAdjustmentsHorizontal,
  FaPlus,
} from "../../components/common/icons";
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
  {
    name: "Office",
    color: "#ED7777",
    image: office,
    className: "category-circle__img",
  },
  {
    name: "Boots",
    color: "#C9A3A3",
    image: boots,
    className: "category-circle__img",
  },
  {
    name: "Brands",
    color: "#71ABE2",
    image: brands,
    className: "category-circle__img-rotate",
  },
  {
    name: "Convers",
    color: "#DF0B0B",
    image: convers,
    className: "category-circle__img",
  },
  {
    name: "Sandals",
    color: "#FAE25A",
    image: sandals,
    className: "category-circle__img-rotate",
  },
  {
    name: "Casual",
    color: "#ED7777",
    image: shoe,
    className: "category-circle__img-rotate",
  },
  {
    name: "Kids",
    color: "#fff",
    image: kids,
    className: "category-circle__img-rotate",
  },
  {
    name: "Sports",
    color: "#FD9C50",
    image: sports,
    className: "category-circle__img-rotate",
  },
  {
    name: "Ladies",
    color: "#D771D0",
    image: girls,
    className: "category-circle__img",
  },
  {
    name: "Sneakers",
    color: "#75DF8C",
    image: sneakers,
    className: "category-circle__img-rotate",
  },
];

const Home = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDbCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchDbCategories = async () => {
    try {
      const resp = await axios.get('http://localhost:5000/api/categories');
      setDbCategories(resp.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`http://localhost:5000/api/products?category=${activeCategory}`);
      setProducts(resp.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div className="main-container">
      <div className="banner">
        <div className="banner-text">
          <h1 className="banner-text">
            Get More comfortable without{" "}
            <span className="highlight">Brands</span>
          </h1>{" "}
          <p>
            asdasdas
            Discover the latest styles and must-have essentials. Fast shipping,
            easy returns, and secure checkoutshop now and find something you’ll
            love. Discover the latest styles and must-have essentials.Fast
            shipping, easy returns, and secure checkout — shop now and find
            something you’ll love.
          </p>
          <Link to="/product/1" className="shop-button">
            <ShoppingCartIcon className="icon" />
            <span>Shop now</span>
          </Link>
        </div>
        <div className="banner-image">
          <img src={shoe} alt="" />
        </div>
      </div>

      <div className="intro">
        <h1>New Collections</h1>
        <p>
          New drops are here! From casual fits to statement pieces — find what’s
          trending now and refresh your wardrobe.
        </p>
      </div>

      <section className="hero">
        <div className="filter">
          <div className="filter-categories">
            <ul>
              <li 
                className={activeCategory === 'All' ? 'active' : ''} 
                onClick={() => setActiveCategory('All')}
                style={{ cursor: 'pointer' }}
              >
                All
              </li>
              {dbCategories.map(cat => (
                <li 
                  key={cat.id} 
                  className={activeCategory === cat.name ? 'active' : ''} 
                  onClick={() => setActiveCategory(cat.name)}
                  style={{ cursor: 'pointer' }}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="search-filter">
            <HiOutlineAdjustmentsHorizontal className="filter-icon" />
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search products..." />
            </div>
          </div>
        </div>

        <div className="hero-cards">
          {loading ? (
            <div style={{ colSpan: '4', textAlign: 'center', width: '100%', padding: '40px' }}>Loading products...</div>
          ) : products.length === 0 ? (
            <div style={{ colSpan: '4', textAlign: 'center', width: '100%', padding: '40px' }}>No products found in this category.</div>
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

      <section className="categories">
        <div className="intro-section">
          <div className="intro-section__content">
            <h1 className="intro-section__title">Our trending products</h1>
            <p className="intro-section__subtitle">
              Discover the perfect pair for every step
            </p>
          </div>
          <div className="intro-section__action">
            <Link to="/category" className="intro-section__button">
              Discover More
            </Link>
          </div>
        </div>
        <div className="circle-grid">
          {categories.map((cat, index) => (
            <Link 
              to={`/category?type=${cat.name}`}
              key={index}
              className="category-circle"
              style={{ backgroundColor: cat.color, textDecoration: 'none' }}
            >
              <img src={cat.image} alt={cat.name} className={cat.className} />
              <span className="category-circle__label">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="brands">
        <h1>Top Brands</h1>
        <Swiper
          modules={[Autoplay]}
          speed={4000}
          slidesPerView={6}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            260: { slidesPerView: 2 },
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 6 },
          }}
        >
          <SwiperSlide>
            <img src={zara} alt="Zara" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={adidas} alt="Adidas" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={gucci} alt="Gucci" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={lacoste} alt="Lacoste" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={underarmour} alt="Under Armour" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={nike} alt="Nike" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={justdoit} alt="Just Do It" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={jordan} alt="Jordan" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={zara} alt="Zara" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={adidas} alt="Adidas" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={gucci} alt="Gucci" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={lacoste} alt="Lacoste" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={underarmour} alt="Under Armour" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={nike} alt="Nike" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={justdoit} alt="Just Do It" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={jordan} alt="Jordan" />
          </SwiperSlide>
        </Swiper>
      </section>

      <section className="why-us">
        <div className="why-us-intro">
          <h1>Why Shop With Us</h1>
          <p>
            Our collection focuses on premium materials, modern design, and
            everyday comfort. We make it easy for you to find the perfect pair
            of shoes that fits your lifestyle.
          </p>
          <Link to="/aboutUs" className="about__button">
            Learn More
          </Link>
        </div>

        <div className="card-box">
          <div className="why-us-card">
            <div className="why-us-card-icon">
              <img src={trust} alt="Icon" />
            </div>
            <h3>Trusted Comfort</h3>
            <p>
              Our shoes are designed to deliver lasting comfort and dependable
              quality, so every step you take feels supported and confident
              throughout the day.
            </p>
          </div>
          <div className="why-us-card long">
            <div className="why-us-card-icon">
              <img src={happyface} alt="Icon" />
            </div>
            <h3>Reliable Comfort</h3>
            <p>
              Built for everyday wear, our footwear combines comfort,
              durability, and style to support you wherever your journey takes
              you.
            </p>
          </div>
          <div className="why-us-card long">
            <div className="why-us-card-icon">
              <img src={premium} alt="Icon" />
            </div>
            <h3>Premium Footwear</h3>
            <p>
              We bring you carefully selected footwear made with premium
              materials and modern design to ensure both style and durability in
              every pair.
            </p>
          </div>
          <div className="why-us-card">
            <div className="why-us-card-icon">
              <img src={footstep} alt="Icon" />
            </div>
            <h3>Quality Steps</h3>
            <p>
              Every pair is crafted with attention to detail, giving you
              reliable performance, long-lasting quality, and comfort in every
              step.
            </p>
          </div>
        </div>
      </section>

      <section className="banner-2">
        <h1>Own the Street</h1>
        <p>Explore Men’s Footwear Trends</p>
        <Link to="/category" className="shop-button-2">
          Shop Now
        </Link>
      </section>

      <section className="faq-containers">
        <h2>Frequently Asked Questions</h2>

        <div className="search-faq">
          <FaSearch className="faq-icon" />
          <input type="text" placeholder="Search..." />
        </div>

        <div className="faqs">
          <div className="questions" onClick={() => toggleFAQ(0)}>
            <h4>Do you offer free shipping?</h4>
            <FaPlus className={`dropdown ${openIndex === 0 ? "active" : ""}`} />
          </div>

          <p className={`answer ${openIndex === 0 ? "show" : ""}`}>
            Yes, we provide free shipping on selected orders. Delivery times may
            vary depending on your location.
          </p>
        </div>

        <div className="faqs">
          <div className="questions" onClick={() => toggleFAQ(1)}>
            <h4>Do you provide outside free shipping?</h4>
            <FaPlus className={`dropdown ${openIndex === 1 ? "active" : ""}`} />
          </div>

          <p className={`answer ${openIndex === 1 ? "show" : ""}`}>
            Yes, we provide free shipping on selected orders. Delivery times may
            vary depending on your location.
          </p>
        </div>
        <div className="faqs">
          <div className="questions" onClick={() => toggleFAQ(1)}>
            <h4>How long does delivery take?</h4>
            <FaPlus className={`dropdown ${openIndex === 1 ? "active" : ""}`} />
          </div>
          <p className={`answer ${openIndex === 1 ? "show" : ""}`}>
            Delivery usually takes 3–7 business days depending on your location.
          </p>
        </div>

        <div className="faqs">
          <div className="questions" onClick={() => toggleFAQ(2)}>
            <h4>Can I return or exchange products?</h4>
            <FaPlus className={`dropdown ${openIndex === 2 ? "active" : ""}`} />
          </div>
          <p className={`answer ${openIndex === 2 ? "show" : ""}`}>
            Yes, we offer easy returns and exchanges within 7 days of delivery.
          </p>
        </div>

        <div className="faqs">
          <div className="questions" onClick={() => toggleFAQ(3)}>
            <h4>Are your products original?</h4>
            <FaPlus className={`dropdown ${openIndex === 3 ? "active" : ""}`} />
          </div>
          <p className={`answer ${openIndex === 3 ? "show" : ""}`}>
            All our products are 100% authentic and sourced from trusted
            suppliers.
          </p>
        </div>

        <div className="faqs">
          <div className="questions" onClick={() => toggleFAQ(4)}>
            <h4>Do you offer discounts or promotions?</h4>
            <FaPlus className={`dropdown ${openIndex === 4 ? "active" : ""}`} />
          </div>
          <p className={`answer ${openIndex === 4 ? "show" : ""}`}>
            Yes, we regularly offer discounts and seasonal promotions.
          </p>
        </div>

        <div className="faqs">
          <div className="questions" onClick={() => toggleFAQ(5)}>
            <h4>How can I contact customer support?</h4>
            <FaPlus className={`dropdown ${openIndex === 5 ? "active" : ""}`} />
          </div>
          <p className={`answer ${openIndex === 5 ? "show" : ""}`}>
            You can contact us via email or phone, and our support team will
            assist you promptly.
          </p>
        </div>
      </section>

      <section className="ads">
        <div className="yellow-banner">
          <div className="banner-details">
            <span className="tag">Today only</span>
            <h3>Buy One Get One Free</h3>
            <p>
              Mix and match from our entire collection. No minimum spend
              required.
            </p>

            <Link to="/category" className="deal-btn">
              Grab The Deal
            </Link>
          </div>

          <div className="banner-img">
            <img src={greenshoe} alt="offer" />
          </div>

          <div className="offer-circle">
            <span>BUY 1</span>
            <h3>GET</h3>
            <span>FREE</span>
          </div>
        </div>
        <div className="blue-banner">
          <div className="banner-details-blue">
            <span className="tag-blue">• Just Dropped</span>
            <h3>
              <span className="color1">New</span>{" "}
              <span className="color2">Arrivals</span>
            </h3>{" "}
            <p>
              Fresh kicks every week. Be first to cop the latest drops before
              they sell out.
            </p>
            <Link to="/category" className="deal-btn-blue">
              Explore New Drops
            </Link>
          </div>

          <div className="banner-img">
            <img src={redshoe} alt="offer" />
          </div>

          <div className="right-section-blue">
            <span>Exclusive Collab</span>
            <span>Limited Edition</span>
            <span>Free Shipping</span>
          </div>
        </div>
        <div className="small-banner">
          <div className="black-banner">
            <div className="top-details">
            <div className="banner-details-black">
                <span className="tag-black">• Just Dropped</span>
              <h3>
                <span className="color3">Sale</span>{" "}
                <span className="color4">Drop</span>
              </h3>{" "}
            </div>
                          <img src={brands} alt="" />

            </div>
            <div className="bottom-details">
              <div className="details-btn">
                <p>Biggest discounts of the season — all styles, all sizes</p>
                <Link to="/category" className="deal-btn-black">
                  Shop THe Sale
                </Link>
              </div>
              <div className="orange-circle">
                <h5>50%</h5>
                <span>OFF</span>
              </div>
            </div>
          </div>

        <div className="lite">
  <h2>
    Amazing Deals <br />
    Start in The Year
  </h2>

  <img src={crosslegsImg} alt="shoes" />

  <div className="lite-content">
    <div className="sale-box">
      <span>Sale</span>
      <span className="percent">40%</span>
      <span>OFF</span>
    </div>

    <p>
      Amazing deals start the year with style, comfort, and savings.
      Discover premium shoes crafted for everyday performance and lasting comfort.
      Step confidently into the new year with unbeatable prices.
    </p>
  </div>
</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
