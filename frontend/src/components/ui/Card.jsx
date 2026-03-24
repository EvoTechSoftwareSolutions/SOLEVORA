import { Link } from "react-router-dom";
import "../../styles/user/ui/Card.css";
import { FaStar } from "react-icons/fa";

const Card = ({ image, title, description, price, link }) => {
  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt={title} />
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