import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SuccessPopup = ({ message, onClose, type }) => {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center px-6 pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-sm w-full relative z-10 pointer-events-auto text-center flex flex-col items-center border border-black/5"
      >
        <button 
          className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all text-2xl font-light" 
          onClick={onClose} 
          aria-label="Close popup"
        >
          ×
        </button>

        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg ${type === "error" ? 'bg-rose-50 text-rose-500' : 'bg-primary/10 text-primary'}`}>
            <span className="material-symbols-outlined text-4xl font-black">{type === "error" ? "priority_high" : "verified"}</span>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-tighter text-secondary mb-2 italic">
          {type === "error" ? "SYSTEM ALERT" : "TRANSMISSION SUCCESS"}
        </h2>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed italic">{message}</p>
        
        <button 
          onClick={onClose}
          className={`mt-10 w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${type === "error" ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-secondary text-white shadow-secondary/20 hover:bg-black'}`}
        >
          Acknowledge
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessPopup;
