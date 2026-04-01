import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";

const Card = ({ image, title, description, price, link }) => {
  return (
    <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col p-5 group w-full max-w-[300px]">
      
      {/* Image Box */}
      <div className="w-full aspect-[4/3] flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden mb-4 shrink-0">
        <img src={image} alt={title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
      </div>

      <div className="flex flex-col flex-grow gap-4">
        {/* Title + Rating */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-black uppercase tracking-tight text-secondary leading-tight line-clamp-2">{title}</h3>
          <div className="flex gap-0.5 shrink-0">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-primary text-[10px]" />
            ))}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-2 italic">{description}</p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
          {price && <p className="text-lg font-black text-primary italic">${price}</p>}
          {link && (
            <Link to={link} className="px-4 py-2 bg-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-md active:scale-95">
              EXPLORE
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
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  link: PropTypes.string,
};

export default Card;