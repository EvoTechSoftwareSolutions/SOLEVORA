import { Link } from "react-router-dom";
import { ShoppingCartIcon, UserIcon } from "../../components/common/icons";
import shoe from "../../assets/image/orangeshoe.png";
import "../../styles/user/Home.css";
const Home = () => {
  return (
      <div className="banner">
        <div className="banner-text">
<h1 className="banner-text">
  Get More comfortable without <span className="highlight">Brands</span>
</h1>          <p>
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
  );
};

export default Home;
