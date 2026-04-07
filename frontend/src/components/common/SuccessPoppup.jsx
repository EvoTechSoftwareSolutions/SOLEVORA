
import { motion } from "framer-motion";

const SuccessPopup = ({ message, onClose, type }) => {
  return (
    // background overlay (fade in/out)
    <motion.div
      className="popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="popup-box"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
      >
        <button className="popup-close-btn" onClick={onClose} aria-label="Close popup">
          ×
        </button>
           {/* title changes based on type */}
        <h2>
          {type === "success" ? "🎉 Thank You!" : "⚠️ Notice"}
        </h2>
        <p>{message}</p>
      </motion.div>
    </motion.div>
  );
};

export default SuccessPopup;
