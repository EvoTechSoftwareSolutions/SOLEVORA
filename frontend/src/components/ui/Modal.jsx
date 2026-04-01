import React, { useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';

const Modal = ({ isOpen, onClose, title, children, actions }) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn border border-slate-100 italic" 
                onClick={e => e.stopPropagation()}
            >
                <div className="px-8 py-6 flex justify-between items-center border-b border-white/10 bg-slate-50/50">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-secondary">{title}</h3>
                    <button 
                        className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-90" 
                        onClick={onClose}
                    >
                        <HiOutlineX size={20} />
                    </button>
                </div>
                <div className="p-8 pb-10">
                    {children}
                </div>
                {actions && (
                    <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-4 rounded-b-[2.5rem]">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
