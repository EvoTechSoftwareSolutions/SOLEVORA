import React from 'react';
import './Wishlist.css';

const Wishlist = () => {
    const wishlistItems = [
        {
            id: 1,
            name: 'Aura Runner X1',
            price: '$129.00',
            color: 'Midnight Red / White Soul',
            status: 'In Stock',
            statusColor: '#059669',
            statusDot: '#10b981',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRGJi7MTzKdY_WjtTKpTbqZpNrZnc4WQo03z38DHiPrLn24M-6bUs62amTIWgDAI-mUJls-VPfuwKInq5U-hfDNgXh2TQQ9WcMg1Q6EA99uNdcoyBodZv8wMPPfwDwePUJhwnGvLq_lm7I4m5DIsb2m5mnuI8_rUCtcb4xpiRjbh127qz6OZ8d2aDtC8Jq0kOtb4xVDhAaZEWFlFdJ1O0Ns-0uHy9GCuhw06nWV9ydBynDC9wBRftNktU_aDN3-G5t3j0tK6HjJ7o"
        },
        {
            id: 2,
            name: 'Velocit Low-Top',
            price: '$89.00',
            color: 'Electric Lime / Carbon',
            status: 'In Stock',
            statusColor: '#059669',
            statusDot: '#10b981',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxvGV4gmOupOTDj8fRSHKBufD4PBa7HFJVVRcOKBbqvc29j83ZHh3VMvjNeE5xot6RDFsJYTf8RLy6NTtaG1r7p3-4OZru3_0AwNa5hAQnF5P_oZuPNd8e5JoMFoSASxNwzWxzB6-JFAvgiksTU5Zj1slgLMSMRrbhAIOg5425q8YIB19dHIxoNPdJzX5DZVaGDD76k4QVPEVvVEcexWh2-EflYwvJ3iG-I2dHuFiLZf7nGPd9QtwLFyjZNSBWCTRqvXuw-MgTVmU"
        },
        {
            id: 3,
            name: 'Lunar Float Sandal',
            price: '$65.00',
            color: 'Sunset Pastel / Mesh',
            status: 'Low Stock',
            statusColor: '#d97706',
            statusDot: '#f59e0b',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDk98AWUIdGzja8qf5R7ohYAVuQ17_jO6ukqJtb5EfFN-tSSKlEEC7dwkRI_H0ALJhS7E5QyqXZmiWPOHdcJEwMBRYw6UXVla3YgC-RJx_DWqw_1ZprRIgJEp6Nz-wP-zbZ_PU34rzCmOJvNPdfjGD0sPCpnnRBDYS892SIwPJupLnvWKCe9Koy70a-4CH-Ds5LWTDrgdDcDM9JwRWV6wTMjD7ryVUu6OVr27dKygETJfPmAGuMLmMhAl0wASHWH8sRpJXzWigz7k0"
        },
        {
            id: 4,
            name: 'Apex Trek Boot',
            price: '$185.00',
            color: 'Rugged Oak / Obsidian',
            status: 'In Stock',
            statusColor: '#059669',
            statusDot: '#10b981',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBNSSPqMiV_4Oa53MGhRi7owT3eJBl7ok0e43ag_ypjPkkSQYpwW9E4fFFMR00m23jQimGXznVwjs-RBriIV77omYIdy7lVUbgFX8JGUXfLKicozvBsAJvN8ioSSrgZ5K9Iw6wq1w1Rmsj-piAUu_9RDJy6VXoOaco6Uu8QgjnuxAo9EDMaCVUfzJA1ARXgpcSZsAnmJOXZbc5-L_07k3rqWPPXce4znUe_fvBD1rmeaFxQ6JCx49DrgeU50cfmg2JHO8BTwKfW9c"
        },
        {
            id: 5,
            name: 'Urban Classics',
            price: '$75.00',
            color: 'Canvas Black / White Edge',
            status: 'In Stock',
            statusColor: '#059669',
            statusDot: '#10b981',
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
        <div className="wl-container">
            {/* Header */}
            <header className="wl-header">
                <div className="wl-title-section">
                    <h2>My Wishlist</h2>
                    <p>Keep track of the styles you love and wait for the right moment.</p>
                </div>

                <div className="wl-header-actions">
                    <div className="wl-search-box">
                        <span className="material-symbols-outlined wl-search-icon">search</span>
                        <input className="wl-search-input" placeholder="Search saved items..." type="text" />
                    </div>
                    <button className="wl-notify-btn">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="wl-share-btn">
                        Share List
                    </button>
                </div>
            </header>

            {/* Product Grid */}
            <div className="wl-grid">
                {wishlistItems.map((item) => (
                    <div key={item.id} className={`wl-card ${item.isSoldOut ? 'sold-out' : ''}`}>
                        {/* Remove Button */}
                        <button className="wl-remove-btn">
                            <span className="material-symbols-outlined">delete</span>
                        </button>

                        {/* Image Box */}
                        <div className="wl-img-box">
                            <img src={item.image} alt={item.name} />
                            {item.isSoldOut && (
                                <div className="wl-sold-out-overlay">
                                    <span className="wl-sold-out-badge">Sold Out</span>
                                </div>
                            )}

                            {/* Stock Status Chip */}
                            {!item.isSoldOut && (
                                <div className="wl-stock-chip">
                                    <span className="wl-dot" style={{ backgroundColor: item.statusDot }}></span>
                                    <span style={{ color: item.statusColor }}>{item.status}</span>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="wl-card-info">
                            <div className="wl-info-header">
                                <h3>{item.name}</h3>
                                <p className="wl-price" style={{ color: item.isSoldOut ? '#94a3b8' : '#ff6d2e' }}>{item.price}</p>
                            </div>
                            <p className="wl-color-text">{item.color}</p>

                            {item.isSoldOut ? (
                                <button className="wl-notify-me-btn" disabled>
                                    <span className="material-symbols-outlined">notifications_active</span>
                                    Notify Me
                                </button>
                            ) : (
                                <button className="wl-add-cart-btn">
                                    <span className="material-symbols-outlined">add_shopping_cart</span>
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="wl-footer">
                <button className="wl-load-more-btn">
                    Load More Items
                </button>
                <p className="wl-footer-text">Showing 5 of 12 items in your wishlist</p>
            </div>
        </div>
    );
};

export default Wishlist;
