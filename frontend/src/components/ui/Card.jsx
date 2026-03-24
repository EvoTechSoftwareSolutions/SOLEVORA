import { Link } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";
import "../../styles/user/ui/Card.css";

const Card = ({ id, image, title, description, price, link }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isSaved = (id && isInWishlist) ? isInWishlist(id) : false;

  const toggleWishlist = (e) => {
    e.preventDefault();
    if (isSaved) {
        removeFromWishlist(id);
    } else {
        addToWishlist({ id, image_url: image, name: title, price });
    }
  };
  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt={title} />
        <button className={`wishlist-toggle ${isSaved ? 'active' : ''}`} onClick={toggleWishlist}>
            {isSaved ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="card-content">
        {/* Title + Rating */}
        <div className="card-title">
          <h3>{title}</h3>
          <div className="review-star">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="star-icon" />
            ))}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="card-description">{description}</p>
        )}

        <hr className="hr" />

        {/* Price + Button */}
        <div className="card-price">
          {price && <p>${price}</p>}
          {link && (
            <Link to={link} className="card-button">
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;