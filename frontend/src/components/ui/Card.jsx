import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../../styles/user/ui/Card.css";
import { FaStar, FaRegStar } from "react-icons/fa";

const Card = ({
  image,
  title,
  description,
  price,
  link,
  rating = 0,
}) => {
  return (
    <div className="card">
      <div className="card-image">
        <img
          src={image}
          alt={title}
          onError={(e) => {
            if (e.target.src !== FALLBACK_IMG)
              e.target.src = FALLBACK_IMG;
          }}
        />
      </div>

      <div className="card-content">
        {/* Title + Rating */}
        <div className="card-title">
          <h3>{title}</h3>

       <div className="review-star">
  {[1, 2, 3, 4, 5].map((star) =>
    star <= Math.round(rating) ? (
      <FaStar key={star} className="star-icon filled" />
    ) : (
      <FaRegStar key={star} className="star-icon empty" />
    )
  )}

  <span className="rating-text">
    ({rating.toFixed(1)})
  </span>
</div>
        </div>

        {/* Description */}
        {description && (
          <p className="card-description">{description}</p>
        )}

        <hr className="hr" />

        {/* Price + Button */}
        <div className="card-price">
          {price && (
            <p>Rs. {parseFloat(price).toLocaleString()}</p>
          )}

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

Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  link: PropTypes.string,
  rating: PropTypes.number,
};

export default Card;