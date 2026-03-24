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
} from "../../components/common/icons";
import shoe from "../../assets/image/orangeshoe.png";
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
  { name: "Office", color: "#ED7777", image: office, className:"category-circle__img" },
  { name: "Boots", color: "#C9A3A3", image: boots, className:"category-circle__img" },
  { name: "Brands", color: "#71ABE2", image: brands, className:"category-circle__img-rotate" },
  { name: "Convers", color: "#DF0B0B", image: convers, className:"category-circle__img" },
  { name: "Sandals", color: "#FAE25A", image: sandals, className:"category-circle__img-rotate"},
  { name: "Casual", color: "#ED7777", image: shoe, className:"category-circle__img-rotate"},
  { name: "Kids", color: "#fff", image: kids, className:"category-circle__img-rotate"},
  { name: "Sports", color: "#FD9C50", image: sports, className:"category-circle__img-rotate"},
  { name: "Ladies", color: "#D771D0", image: girls, className:"category-circle__img"},
  { name: "Sneakers", color: "#75DF8C", image: sneakers ,className:"category-circle__img-rotate"},
];
const Home = () => {
  return (
    <div className="main-container">
      <div className="banner">
        <div className="banner-text">
          <h1 className="banner-text">
            Get More comfortable without{" "}
            <span className="highlight">Brands</span>
          </h1>{" "}
          <p>
            Discover the latest styles and must-have essentials. Fast shipping,
            easy returns, and secure checkoutshop now and find something you’ll
            love. Discover the latest styles and must-have essentials.Fast
            shipping, easy returns, and secure checkout — shop now and find
            something you’ll love.
          </p>
          <Link to="/cart" className="shop-button">
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
              <li className="active">All</li>
              <li>Running</li>
              <li>Casual</li>
              <li>Lifestyle</li>
              <li>Basketball</li>
              <li>Training</li>
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
          {cardData.map((item) => (
            <Card
              key={item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              price={item.price}
              link={item.link}
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
    <div
      key={index}
      className="category-circle"
      style={{ backgroundColor: cat.color }}
    >
      <img
        src={cat.image}
        alt={cat.name}
        className={cat.className}
      />
      <span className="category-circle__label">{cat.name}</span>
    </div>
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
    disableOnInteraction: false
  }}
  breakpoints={{
    260: { slidesPerView: 2 },
    320: { slidesPerView: 2 },
    640: { slidesPerView: 3 },
    1024: { slidesPerView: 6 },
  }}
>
  <SwiperSlide><img src={zara} alt="Zara" /></SwiperSlide>
  <SwiperSlide><img src={adidas} alt="Adidas" /></SwiperSlide>
  <SwiperSlide><img src={gucci} alt="Gucci" /></SwiperSlide>
  <SwiperSlide><img src={lacoste} alt="Lacoste" /></SwiperSlide>
  <SwiperSlide><img src={underarmour} alt="Under Armour" /></SwiperSlide>
  <SwiperSlide><img src={nike} alt="Nike" /></SwiperSlide>
  <SwiperSlide><img src={justdoit} alt="Just Do It" /></SwiperSlide>
  <SwiperSlide><img src={jordan} alt="Jordan" /></SwiperSlide>
  <SwiperSlide><img src={zara} alt="Zara" /></SwiperSlide>
  <SwiperSlide><img src={adidas} alt="Adidas" /></SwiperSlide>
  <SwiperSlide><img src={gucci} alt="Gucci" /></SwiperSlide>
  <SwiperSlide><img src={lacoste} alt="Lacoste" /></SwiperSlide>
  <SwiperSlide><img src={underarmour} alt="Under Armour" /></SwiperSlide>
  <SwiperSlide><img src={nike} alt="Nike" /></SwiperSlide>
  <SwiperSlide><img src={justdoit} alt="Just Do It" /></SwiperSlide>
  <SwiperSlide><img src={jordan} alt="Jordan" /></SwiperSlide>
</Swiper>
      </section>

      <section className="why-us">
  <div className="why-us-intro">
    <h1>Why Shop With Us</h1>
    <p>
      Our collection focuses on premium materials, modern design, and everyday comfort. 
      We make it easy for you to find the perfect pair of shoes that fits your lifestyle.
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
          Our shoes are designed to deliver lasting comfort and dependable quality, 
          so every step you take feels supported and confident throughout the day.
        </p>
      </div>
     <div className="why-us-card long">
        <div className="why-us-card-icon">
          <img src={happyface} alt="Icon" />
        </div>
        <h3>Reliable Comfort</h3>
        <p>
          Built for everyday wear, our footwear combines comfort, durability, and style to support you wherever your journey takes you.
        </p>
      </div>
       <div className="why-us-card long">
        <div className="why-us-card-icon">
          <img src={premium} alt="Icon" />
        </div>
        <h3>Premium Footwear</h3>
        <p>
       We bring you carefully selected footwear made with premium materials and modern design to ensure both style and durability in every pair.
        </p>
      </div>
       <div className="why-us-card">
        <div className="why-us-card-icon">
          <img src={footstep} alt="Icon" />
        </div>
        <h3>Quality Steps</h3>
        <p>
         Every pair is crafted with attention to detail, giving you reliable performance, long-lasting quality, and comfort in every step.
        </p>
      </div>
  </div>
</section>
    </div>
  );
};

export default Home;
