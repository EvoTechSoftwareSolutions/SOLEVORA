import React from 'react';
import logo from '../assets/logo.png';

const Wishlist = () => {
    const wishlistItems = [
        {
            id: 1,
            name: 'Aura Runner X1',
            price: '$129.00',
            color: 'Midnight Red / White Soul',
            status: 'In Stock',
            statusColor: 'text-green-600',
            statusDot: 'bg-green-500',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRGJi7MTzKdY_WjtTKpTbqZpNrZnc4WQo03z38DHiPrLn24M-6bUs62amTIWgDAI-mUJls-VPfuwKInq5U-hfDNgXh2TQQ9WcMg1Q6EA99uNdcoyBodZv8wMPPfwDwePUJhwnGvLq_lm7I4m5DIsb2m5mnuI8_rUCtcb4xpiRjbh127qz6OZ8d2aDtC8Jq0kOtb4xVDhAaZEWFlFdJ1O0Ns-0uHy9GCuhw06nWV9ydBynDC9wBRftNktU_aDN3-G5t3j0tK6HjJ7o"
        },
        {
            id: 2,
            name: 'Velocit Low-Top',
            price: '$89.00',
            color: 'Electric Lime / Carbon',
            status: 'In Stock',
            statusColor: 'text-green-600',
            statusDot: 'bg-green-500',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxvGV4gmOupOTDj8fRSHKBufD4PBa7HFJVVRcOKBbqvc29j83ZHh3VMvjNeE5xot6RDFsJYTf8RLy6NTtaG1r7p3-4OZru3_0AwNa5hAQnF5P_oZuPNd8e5JoMFoSASxNwzWxzB6-JFAvgiksTU5Zj1slgLMSMRrbhAIOg5425q8YIB19dHIxoNPdJzX5DZVaGDD76k4QVPEVvVEcexWh2-EflYwvJ3iG-I2dHuFiLZf7nGPd9QtwLFyjZNSBWCTRqvXuw-MgTVmU"
        },
        {
            id: 3,
            name: 'Lunar Float Sandal',
            price: '$65.00',
            color: 'Sunset Pastel / Mesh',
            status: 'Low Stock',
            statusColor: 'text-amber-600',
            statusDot: 'bg-amber-500',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDk98AWUIdGzja8qf5R7ohYAVuQ17_jO6ukqJtb5EfFN-tSSKlEEC7dwkRI_H0ALJhS7E5QyqXZmiWPOHdcJEwMBRYw6UXVla3YgC-RJx_DWqw_1ZprRIgJEp6Nz-wP-zbZ_PU34rzCmOJvNPdfjGD0sPCpnnRBDYS892SIwPJupLnvWKCe9Koy70a-4CH-Ds5LWTDrgdDcDM9JwRWV6wTMjD7ryVUu6OVr27dKygETJfPmAGuMLmMhAl0wASHWH8sRpJXzWigz7k0"
        },
        {
            id: 4,
            name: 'Apex Trek Boot',
            price: '$185.00',
            color: 'Rugged Oak / Obsidian',
            status: 'In Stock',
            statusColor: 'text-green-600',
            statusDot: 'bg-green-500',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBNSSPqMiV_4Oa53MGhRi7owT3eJBl7ok0e43ag_ypjPkkSQYpwW9E4fFFMR00m23jQimGXznVwjs-RBriIV77omYIdy7lVUbgFX8JGUXfLKicozvBsAJvN8ioSSrgZ5K9Iw6wq1w1Rmsj-piAUu_9RDJy6VXoOaco6Uu8QgjnuxAo9EDMaCVUfzJA1ARXgpcSZsAnmJOXZbc5-L_07k3rqWPPXce4znUe_fvBD1rmeaFxQ6JCx49DrgeU50cfmg2JHO8BTwKfW9c"
        },
        {
            id: 5,
            name: 'Urban Classics',
            price: '$75.00',
            color: 'Canvas Black / White Edge',
            status: 'In Stock',
            statusColor: 'text-green-600',
            statusDot: 'bg-green-500',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCC9Iw_u13ONYEk2wLmdDHlqavVmUHkHTkHF7oHypss4qjNxP5JbTFc7wwKS_5iES2ZVaJkLLXhOXlCuNQ6REznOKuPC19VtKq8WcPs90QzVTsMGXI7BMA5_NLLXv9jDIUWwLzlc70oaKqGZWW56pX1wsMfCH1NWWKeDh1SdhRE7EACvoKtGTsxYbctkzTM-qDKkUGH71rZrZAVy1njC1BcULaMZ-NYfx7Qo13L1TzJ8-o1e1bYJdbycswF7SOkDtcz-2We_Ttr17k"
        },
        {
            id: 6,
            name: 'Suede Minimalist',
            price: '$110.00',
            color: 'Sand / Natural Suede',
            status: 'Sold Out',
            isSoldOut: true,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjBjvAUIkXAo4fvkDBQ3ew3ZB8xMuMfLdRo9T_ebU6kIdnoLuMSqLQqWgInw9XjVsMNvTtZevg-HbznT835Ft-MxyF18djAKfL8RhrkCgFo98dSauAC3Mui843Gf9KUvvQg8SRzlvbHEBfBTMYd5HIea-m1Wc_y3QqCgJv2ni7BhST_e51KwLeSiYrwn6PGffqrvovxeW4Rgt_oJDZuwdhC3phjFVXvAmVGlcWw6vIbOUMVLhgcZknRJqHkre094F8aWtFIqkYKJE"
        }
    ];

    return (
        <div className="p-10 bg-background-light dark:bg-background-dark min-h-full">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">My Wishlist</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Keep track of the styles you love and wait for the right moment.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-bold">search</span>
                        <input
                            className="w-full lg:w-80 pl-12 pr-6 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm shadow-sm transition-all"
                            placeholder="Search saved items..."
                            type="text"
                        />
                    </div>
                    <button className="size-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                    </button>
                    <button className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all">
                        Share List
                    </button>
                </div>
            </header>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {wishlistItems.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-300 group relative ${item.isSoldOut ? 'opacity-90' : ''}`}
                    >
                        {/* Remove Button */}
                        <button className="absolute top-8 right-8 z-10 size-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full text-slate-300 hover:text-red-500 transition-all shadow-md border border-slate-50 dark:border-slate-700">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>

                        {/* Image Box */}
                        <div className={`aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#f3f4f6] dark:bg-slate-800 relative mb-6 ${item.isSoldOut ? 'grayscale' : ''}`}>
                            <img
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                src={item.image}
                                alt={item.name}
                            />
                            {item.isSoldOut && (
                                <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                                    <span className="bg-black/70 text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] backdrop-blur-md">Sold Out</span>
                                </div>
                            )}

                            {/* Stock Status Chip */}
                            {!item.isSoldOut && (
                                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <span className={`size-1.5 ${item.statusDot} rounded-full`}></span>
                                    <span className={item.statusColor}>{item.status}</span>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="px-2 pb-2">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-extrabold text-xl leading-tight text-slate-800 dark:text-white pr-2">{item.name}</h3>
                                <p className={`font-black text-lg ${item.isSoldOut ? 'text-slate-400' : 'text-primary'}`}>{item.price}</p>
                            </div>
                            <p className="text-xs font-bold text-slate-400 mb-6">{item.color}</p>

                            {item.isSoldOut ? (
                                <button className="w-full flex items-center justify-center gap-3 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-[1.25rem] font-black text-xs uppercase tracking-wider cursor-not-allowed group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors" disabled>
                                    <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                                    Notify Me
                                </button>
                            ) : (
                                <button className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-16 flex flex-col items-center gap-6">
                <button className="px-12 py-4 border-2 border-primary/20 hover:border-primary text-primary font-black text-sm rounded-2xl transition-all hover:bg-primary/5">
                    Load More Items
                </button>
                <p className="text-[12px] font-bold text-slate-400 tracking-wide italic">Showing 5 of 12 items in your wishlist</p>
            </div>
        </div>
    );
};

export default Wishlist;
