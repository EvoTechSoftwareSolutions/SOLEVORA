import { Link } from "react-router-dom";
import {
  ShoppingCartIcon,
  FaSearch,
  HiOutlineAdjustmentsHorizontal,
} from "../../components/common/icons";
import shoe from "../../assets/image/orangeshoe.png";
import office from "../../assets/image/office.png";
import girls from "../../assets/image/girls.png";
import sneakers from "../../assets/image/sneakers.png";
import boots from "../../assets/image/boots.png";
import brands from "../../assets/image/brands.png";
import convers from "../../assets/image/convers.png";
import kids from "../../assets/image/kids.png";
import sandals from "../../assets/image/sandals.png";
import sports from "../../assets/image/sports.png";
import "../../styles/user/Home.css";
import Card from "../../components/ui/Card";
import cardData from "../../data/cardData";



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
    </div>
  );
};

export default Home;
