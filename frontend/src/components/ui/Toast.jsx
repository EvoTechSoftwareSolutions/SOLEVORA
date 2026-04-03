import React, { useEffect, useState } from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineX } from 'react-icons/hi';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger the slide-in animation after mount
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Timer to trigger close
    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 400); // Wait for slide-out animation before unmounting
    }, duration);

    return () => {
        clearTimeout(showTimer);
        clearTimeout(closeTimer);
    };
  }, [onClose, duration]);

  const handleClose = () => {
      setIsVisible(false);
      setTimeout(onClose, 400);
  };

  return (
    <div 
        className={`fixed bottom-5 right-5 left-5 sm:left-auto sm:w-full sm:max-w-sm z-[10000] flex items-center justify-between p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-l-[6px] border border-y-white/30 border-r-white/30 overflow-hidden transition-all duration-400 ease-out transform ${
            isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full sm:translate-x-[120%] opacity-0 scale-95'
        } ${type === 'success' ? 'border-l-primary' : 'border-l-rose-500'}`}
    >
      <div className="flex items-center gap-4 z-10 relative">
        <span className={`text-2xl ${type === 'success' ? 'text-primary' : 'text-rose-500'}`}>
            {type === 'success' ? <HiOutlineCheckCircle /> : <HiOutlineExclamationCircle />}
        </span>
        <span className="font-manrope text-sm font-bold text-secondary uppercase tracking-widest italic">{message}</span>
      </div>
      
      <button 
        onClick={handleClose}
        className="text-gray-400 hover:text-secondary hover:rotate-90 transition-all p-1 z-10 relative"
      >
        <HiOutlineX size={20} />
      </button>

      {/* Progress Bar */}
      <div 
        className={`absolute bottom-0 left-0 h-1 w-full origin-left ${type === 'success' ? 'bg-primary/30' : 'bg-rose-500/30'}`}
        style={{
            animation: `toast-progress ${duration}ms linear forwards`
        }}
      />
      <style>{`
        @keyframes toast-progress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default Toast;
